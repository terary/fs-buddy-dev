import { TNodePojo } from "predicate-tree-advanced-poc/dist/src";
import type { TStatusRecord } from "../../../../Evaluator/type";
import { AbstractLogicNode } from "./AbstractLogicNode";

class FsMaxDepthExceededNode extends AbstractLogicNode {
  toPojo(): object {
    return {
      nodeType: this.nodeType,
      error: "MAX_BRANCH_DEPTH_EXCEEDED",
    };
  }
  getStatusMessage(
    rootFieldId: string,
    dependentChainFieldIds?: string[]
  ): TStatusRecord[] {
    return [
      {
        severity: "logic",
        fieldId: "UNKNOWN",
        message: "Max Depth Exceeded in tree traversal.",
        relatedFieldIds: dependentChainFieldIds,
      },
      {
        severity: "error",
        fieldId: "UNKNOWN",
        message: "Max Depth Exceeded in tree traversal.",
        relatedFieldIds: dependentChainFieldIds,
      },
    ];
  }

  static fromPojo(
    nodePojo: TNodePojo<AbstractLogicNode>
  ): FsMaxDepthExceededNode;
  static fromPojo(nodePojo: TNodePojo<AbstractLogicNode>): AbstractLogicNode;
  static fromPojo(nodePojo: TNodePojo<AbstractLogicNode>): AbstractLogicNode {
    return new FsMaxDepthExceededNode();
  }
}
export { FsMaxDepthExceededNode };
