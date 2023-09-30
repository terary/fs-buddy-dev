import { AbstractLogicNode } from "./AbstractLogicNode";

class FsMaxDepthExceededNode extends AbstractLogicNode {
  toPojo(): object {
    return {
      nodeType: this.nodeType,
      error: "MAX_BRANCH_DEPTH_EXCEEDED",
    };
  }
}
export { FsMaxDepthExceededNode };
