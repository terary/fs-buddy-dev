import { transformers } from "../../../../../transformers";
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
  protected _nodeType = "FsLogicLeafNode";
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

  set condition(value) {
    this._condition = value;
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
    const debugMessageObject = {
      nodeType: "FsLogicLeafNode",
      fieldId: this.fieldId,
      condition: this.condition,
      option: this.option,
    };

    const logicMessage = `logic: (root fieldId: ${rootFieldId}) requires  this field to '${this.condition}' ->  '${this.option}' `;
    return [
      {
        severity: "debug",
        fieldId: this.fieldId,
        message:
          transformers.Utility.jsObjectToHtmlFriendlyString(debugMessageObject),
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
