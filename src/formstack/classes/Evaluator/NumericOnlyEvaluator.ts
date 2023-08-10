import { InvalidEvaluation } from "../InvalidEvaluation";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { TEvaluateRequest, TEvaluateResponse } from "./type";
const isNumericLoosely = (value: any) => {
  return Number(value) == value;
};

class NumericOnlyEvaluator extends AbstractEvaluator {
  parseValues<T>(values: TEvaluateRequest): TEvaluateResponse<T> {
    return { [this.fieldId]: values[this.fieldId] };
  }

  evaluateWithValues<T>(values: TEvaluateRequest): TEvaluateResponse<T> {
    if (isNumericLoosely(values[this.fieldId])) {
      return { [this.fieldId]: values[this.fieldId] };
    }

    return {
      [this.fieldId]: new InvalidEvaluation(
        `Could not convert to number: '${values[this.fieldId]}', fieldId: ${
          this.fieldId
        }.`
      ),
    };
  }
}

export { NumericOnlyEvaluator };
