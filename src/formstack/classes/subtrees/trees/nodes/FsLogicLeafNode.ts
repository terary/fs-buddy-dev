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
  private _predicateJson: object;
  private _option: TFsVisibilityModes;
  constructor(
    fieldId: string,
    condition: TFsLeafOperators,
    option: TFsVisibilityModes,
    predicateJson: object
  ) {
    super();
    this._fieldId = fieldId;
    this._condition = condition;
    this._option = option;
    this._predicateJson = predicateJson;
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

  get fieldJson() {
    return this._predicateJson;
  }

  get predicateJson() {
    return this._predicateJson;
  }
}

export { FsLogicLeafNode };
