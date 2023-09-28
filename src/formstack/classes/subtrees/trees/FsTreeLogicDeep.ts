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
} from "../types";
import { AbstractFsTreeLogic } from "./AbstractFsTreeLogic";
import { FsCircularDependencyNode } from "./nodes/FsCircularDependencyNode";
import { FsLogicBranchNode } from "./nodes/FsLogicBranchNode";
import { FsLogicLeafNode } from "./nodes/FsLogicLeafNode";
import { FsMaxDepthExceededNode } from "./nodes/FsMaxDepthExceededNode";
import { FsTreeField } from "./FsTreeField";
import { TFsFieldAny } from "../../../type.field";
import { TStatusRecord } from "../../../../chrome-extension/type";
import { AbstractNode } from "./nodes/AbstractNode";
type TFromToMap = { from: string; to: string };

type LogicTreeNodeTypes = // we choose to export this, we should give it a different name

    | FsCircularDependencyNode
    | FsLogicBranchNode
    | FsLogicLeafNode
    | FsMaxDepthExceededNode;

const fromDeepLogicTreeToPojo = (nodeContent: any): TNodePojo<any> => {
  if (nodeContent instanceof FsLogicBranchNode) {
    const { conditional, action, logicJson, ownerFieldId } = nodeContent;
    return {
      // @ts-ignore - doesn't like conditional
      conditional,
      action,
      logicJson,
      ownerFieldId,
    };
  }
  if (nodeContent instanceof FsLogicLeafNode) {
    const { fieldId, condition, option, fieldJson, predicateJson } =
      nodeContent;

    return {
      // @ts-ignore - doesn't like fieldId
      fieldId,
      condition,
      option,
      fieldJson,
      predicateJson,
    };
  }
  return {
    // @ts-ignore - doesn't like asJson
    asJson: JSON.stringify(nodeContent),
  };
};

class FsTreeLogicDeep extends AbstractFsTreeLogic<LogicTreeNodeTypes> {
  private _dependantFieldIds: string[] = [];
  private _rootFieldId!: string;

  createSubtreeAt(nodeId: string): IExpressionTree<LogicTreeNodeTypes> {
    // *tmc* needs to make this a real thing, I guess: or add it to the abstract?
    return new FsTreeLogicDeep();
  }

  public getFieldStatusMessages(): TStatusRecord[] {
    return this.nodesToStatusMessages(this.rootNodeId);
  }

  private getParentJunctionOperator(nodeId: string) {
    const nodeContent = this.getChildContentAt(nodeId);

    if (nodeContent instanceof FsLogicBranchNode) {
      return nodeContent.conditional;
    }
  }

  private nodesToStatusMessages(
    nodeId: string,
    statusMessages: TStatusRecord[] = []
  ) {
    this.getChildrenNodeIdsOf(nodeId).forEach((childNodeId) => {
      this.nodesToStatusMessages(childNodeId, statusMessages);
    });
    const node = this.getChildContentAt(nodeId);
    if (node instanceof FsLogicBranchNode) {
      statusMessages.push(
        ...node.getStatusMessage(this.getDependantFieldIds())
      );
      // this.getChildrenNodeIdsOf(nodeId).forEach((childId) => {
      //   this.nodesToStatusMessages(childId, statusMessages);
      // });
    } else if (node instanceof AbstractNode) {
      statusMessages.push(...node.getStatusMessage());
    } else {
      statusMessages.push({
        severity: "error",
        message: `Error processing node status message for unknown node type: '${typeof node}', constructor: '${
          node?.constructor ? node?.constructor.name : "no constructor"
        }'.'`,
        fieldId: null,
        relatedFieldIds: [],
      });
    }

    return statusMessages;
  }

  private x_nodesToStatusMessages(
    nodeId: string,
    statusMessages: TStatusRecord[] = []
  ) {
    const node = this.getChildContentAt(nodeId);

    if (node instanceof FsLogicBranchNode) {
      statusMessages.push(
        ...node.getStatusMessage(this.getDependantFieldIds())
      );
      this.getChildrenNodeIdsOf(nodeId).forEach((childId) => {
        this.nodesToStatusMessages(childId, statusMessages);
      });
    } else if (node instanceof AbstractNode) {
      statusMessages.push(...node.getStatusMessage());
    } //  else if (node instanceof FsCircularDependencyNode) {
    //   const message = `CIRCULAR: rootFieldId: '${
    //     this.rootFieldId
    //   }',  json: ${JSON.stringify(node)}`;

    //   statusMessages.push({
    //     severity: "info",
    //     message,
    //     fieldId: node.targetFieldId,
    //   });
    // }
    else {
      statusMessages.push({
        severity: "error",
        message: `Error processing node status message for unknown node type: '${typeof node}', constructor: '${
          node?.constructor ? node?.constructor.name : "no constructor"
        }'.'`,
        fieldId: null,
        relatedFieldIds: [],
      });
    }

    return statusMessages;
  }
  get rootFieldId() {
    if (!this._rootFieldId) {
      const nodeContent = this.getChildContentAt(this.rootNodeId);

      if (nodeContent instanceof FsLogicBranchNode) {
        this._rootFieldId = nodeContent.ownerFieldId;
      }
    }
    return this._rootFieldId;
  }

  toPojoAt(nodeId?: string | undefined): TTreePojo<LogicTreeNodeTypes> {
    return super.toPojoAt(nodeId, fromDeepLogicTreeToPojo);
  }

  private extractFieldIdFromNodeContent(
    nodeContent: LogicTreeNodeTypes
  ): string | null {
    if (nodeContent instanceof FsLogicBranchNode) {
      return nodeContent.ownerFieldId;
    } else if (nodeContent instanceof FsLogicLeafNode) {
      return nodeContent.fieldId;
    } else if (nodeContent instanceof FsCircularDependencyNode) {
      return nodeContent.targetFieldId;
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
    // @ts-ignore - may be null
    const fieldId = this.extractFieldIdFromNodeContent(nodeContent);
    if (fieldId === null) {
      console.log("Found a null");
    }
    this._dependantFieldIds.push(
      // @ts-ignore - may be null
      this.extractFieldIdFromNodeContent(nodeContent)
    );

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
      const { condition, fieldId, option, predicateJson } =
        childNode as FsLogicLeafNode;
      const leafNode = new FsLogicLeafNode(
        fieldId,
        condition,
        option,
        predicateJson,
        rootNode
      );
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
