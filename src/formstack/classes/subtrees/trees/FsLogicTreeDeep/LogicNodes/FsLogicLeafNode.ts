import type { TStatusRecord } from "../../../../Evaluator/type";
import {
  TFsFieldLogicCheckLeaf,
  TFsLeafOperators,
  TFsVisibilityModes,
} from "../../../types";
import { AbstractLogicNode } from "./AbstractLogicNode";

//TFsFieldLogicCheckLeaf
class FsLogicLeafNode
  extends AbstractLogicNode
  implements TFsFieldLogicCheckLeaf
{
  private _fieldId: string;
  private _condition: TFsLeafOperators;

  private _option: string;
  constructor(fieldId: string, condition: TFsLeafOperators, option: string) {
    super();
    this._fieldId = fieldId;
    this._condition = condition;
    this._option = option;
  }

  get fieldId() {
    return this._fieldId;
  }
  get condition() {
    return this._condition;
  }
  get option() {
    return this._option;
  }

  toPojo(): object {
    return {
      nodeType: this.nodeType,
      fieldId: this.fieldId,
      condition: this.condition,
      option: this.option,
    };
  }
  getStatusMessage(
    rootFieldId: string,
    dependentChainFieldIds?: string[]
  ): TStatusRecord[] {
    const debugMessage = JSON.stringify({
      nodeType: "FsLogicLeafNode",
      // english: `Logic Term: this field '${this.condition}' '${this.option}'`,
      fieldId: this.fieldId,
      // rootFieldId: this.parentBranchNode?.ownerFieldId,
      condition: this.condition,
      option: this.option,
      // junctionOperator: this.parentBranchNode?.conditional,
      // json: this.fieldJson,
    });

    const logicMessage = `logic: (root fieldId: ${rootFieldId}) requires  this field to '${this.condition}' ->  '${this.option}' `;
    return [
      {
        severity: "debug",
        fieldId: this.fieldId,
        message: debugMessage,
      },
      {
        severity: "logic",
        fieldId: this.fieldId,
        message: logicMessage,
        relatedFieldIds: dependentChainFieldIds,
      },
    ];
  }
}

export { FsLogicLeafNode };
