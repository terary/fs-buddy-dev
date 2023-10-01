import { TStatusRecord } from "../../../../../../chrome-extension/type";
import type {
  TFsFieldLogicCheckLeaf,
  TFsFieldLogicJunctionJson,
  TFsVisibilityModes,
  TFsFieldLogicJunction,
  TLogicJunctionOperators,
} from "../../../types";
import { AbstractLogicNode } from "./AbstractLogicNode";

//TFsFieldLogicJunction
class FsLogicBranchNode
  extends AbstractLogicNode
  implements TFsFieldLogicJunction<TLogicJunctionOperators>
{
  private _ownerFieldId: string;
  private _conditional: "$and" | "$or";
  private _action: TFsVisibilityModes;
  private _fieldJson: TFsFieldLogicJunctionJson;
  constructor(
    ownerFieldId: string,
    conditional: "$and" | "$or" = "$and", // bad idea to implement business logic here
    action: TFsVisibilityModes,
    fieldJson: any
  ) {
    super();
    this._ownerFieldId = ownerFieldId;
    this._conditional = conditional;
    this._action = action;
    this._fieldJson = fieldJson;
  }

  get ownerFieldId() {
    return this._ownerFieldId;
  }

  get conditional() {
    return this._conditional;
  }

  get action() {
    return this._action;
  }

  get fieldJson() {
    return this._fieldJson;
  }

  toPojo(): object {
    return {
      nodeType: this.nodeType,
      ownerFieldId: this.ownerFieldId,
      action: this.action,
      conditional: this.conditional,
    };
  }

  private getLogicElements() {
    const { action, conditional, checks } = this.fieldJson;
    return { action, conditional, checks };
  }

  getStatusMessage(dependentChainFieldIds?: string[]): TStatusRecord[] {
    // branch status message should list all children with their conditions
    const debugMessage = JSON.stringify({
      nodeType: "FsLogicBranchNode",
      // fieldId: node.fieldId,
      ownerFieldId: this.ownerFieldId,
      // rootFieldId: this.rootFieldId,
      action: this.action,
      conditional: this.conditional,
      json: this.fieldJson,
    });
    const { action, conditional, checks } = this.getLogicElements();
    const message = `action: '${action}', conditional: '${conditional}', checks: '${JSON.stringify(
      checks
    )}'.`;
    // const message = `requirement x=y for field id:${this.ownerFieldId}, "${this.ownerFieldLabel}"`;
    return [
      {
        severity: "debug",
        fieldId: this.ownerFieldId,
        message: debugMessage,
      },
      {
        severity: "logic",
        fieldId: this.ownerFieldId,
        message,
        // message: `Logic: '${this.action}' if '${this.conditional}' are true.`,
        relatedFieldIds: dependentChainFieldIds,
      },
    ];
  }
}

export { FsLogicBranchNode };
