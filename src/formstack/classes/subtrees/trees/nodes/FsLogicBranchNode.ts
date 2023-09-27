import { TStatusRecord } from "../../../../../chrome-extension/type";
import type {
  TFsFieldLogicCheckLeaf,
  TFsFieldLogicJunctionJson,
  TFsVisibilityModes,
  TFsFieldLogicJunction,
  TLogicJunctionOperators,
} from "../../types";
import { AbstractNode } from "./AbstractNode";

//TFsFieldLogicJunction
class FsLogicBranchNode
  extends AbstractNode
  implements TFsFieldLogicJunction<TLogicJunctionOperators>
{
  //<TLogicJunctionOperators>
  private _ownerFieldId: string;
  private _conditional: "$and" | "$or";
  private _action: TFsVisibilityModes;
  private _logicJson: TFsFieldLogicJunctionJson;
  // private _option: TFsVisibilityModes;
  // condition: "equals" | "greaterThan"; // not sure greaterThan is valid. Need to find all valid
  // option: TFsVisibilityModes; // values of the target field (not the same as TFsFieldLogic.action)
  constructor(
    ownerFieldId: string,
    conditional: "$and" | "$or" = "$and", // bad idea to implement business logic here
    action: TFsVisibilityModes,
    logicJson: any
  ) {
    super();
    this._ownerFieldId = ownerFieldId;
    this._conditional = conditional;
    this._action = action;
    this._logicJson = logicJson;
  }

  get action() {
    return this._action;
  }

  get conditional() {
    return this._conditional;
  }

  get logicJson() {
    return this._logicJson;
  }

  get ownerFieldId() {
    return this._ownerFieldId;
  }

  getStatusMessage(dependentChainFieldIds?: string[]): TStatusRecord[] {
    const debugMessage = JSON.stringify({
      nodeType: "FsLogicBranchNode",
      // fieldId: node.fieldId,
      ownerFieldId: this.ownerFieldId,
      // rootFieldId: this.rootFieldId,
      action: this.action,
      conditional: this.conditional,
      json: this.logicJson,
    });

    return [
      {
        severity: "debug",
        message: debugMessage,
        fieldId: this.ownerFieldId,
      },
      {
        severity: "logic",
        message: `Logic: '${this.action}' if '${this.conditional}' are true.`,
        fieldId: this.ownerFieldId,
        relatedFieldIds: dependentChainFieldIds,
      },
    ];

    // const debugMessage = JSON.stringify({
    //   nodeType: "FsLogicLeafNode",
    //   english: `Logic Term: this field '${this.condition}' '${this.option}'`,
    //   fieldId: this.fieldId,
    //   rootFieldId: this.parentBranchNode.ownerFieldId,
    //   condition: this.condition,
    //   option: this.option,
    //   junctionOperator: this.parentBranchNode.conditional,
    //   json: this.fieldJson,
    // });
    // // maybe it makes sense to add getStatusMessage on FsLogicLeafNode
    // // this/it would need to reference parent (operator all/any, options)
    // const logicMessage = `logic: value of this field: '${this.condition}' is  '${this.option}' (parent: fieldId: ${this.parentBranchNode.ownerFieldId} junction: '${this.parentBranchNode.conditional}')`;

    // return [
    //   {
    //     severity: "debug",
    //     message: debugMessage,
    //     fieldId: this.fieldId,
    //   },
    //   {
    //     severity: "logic",
    //     message: logicMessage,
    //     fieldId: this.fieldId,
    //   },
    // ];
  }
}

export { FsLogicBranchNode };
