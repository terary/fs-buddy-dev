import { AbstractEvaluator } from "./AbstractEvaluator";
import { TEvaluateRequest, TEvaluateResponse } from "./type";

class GenericEvaluator extends AbstractEvaluator {
  evaluateWithValues<T>(values: TEvaluateRequest): TEvaluateResponse<T> {
    return { [this.fieldId]: values[this.fieldId] as T };
  }
}

export { GenericEvaluator };
