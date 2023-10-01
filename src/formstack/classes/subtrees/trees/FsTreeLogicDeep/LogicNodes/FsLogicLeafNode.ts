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
}

export { FsLogicLeafNode };
