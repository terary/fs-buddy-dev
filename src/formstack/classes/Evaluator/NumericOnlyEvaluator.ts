import { TStatusRecord } from "../../../chrome-extension/type";
// import { InvalidEvaluation } from "../InvalidEvaluation";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { TUiEvaluationObject } from "./type";
const isString = (v: any) => typeof v === "string" || v instanceof String;

const isNumericLoosely = (value: any) => {
  return Number(value) == value;
};

class NumericOnlyEvaluator extends AbstractEvaluator {
  evaluateWithValues<S = string, T = string>(values: S): T {
    if (isNumericLoosely(values)) {
      return values as unknown as T;
    }
    return undefined as T;
  }

  getUiPopulateObjects<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
    const statusMessages =
      this.createStatusMessageArrayWithStoredValue(submissionDatum);
    if ((this.isRequired && submissionDatum === "") || !submissionDatum) {
      return this.getUiPopulateObjectsEmptyAndRequired(statusMessages);
    }

    const parsedValues = this.parseValues<string>(submissionDatum as string);

    return [
      this.wrapAsUiObject(`field${this.fieldId}`, parsedValues, statusMessages),
    ];
  }

  isCorrectType<T>(submissionDatum: T): boolean {
    return isString(submissionDatum) || isNumericLoosely(submissionDatum);
  }

  parseValues<S = string, T = string>(submissionDatum?: S): T {
    return submissionDatum as T;
  }
}

export { NumericOnlyEvaluator };
