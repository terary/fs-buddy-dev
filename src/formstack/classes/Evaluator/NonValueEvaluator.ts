import { AbstractEvaluator } from "./AbstractEvaluator";
import { TEvaluateRequest, TEvaluateResponse } from "./type";

class NonValueEvaluator extends AbstractEvaluator {
  evaluateWithValues<T>(values: TEvaluateRequest): TEvaluateResponse<T>;
  evaluateWithValues(values: TEvaluateRequest): TEvaluateResponse<null> {
    return { [this.fieldId]: null };
  }
}

export { NonValueEvaluator };
