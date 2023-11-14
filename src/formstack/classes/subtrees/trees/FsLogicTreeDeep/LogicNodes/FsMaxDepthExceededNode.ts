import type { TStatusRecord } from "../../../../Evaluator/type";
import { AbstractLogicNode } from "./AbstractLogicNode";

class FsMaxDepthExceededNode extends AbstractLogicNode {
  protected _nodeType = "FsMaxDepthExceededNode";

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
}
export { FsMaxDepthExceededNode };
