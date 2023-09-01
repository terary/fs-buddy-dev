import { AbstractEvaluator } from "./AbstractEvaluator";
import { TFlatSubmissionValues, TFlatSubmissionValues } from "./type";

class GenericEvaluator extends AbstractEvaluator {
  parseValues<T>(values: TFlatSubmissionValues): TFlatSubmissionValues<T> {
    return { [this.fieldId]: values[this.fieldId] as T };
  }
  evaluateWithValues<T>(values: TFlatSubmissionValues): TFlatSubmissionValues<T> {
    return this.parseValues(values);
  }
}

export { GenericEvaluator };
