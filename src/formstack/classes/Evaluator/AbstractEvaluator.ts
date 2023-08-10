import { TFsFieldAny } from "../../type.field";
import { InvalidEvaluation } from "../InvalidEvaluation";
import { IEValuator } from "./IEvaluator";
import { TEvaluateRequest, TEvaluateResponse } from "./type";

abstract class AbstractEvaluator implements IEValuator {
  private _fieldJson: TFsFieldAny;
  private _fieldId: string;
  constructor(fieldJson: TFsFieldAny) {
    this._fieldJson = fieldJson;
    this._fieldId = fieldJson.id;
  }

  get fieldId() {
    return this._fieldId;
  }
  get fieldJson() {
    return this._fieldJson;
  }

  abstract evaluateWithValues<T>(
    values: TEvaluateRequest
  ): TEvaluateResponse<T>;
}
export { AbstractEvaluator };
