import { transformers } from "../../../../../transformers";
import type { TStatusRecord } from "../../../../Evaluator/type";
import type {
  TFsFieldLogicCheckLeaf,
  TFsFieldLogicJunctionJson,
  TFsFieldLogicJunction,
  TFsJunctionOperators,
  TFsVisibilityModes,
} from "../../../types";
import { AbstractLogicNode } from "./AbstractLogicNode";

//TFsFieldLogicJunction
class FsLogicBranchNode
  extends AbstractLogicNode
  implements TFsFieldLogicJunction<TFsJunctionOperators>
{
  protected _nodeType = "FsLogicBranchNode";

  private _ownerFieldId: string;
  private _conditional: TFsJunctionOperators;
  private _action: TFsVisibilityModes;
  private _checks: TFsFieldLogicCheckLeaf[];
  private _fieldJson: TFsFieldLogicJunctionJson;
  constructor(
    ownerFieldId: string,
    conditional: TFsJunctionOperators, // bad idea to implement business logic here
    action: TFsVisibilityModes,
    checks: TFsFieldLogicCheckLeaf[],
    fieldJson: any
  ) {
    super();
    this._ownerFieldId = ownerFieldId;
    this._conditional = conditional;
    this._action = action;
    this._checks = checks;
    this._fieldJson = fieldJson;
  }

  get ownerFieldId() {
    return this._ownerFieldId;
  }

  get conditional() {
    return this._conditional;
  }
  set conditional(value) {
    this._conditional = value;
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
    const defaults = {
      action: "_ACTION_",
      conditional: "_CONDITIONAL_",
      checks: [],
    };
    // const { action, conditional, checks } = this.fieldJson;
    // this is bad.. The issue is that it's never clear what to expect in the field 'fieldJson'
    return { ...defaults, ...this.fieldJson };
  }

  getStatusMessage(
    rootFieldId: string,
    dependentChainFieldIds?: string[]
  ): TStatusRecord[] {
    // branch status message should list all children with their conditions
    const statusMessage: TStatusRecord[] = [];

    const debugMessage = transformers.Utility.jsObjectToHtmlFriendlyString({
      nodeType: "FsLogicBranchNode",
      // fieldId: node.fieldId,
      ownerFieldId: this.ownerFieldId,
      // rootFieldId: this.rootFieldId,
      action: this.action,
      conditional: this.conditional,
      json: this.fieldJson,
    });

    const { action, conditional, checks } = this.getLogicElements(); // maybe destruct with defaults?

    const message = `action: '${action}', conditional: '${conditional}', checks(${
      (checks || []).length
    }): '${transformers.Utility.jsObjectToHtmlFriendlyString({
      action,
      conditional,
      checks,
    })}'.`;

    statusMessage.push({
      severity: "debug",
      fieldId: this.ownerFieldId,
      message: debugMessage,
    });

    if (this.ownerFieldId === rootFieldId) {
      statusMessage.push({
        severity: "logic",
        fieldId: this.ownerFieldId,
        message,
        relatedFieldIds: dependentChainFieldIds,
      });
    } else {
      statusMessage.push({
        severity: "logic",
        fieldId: this.ownerFieldId,
        message: `${rootFieldId} depends on the visibility of this field.`,
        relatedFieldIds: dependentChainFieldIds,
      });
    }

    return statusMessage;
  }
}

export { FsLogicBranchNode };
