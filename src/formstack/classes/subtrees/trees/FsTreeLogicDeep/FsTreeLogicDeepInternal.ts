import {
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
import { FsTreeField } from "../FsTreeField";
import { TFsFieldAny } from "../../../../type.field";
import { AbstractLogicNode } from "./LogicNodes/AbstractLogicNode";

class FsTreeLogicDeepInternal extends AbstractFsTreeLogic<AbstractLogicNode> {
  //  private _dependantFieldIds: string[] = [];
  #dependantFieldIds: TSimpleDictionary<AbstractLogicNode> = {};
  dependantFieldIds_dev_debug_hard_private: TSimpleDictionary<AbstractLogicNode> =
    {};

  public appendChildNodeWithContent(
    parentNodeId: string,
    nodeContent: AbstractLogicNode
  ): string {
    const fieldId = this.extractFieldIdFromNodeContent(nodeContent);

    fieldId !== null && this.appendFieldIdNode(fieldId, nodeContent);

    return super.appendChildNodeWithContent(parentNodeId, nodeContent);
  }

  private appendFieldIdNode(fieldId: string, node: AbstractLogicNode) {
    this.#dependantFieldIds[fieldId] = node;
    this.dependantFieldIds_dev_debug_hard_private[fieldId] = node;
  }

  createSubtreeAt(nodeId: string): IExpressionTree<AbstractLogicNode> {
    // *tmc* needs to make this a real thing, I guess: or add it to the abstract?
    return new FsTreeLogicDeepInternal();
  }

  private get dependantFieldIds() {
    return Object.keys(this.#dependantFieldIds);
  }

  private extractFieldIdFromNodeContent(
    nodeContent: AbstractLogicNode
  ): string | null {
    if (nodeContent instanceof FsLogicBranchNode) {
      return nodeContent.ownerFieldId;
    } else if (nodeContent instanceof FsLogicLeafNode) {
      return nodeContent.fieldId;
    } else if (nodeContent instanceof FsCircularDependencyNode) {
      return nodeContent._targetFieldId; // + "-circular";
    }
    return null;
  }

  getChildContentByFieldId<T = AbstractLogicNode>(fieldId: string) {
    return this.#dependantFieldIds[fieldId] as T;
  }
  getCircularLogicNodes(): FsCircularDependencyNode[] {
    return this.findAllNodesOfType<FsCircularDependencyNode>(
      FsCircularDependencyNode
    );
  }

  getDependantFieldIds(): string[] {
    // this can be calculated also doing something like (tree.getTreeContent().filter...).
    // This method guarantees order, filtering nodes does not guarantee order but is a
    //  better source of truth
    return this.dependantFieldIds;
  }
  public isExistInDependencyChain(field: FsTreeField): boolean {
    return (
      this.ownerFieldId === field.fieldId ||
      this.isInDependentsFields(field.fieldId)
    );
  }

  isInDependentsFields(fieldId: string): boolean {
    return this.dependantFieldIds.includes(fieldId);
  }

  toPojoAt(
    nodeId?: string | undefined
    // transformer?: (<T>(nodeContent: T) => TNodePojo<T>) | undefined
  ): TTreePojo<AbstractLogicNode> {
    const transformer = (nodeContent: AbstractLogicNode) =>
      nodeContent.toPojo();
    // @ts-ignore - doesn't like generic and the signature, I think the generic is goofed
    return super.toPojoAt(nodeId, transformer);
  }

  static fromFieldJson(fieldJson: TFsFieldAny): FsTreeLogicDeepInternal {
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

    const tree = new FsTreeLogicDeepInternal(
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

export { FsTreeLogicDeepInternal };

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
