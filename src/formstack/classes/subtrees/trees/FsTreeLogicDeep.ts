import {
  IExpressionTree,
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

type LogicTreeNodeTypes = // we choose to export this, we should give it a different name

    | FsCircularDependencyNode
    | FsLogicBranchNode
    | FsLogicLeafNode
    | FsMaxDepthExceededNode;

class FsTreeLogicDeep extends AbstractFsTreeLogic<LogicTreeNodeTypes> {
  //  private _dependantFieldIds: string[] = [];
  #dependantFieldIds: TSimpleDictionary<LogicTreeNodeTypes> = {};
  dependantFieldIds_dev_debug_hard_private: TSimpleDictionary<LogicTreeNodeTypes> =
    {};

  createSubtreeAt(nodeId: string): IExpressionTree<LogicTreeNodeTypes> {
    // *tmc* needs to make this a real thing, I guess: or add it to the abstract?
    return new FsTreeLogicDeep();
  }

  private extractFieldIdFromNodeContent(
    nodeContent: LogicTreeNodeTypes
  ): string | null {
    if (nodeContent instanceof FsLogicBranchNode) {
      return nodeContent.ownerFieldId;
    } else if (nodeContent instanceof FsLogicLeafNode) {
      return nodeContent.fieldId;
    }
    return null;
  }

  getChildContentByFieldId(fieldId: string) {
    return this.#dependantFieldIds[fieldId];
  }

  private appendFieldIdNode(fieldId: string, node: LogicTreeNodeTypes) {
    // this or do a look-up of nodeId vs fieldId which is subject to change
    // node here should ALWAYS point to the same object so this is a better approach.
    //
    // one more reason to encapsulate this class, all methods that update/remove/add nodes will need to be overwritten

    this.#dependantFieldIds[fieldId] = node;
    this.dependantFieldIds_dev_debug_hard_private[fieldId] = node;
  }

  private get dependantFieldIds() {
    return Object.keys(this.#dependantFieldIds);
  }

  getDependantFieldIds(): string[] {
    // this can be calculated also doing something like (tree.getTreeContent().filter...).
    // This method guarantees order, filtering nodes does not guarantee order but is a
    //  better source of truth
    return this.dependantFieldIds;
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

  toPojoAt(
    nodeId?: string | undefined
    // transformer?: (<T>(nodeContent: T) => TNodePojo<T>) | undefined
  ): TTreePojo<LogicTreeNodeTypes> {
    const transformer = (nodeContent: LogicTreeNodeTypes) => nodeContent;
    // @ts-ignore
    return super.toPojoAt(nodeId, transformer);
  }

  isInDependentsFields(fieldId: string): boolean {
    return this.dependantFieldIds.includes(fieldId);
  }

  getCircularLogicNodes(): FsCircularDependencyNode[] {
    return this.findAllNodesOfType<FsCircularDependencyNode>(
      FsCircularDependencyNode
    );
  }

  public appendChildNodeWithContent(
    parentNodeId: string,
    nodeContent: TGenericNodeContent<TFsLogicNode>
  ): string {
    // @ts-ignore - no null
    const fieldId = this.extractFieldIdFromNodeContent(nodeContent);
    // @ts-ignore - no null
    this.appendFieldIdNode(fieldId, nodeContent);

    return super.appendChildNodeWithContent(parentNodeId, nodeContent);
  }

  static fromFieldJson(fieldJson: TFsFieldAny): FsTreeLogicDeep {
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
    const tree = new FsTreeLogicDeep(fieldJson.id || "_calc_tree_", rootNode);
    tree._action = action || null;
    // @ts-ignore - this should resolve once I figured out the other typing issues
    tree._fieldJson = logicJson;
    tree._ownerFieldId = fieldJson.id || "_calc_tree_";

    const { leafExpressions } = transformLogicLeafJsonToLogicLeafs(
      tree.fieldJson as TFsFieldLogicJunctionJson
    );

    leafExpressions.forEach((childNode: TFsLogicNode) => {
      const { condition, fieldId, option } = childNode as FsLogicLeafNode;
      const leafNode = new FsLogicLeafNode(fieldId, condition, option);
      tree.appendChildNodeWithContent(tree.rootNodeId, leafNode);
      // should this be done at a different level. I mean calculated?
    });

    return tree;
  }

  public isExistInDependencyChain(field: FsTreeField): boolean {
    return (
      this.ownerFieldId === field.fieldId ||
      this.isInDependentsFields(field.fieldId)
    );
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
