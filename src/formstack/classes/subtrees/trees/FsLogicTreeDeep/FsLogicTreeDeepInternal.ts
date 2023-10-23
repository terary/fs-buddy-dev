import {
  AbstractTree,
  IExpressionTree,
  TTreePojo,
} from "predicate-tree-advanced-poc/dist/src";
import {
  TFsFieldLogicJunction,
  TFsFieldLogicJunctionJson,
  TFsLogicNode,
  TFsJunctionOperators,
  TSimpleDictionary,
  TFsFieldLogicCheckLeaf,
} from "../../types";
import { AbstractFsTreeLogic } from "../AbstractFsTreeLogic";
import { FsCircularDependencyNode } from "./LogicNodes/FsCircularDependencyNode";
import { FsLogicBranchNode } from "./LogicNodes/FsLogicBranchNode";
import { FsLogicLeafNode } from "./LogicNodes/FsLogicLeafNode";
import { FsFieldModel } from "../FsFieldModel";
import { TFsFieldAny } from "../../../../type.field";
import { AbstractLogicNode } from "./LogicNodes/AbstractLogicNode";
import { FsVirtualRootNode } from "./LogicNodes/FsVirtualRootNode";
import { FsLogicErrorNode } from "./LogicNodes/FsLogicErrorNode";
import { FsCircularMutualInclusiveNode } from "./LogicNodes/FsCircularMutualInclusiveNode";
import { FsCircularMutualExclusiveNode } from "./LogicNodes/FsCircularMutualExclusiveNode";

class FsLogicTreeDeepInternal extends AbstractFsTreeLogic<AbstractLogicNode> {
  private _dependantFieldIdsInOrder: string[] = [];
  #dependantFieldIdMap: TSimpleDictionary<AbstractLogicNode> = {};
  constructor(rootNodeId?: string, nodeContent?: AbstractLogicNode) {
    super(rootNodeId, nodeContent);

    // if (nodeContent !== undefined) {
    //   const fieldId = this.extractFieldIdFromNodeContentOrThrow(nodeContent);
    //   this.appendFieldIdNode(fieldId, nodeContent);
    // }
  }
  public appendChildNodeWithContent(
    parentNodeId: string,
    nodeContent: AbstractLogicNode
  ): string {
    const fieldId = this.extractFieldIdFromNodeContentOrThrow(nodeContent);

    this.appendFieldIdNode(fieldId, nodeContent);

    if (!this.isNodeIdExist(parentNodeId)) {
      throw new Error(
        `parentNodeId does not exists. parentNodeId: '${parentNodeId}'.`
      );
    }
    return super.appendChildNodeWithContent(parentNodeId, nodeContent);
  }

  private isNodeIdExist(nodeId: string) {
    return this._nodeDictionary[nodeId] !== undefined;
  }

  private appendFieldIdNode(fieldId: string, node: AbstractLogicNode) {
    this.#dependantFieldIdMap[fieldId] = node;
    this._dependantFieldIdsInOrder.push(fieldId);
  }

  createSubtreeAt(nodeId: string): IExpressionTree<AbstractLogicNode> {
    // *tmc* needs to make this a real thing, I guess: or add it to the abstract?
    return new FsLogicTreeDeepInternal();
  }

  private get dependantFieldIds() {
    return this._dependantFieldIdsInOrder.slice();
  }

  private extractFieldIdFromNodeContentOrThrow(
    nodeContent: AbstractLogicNode
  ): string {
    const fieldId = this.extractFieldIdFromNodeContent(nodeContent);
    if (fieldId === null) {
      throw new Error("Failed to extract fieldId from nodeContent.");
    }
    return fieldId;
  }

  private extractFieldIdFromNodeContent(
    nodeContent: AbstractLogicNode
  ): string | null {
    if (nodeContent instanceof FsLogicBranchNode) {
      return nodeContent.ownerFieldId;
    } else if (
      nodeContent instanceof FsLogicLeafNode ||
      nodeContent instanceof FsVirtualRootNode ||
      nodeContent instanceof FsLogicErrorNode
    ) {
      return nodeContent.fieldId;
    } else if (nodeContent instanceof FsCircularDependencyNode) {
      return nodeContent._targetFieldId; // + "-circular";
    }

    return null;
  }

  getChildContentByFieldId<T = AbstractLogicNode>(fieldId: string) {
    return this.#dependantFieldIdMap[fieldId] as T;
  }

  getCircularLogicNodes(): FsCircularDependencyNode[] {
    return this.findAllNodesOfType<FsCircularDependencyNode>(
      FsCircularDependencyNode
    );
  }

  getCircularMutuallyExclusiveLogicNodes(): FsCircularDependencyNode[] {
    return this.findAllNodesOfType<FsCircularMutualExclusiveNode>(
      FsCircularMutualExclusiveNode
    );
  }

  getCircularMutuallyInclusiveLogicNodes(): FsCircularDependencyNode[] {
    return this.findAllNodesOfType<FsCircularMutualInclusiveNode>(
      FsCircularMutualInclusiveNode
    );
  }

  getDependantFieldIds(): string[] {
    // this can be calculated also doing something like (tree.getTreeContent().filter...).
    // This method guarantees order, filtering nodes does not guarantee order but is a
    //  better source of truth
    return this.dependantFieldIds;
  }

  getLogicErrorNodes(): FsLogicErrorNode[] {
    return this.findAllNodesOfType<FsLogicErrorNode>(FsLogicErrorNode);
  }

  getAllLeafContents(): FsLogicLeafNode[] {
    return this.getTreeContentAt().filter(
      (nodeContent) => nodeContent instanceof FsLogicLeafNode
    ) as FsLogicLeafNode[];
  }

  public isExistInDependencyChain(field: FsFieldModel): boolean {
    return (
      // this.ownerFieldId === field.fieldId ||
      this.isInDependentsFields(field.fieldId)
    );
  }

  isInDependentsFields(fieldId: string): boolean {
    return this.dependantFieldIds.includes(fieldId);
  }

  toPojoAt(nodeId?: string | undefined): TTreePojo<AbstractLogicNode>;
  toPojoAt(
    nodeId?: string | undefined,
    shouldObfuscate?: boolean
  ): TTreePojo<AbstractLogicNode>;
  toPojoAt(
    nodeId?: string | undefined,
    shouldObfuscate = true
  ): TTreePojo<AbstractLogicNode> {
    const transformer = (nodeContent: AbstractLogicNode) =>
      nodeContent.toPojo();
    // @ts-ignore - doesn't like generic and the signature, I think the generic is goofed
    // return super.toPojoAt(nodeId, transformer);
    const clearPojo = super.toPojoAt(nodeId, transformer);
    if (shouldObfuscate) {
      return AbstractTree.obfuscatePojo(clearPojo);
    }
    return clearPojo;
  }

  static x_fromFieldJson(fieldJson: TFsFieldAny): FsLogicTreeDeepInternal {
    // we should be receiving fieldJson.logic, but the Abstract._fieldJson is not typed properly
    // const logicJson: TFsLogicNodeJson = fieldJson.logic;
    // or maybe always get the whole json?

    const logicJson: TFsFieldLogicJunction<TFsJunctionOperators> =
      // @ts-ignore - what is this supposed to be ?
      fieldJson.logic as TFsFieldLogicJunction<TFsJunctionOperators>;

    const { action, conditional, checks } = logicJson;

    const rootNode = new FsLogicBranchNode(
      `${fieldJson.id}`,
      conditional,
      action,
      checks as TFsFieldLogicCheckLeaf[],
      logicJson
    );

    const tree = new FsLogicTreeDeepInternal(
      fieldJson.id || "_calc_tree_",
      rootNode
    );
    tree._action = action || null;
    // @ts-ignore - this should resolve once I figured out the other typing issues
    tree._fieldJson = logicJson;
    tree._ownerFieldId = fieldJson.id || "_calc_tree_";

    const { leafExpressions } = transformLogicLeafJsonToLogicLeafs(
      tree.fieldJson as TFsFieldLogicJunctionJson
    );

    // @ts-ignore
    leafExpressions.forEach((childNode: TFsLogicNode) => {
      const { condition, fieldId, option } = childNode as FsLogicLeafNode;
      const leafNode = new FsLogicLeafNode(fieldId, condition, option);
      tree.appendChildNodeWithContent(tree.rootNodeId, leafNode);
      // should this be done at a different level. I mean calculated?
    });

    return tree;
  }
}

export { FsLogicTreeDeepInternal };

const transformLogicLeafJsonToLogicLeafs = (
  logicJson: TFsFieldLogicJunctionJson
) => {
  const { action, conditional, checks } = logicJson || {};
  const op = conditional === "all" ? "$and" : "$or";
  // this doesn't look right, we're not use "op", "action", "conditional" ?
  const leafExpressions = (checks || []).map((check) => {
    const { condition, fieldId, option } = check;
    return {
      fieldId: fieldId + "" || "__MISSING_ID__",
      fieldJson: check,
      condition: check.condition,
      option,
    };
  });
  return { leafExpressions };
};
