import {
  TFsFieldLogicCheckLeaf,
  TFsLeafOperators,
  TFsVisibilityModes,
} from "../../types";
import { AbstractNode } from "./AbstractNode";

//TFsFieldLogicCheckLeaf
class FsLogicLeafNode extends AbstractNode implements TFsFieldLogicCheckLeaf {
  private _fieldId: string;
  private _condition: TFsLeafOperators;

  private _option: TFsVisibilityModes;
  constructor(
    fieldId: string,
    condition: TFsLeafOperators,
    option: TFsVisibilityModes
  ) {
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
}

export { FsLogicLeafNode };
