import {
  IExpressionTree,
  TGenericNodeContent,
} from "predicate-tree-advanced-poc/dist/src";
import { TFsFieldAnyJson } from "../../types";
import {
  TFsFieldLogicJunctionJson,
  TFsLogicNode,
  TFsLogicNodeJson,
} from "../types";
import { AbstractFsTreeLogic } from "./AbstractFsTreeLogic";
import { FsCircularDependencyNode } from "./nodes/FsCircularDependencyNode";
import { FsLogicBranchNode } from "./nodes/FsLogicBranchNode";
import { FsLogicLeafNode } from "./nodes/FsLogicLeafNode";
import { FsMaxDepthExceededNode } from "./nodes/FsMaxDepthExceededNode";
import { FsTreeField } from "./FsTreeField";

type LogicTreeNodeTypes = // we choose to export this, we should give it a different name

    | FsCircularDependencyNode
    | FsLogicBranchNode
    | FsLogicLeafNode
    | FsMaxDepthExceededNode;

class FsTreeLogicDeep extends AbstractFsTreeLogic<LogicTreeNodeTypes> {
  private _dependantFieldIds: string[] = [];

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

  getDependantFieldIds(): string[] {
    // this can be calculated also doing something like (tree.getTreeContent().filter...).
    // This method guarantees order, filtering nodes does not guarantee order but is a
    //  better source of truth
    return this._dependantFieldIds.slice();
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

  isInDependentsFields(fieldId: string): boolean {
    return this._dependantFieldIds.includes(fieldId);
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
    this._dependantFieldIds.push(
      // @ts-ignore - may be null
      this.extractFieldIdFromNodeContent(nodeContent)
    );

    return super.appendChildNodeWithContent(parentNodeId, nodeContent);
  }

  static fromFieldJson(fieldJson: TFsFieldAnyJson): FsTreeLogicDeep {
    // we should be receiving fieldJson.logic, but the Abstract._fieldJson is not typed properly
    // const logicJson: TFsLogicNodeJson = fieldJson.logic;
    // or maybe always get the whole json?

    const logicJson: TFsLogicNodeJson =
      fieldJson.logic as TFsFieldLogicJunctionJson;
    const { action, conditional } = logicJson; // as TFsFieldLogicJunctionJson

    const rootNode = new FsLogicBranchNode(
      fieldJson.id || "__MISSING_ID__",
      conditional,
      action || "Show", // *tmc* shouldn't be implementing business logic here
      logicJson
    );
    const tree = new FsTreeLogicDeep(fieldJson.id || "_calc_tree_", rootNode);
    tree._action = action || null;
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
