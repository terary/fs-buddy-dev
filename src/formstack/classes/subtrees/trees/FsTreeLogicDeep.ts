import {
  IExpressionTree,
  ITree,
  TGenericNodeContent,
  TNodePojo,
  TTreePojo,
} from "predicate-tree-advanced-poc/dist/src";
import { TFsFieldAnyJson } from "../../types";
import {
  TFsFieldLogicJunction,
  TFsFieldLogicJunctionJson,
  TFsLogicNode,
  TFsLogicNodeJson,
  TLogicJunctionOperators,
  TSimpleDictionary,
} from "../types";
import { AbstractFsTreeLogic } from "./AbstractFsTreeLogic";
import { FsCircularDependencyNode } from "./nodes/FsCircularDependencyNode";
import { FsLogicBranchNode } from "./nodes/FsLogicBranchNode";
import { FsLogicLeafNode } from "./nodes/FsLogicLeafNode";
import { FsMaxDepthExceededNode } from "./nodes/FsMaxDepthExceededNode";
import { FsTreeField } from "./FsTreeField";
import { TFsFieldAny } from "../../../type.field";
import { AbstractLogicNode } from "./nodes/AbstractLogicNode";

class FsTreeLogicDeepInternal extends AbstractFsTreeLogic<AbstractLogicNode> {
  //  private _dependantFieldIds: string[] = [];
  #dependantFieldIds: TSimpleDictionary<AbstractLogicNode> = {};
  dependantFieldIds_dev_debug_hard_private: TSimpleDictionary<AbstractLogicNode> =
    {};

  createSubtreeAt(nodeId: string): IExpressionTree<AbstractLogicNode> {
    // *tmc* needs to make this a real thing, I guess: or add it to the abstract?
    return new FsTreeLogicDeepInternal();
  }
  private get dependantFieldIds() {
    return Object.keys(this.#dependantFieldIds);
  }
  public appendChildNodeWithContent(
    parentNodeId: string,
    nodeContent: AbstractLogicNode
    // nodeContent: TGenericNodeContent<TFsLogicNode>
  ): string {
    const fieldId = this.extractFieldIdFromNodeContent(nodeContent);
    // @ts-ignore - no null
    this.appendFieldIdNode(fieldId, nodeContent);

    return super.appendChildNodeWithContent(parentNodeId, nodeContent);
    // return super.appendChildNodeWithContent(parentNodeId, nodeContent as TGenericNodeContent<AbstractLogicNode>);
  }

  getDependentFieldIds(): string[] {
    return this.getTreeContentAt(this.rootNodeId, true)
      .filter((nodeContent) => {
        return (
          nodeContent instanceof FsLogicBranchNode ||
          nodeContent instanceof FsLogicLeafNode
        );
      })
      .map((nodeContent) => {
        if (nodeContent instanceof FsLogicBranchNode) {
          return nodeContent.ownerFieldId || "_MISSING_FIELD_ID_";
        }
        return (nodeContent as FsLogicLeafNode).fieldId;
      });
  }

  getChildContentByFieldId<T = AbstractLogicNode>(fieldId: string) {
    return this.#dependantFieldIds[fieldId] as T;
  }

  private appendFieldIdNode(fieldId: string, node: AbstractLogicNode) {
    // this or do a look-up of nodeId vs fieldId which is subject to change
    // node here should ALWAYS point to the same object so this is a better approach.
    //
    // one more reason to encapsulate this class, all methods that update/remove/add nodes will need to be overwritten

    this.#dependantFieldIds[fieldId] = node;
    this.dependantFieldIds_dev_debug_hard_private[fieldId] = node;
  }

  getDependantFieldIds(): string[] {
    // this can be calculated also doing something like (tree.getTreeContent().filter...).
    // This method guarantees order, filtering nodes does not guarantee order but is a
    //  better source of truth
    return this.dependantFieldIds;
  }

  static fromFieldJson(fieldJson: TFsFieldAny): FsTreeLogicDeepInternal {
    // we should be receiving fieldJson.logic, but the Abstract._fieldJson is not typed properly
    // const logicJson: TFsLogicNodeJson = fieldJson.logic;
    // or maybe always get the whole json?

    const logicJson: TFsFieldLogicJunction<TLogicJunctionOperators> =
      // @ts-ignore - what is this supposed to be ?
      fieldJson.logic as TFsFieldLogicJunction<TLogicJunctionOperators>;

    const { action, conditional } = logicJson;

    const rootNode = new FsLogicBranchNode(
      fieldJson.id || "__MISSING_ID__",
      // @ts-ignore - maybe doesn't like '$in' potentially $and/$or
      conditional as TLogicJunctionOperators,
      action || "Show", // *tmc* shouldn't be implementing business logic here
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
  isInDependentsFields(fieldId: string): boolean {
    return this.dependantFieldIds.includes(fieldId);
  }

  getCircularLogicNodes(): FsCircularDependencyNode[] {
    return this.findAllNodesOfType<FsCircularDependencyNode>(
      FsCircularDependencyNode
    );
  }

  public isExistInDependencyChain(field: FsTreeField): boolean {
    return (
      this.ownerFieldId === field.fieldId ||
      this.isInDependentsFields(field.fieldId)
    );
  }
  private extractFieldIdFromNodeContent(
    nodeContent: AbstractLogicNode
  ): string | null {
    if (nodeContent instanceof FsLogicBranchNode) {
      return nodeContent.ownerFieldId;
    } else if (nodeContent instanceof FsLogicLeafNode) {
      return nodeContent.fieldId;
    }
    return null;
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
}

class FsTreeLogicDeep {
  private _fsDeepLogicTree!: FsTreeLogicDeepInternal;

  constructor(rootNodeId?: string, nodeContent?: AbstractLogicNode) {
    this._fsDeepLogicTree = new FsTreeLogicDeepInternal(
      rootNodeId,
      nodeContent
    );
  }
  getChildContentAt(
    nodeId: string
  ): AbstractLogicNode | ITree<AbstractLogicNode> | null {
    return this._fsDeepLogicTree.getChildContentAt(nodeId);
  }

  getCircularLogicNodes(): FsCircularDependencyNode[] {
    return this._fsDeepLogicTree.getCircularLogicNodes();
    // return this.findAllNodesOfType<FsCircularDependencyNode>(
    //   FsCircularDependencyNode
    // );
  }

  get ownerFieldId() {
    return this._fsDeepLogicTree.ownerFieldId;
  }

  set ownerFieldId(ownerFieldId: string) {
    this._fsDeepLogicTree.ownerFieldId = ownerFieldId;
  }

  get rootNodeId() {
    return this._fsDeepLogicTree.rootNodeId;
  }

  isExistInDependencyChain(field: FsTreeField) {
    return this._fsDeepLogicTree.isExistInDependencyChain(field);
  }
  getTreeNodeIdsAt(nodeId: string): string[] {
    return this._fsDeepLogicTree.getTreeNodeIdsAt(nodeId);
  }

  toPojoAt(nodeId?: string | undefined): TTreePojo<AbstractLogicNode> {
    // this will almost always be root is it necessary are a parameter here?
    return this._fsDeepLogicTree.toPojoAt(nodeId);
  }

  getTreeContentAt(
    nodeId?: string | undefined,
    shouldIncludeSubtrees?: boolean | undefined
  ): TGenericNodeContent<AbstractLogicNode>[] {
    return this._fsDeepLogicTree.getTreeContentAt(
      nodeId,
      shouldIncludeSubtrees
    );
  }

  getChildContentByFieldId<T = AbstractLogicNode>(fieldId: string) {
    return this._fsDeepLogicTree.getChildContentByFieldId(fieldId);
    // return this.#dependantFieldIds[fieldId] as T;
  }

  x_getDependantFieldIds(): string[] {
    return this._fsDeepLogicTree.getDependantFieldIds();
  }

  getDependentFieldIds(): string[] {
    return this._fsDeepLogicTree.getDependantFieldIds();
  }

  public appendChildNodeWithContent(
    parentNodeId: string,
    nodeContent: AbstractLogicNode
    // nodeContent: TGenericNodeContent<TFsLogicNode>
  ): string {
    return this._fsDeepLogicTree.appendChildNodeWithContent(
      parentNodeId,
      nodeContent
    );
  }

  static fromFieldJson(fieldJson: TFsFieldAny): FsTreeLogicDeep {
    const internalTree = FsTreeLogicDeepInternal.fromFieldJson(fieldJson);
    const tree = new FsTreeLogicDeep();
    tree._fsDeepLogicTree = internalTree;

    return tree;
  }
}
export { FsTreeLogicDeep };

const transformLogicLeafJsonToLogicLeafs = (
  logicJson: TFsFieldLogicJunctionJson
) => {
  const { action, conditional, checks } = logicJson || {};
  const op = conditional === "all" ? "$and" : "$or";

  const leafExpressions = (checks || []).map((check) => {
    const { condition, field, option } = check;
    return {
      fieldId: field + "" || "__MISSING_ID__",
      fieldJson: check,
      condition: check.condition,
      option,
    };
  });
  return { leafExpressions };
};
