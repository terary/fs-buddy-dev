import { AbstractEvaluator } from "./AbstractEvaluator";
import { TEvaluateRequest, TEvaluateResponse } from "./type";

class GenericEvaluator extends AbstractEvaluator {
  parseValues<T>(values: TEvaluateRequest): TEvaluateResponse<T> {
    return { [this.fieldId]: values[this.fieldId] as T };
  }
  evaluateWithValues<T>(values: TEvaluateRequest): TEvaluateResponse<T> {
    return this.parseValues(values);
  }
}

export { GenericEvaluator };
