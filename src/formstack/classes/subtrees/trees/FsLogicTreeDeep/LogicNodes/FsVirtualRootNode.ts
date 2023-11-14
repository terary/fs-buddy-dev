import { TNodePojo } from "predicate-tree-advanced-poc/dist/src";
import { AbstractLogicNode } from "./AbstractLogicNode";
import type { TStatusRecord } from "../../../../Evaluator/type";
import { TFsFieldLogicJunction, TFsJunctionOperators } from "../../../types";

class FsVirtualRootNode extends AbstractLogicNode {
  protected _nodeType = "FsVirtualRootNode";

  private _fieldId: string;
  private _conditional: TFsJunctionOperators = "all";
  constructor(fieldId: string) {
    super();
    this._fieldId = fieldId;
  }

  get fieldId() {
    return this._fieldId;
  }

  get conditional() {
    return this._conditional;
  }

  toPojo(): object {
    return {
      nodeType: this.nodeType,
      fieldId: this.fieldId,
      conditional: this.conditional,
    };
  }

  getStatusMessage(
    rootFieldId: string,
    dependentChainFieldIds?: string[]
  ): TStatusRecord[] {
    // branch status message should list all children with their conditions
    const statusMessage: TStatusRecord[] = [];

    const debugMessage = JSON.stringify({
      nodeType: "FsLogicBranchNode",
      // fieldId: node.fieldId,
      fieldId: this.fieldId,
      // rootFieldId: this.rootFieldId,
      // action: this.action,
      conditional: this.conditional,
      // json: this.fieldJson,
    });

    const message = "Virtual Branch";
    statusMessage.push({
      severity: "debug",
      fieldId: this.fieldId,
      message: debugMessage,
    });

    if (this.fieldId === rootFieldId) {
      statusMessage.push({
        severity: "logic",
        fieldId: this.fieldId,
        message,
        relatedFieldIds: dependentChainFieldIds,
      });
    } else {
      statusMessage.push({
        severity: "logic",
        fieldId: this.fieldId,
        message: `${rootFieldId} virtual node.`,
        relatedFieldIds: dependentChainFieldIds,
      });
    }

    return statusMessage;
  }
}
export { FsVirtualRootNode };
