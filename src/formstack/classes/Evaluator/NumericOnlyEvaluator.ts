import { TStatusRecord } from "../../../chrome-extension/type";
// import { InvalidEvaluation } from "../InvalidEvaluation";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { TUiEvaluationObject } from "./type";
const isString = (v: any) => typeof v === "string" || v instanceof String;

const isNumericLoosely = (value: any) => {
  return Number(value) == value;
};

class NumericOnlyEvaluator extends AbstractEvaluator {
  parseValues<S = string, T = string>(submissionDatum?: S): T {
    return submissionDatum as T;
  }
  isCorrectType<T>(submissionDatum: T): boolean {
    return isString(submissionDatum) || isNumericLoosely(submissionDatum);
  }

  // parseValues<T>(values: TFlatSubmissionValues): TFlatSubmissionValues<T> {
  //   return { [this.fieldId]: values[this.fieldId] };
  // }

  evaluateWithValues<S = string, T = string>(values: S): T {
    //   evaluateWithValues<T>( values: TFlatSubmissionValues ) : TFlatSubmissionValues<T> {
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
      // {
      //   uiid: `field${this.fieldId}`,
      //   fieldId: this.fieldId,
      //   fieldType: this.fieldJson.type,
      //   value: parsedValues,
      //   statusMessages,
      // },
    ];
  }
}

export { NumericOnlyEvaluator };
