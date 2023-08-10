import { AbstractEvaluator } from "./AbstractEvaluator";
import { TEvaluateRequest, TEvaluateResponse } from "./type";

class NonValueEvaluator extends AbstractEvaluator {
  parseValues<T>(values: TEvaluateRequest): TEvaluateResponse<T> {
    return { [this.fieldId]: values[this.fieldId] };
  }

  evaluateWithValues<T>(values: TEvaluateRequest): TEvaluateResponse<T>;
  evaluateWithValues(values: TEvaluateRequest): TEvaluateResponse<null> {
    return { [this.fieldId]: null };
  }
}

export { NonValueEvaluator };
