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

  getUiPopulateObject<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
    // getUiPopulateObject(values: TFlatSubmissionValues): TUiEvaluationObject[] {
    const statusMessages: TStatusRecord[] = [
      {
        severity: "info",
        fieldId: this.fieldId,
        message: `Stored value: '${this.getStoredValue(submissionDatum)}'.`,
        relatedFieldIds: [],
      },
    ];
    const parsedValues = this.parseValues<string>(submissionDatum as string);

    if (parsedValues === undefined) {
      statusMessages.push({
        severity: "error",
        message: "Failed to parse field. ",
        relatedFieldIds: [],
      });
    }

    // need to make sure this is being transformed
    // @ts-ignore - this is expected 'required' to be boolean, which happens only if this json has been transformed
    if (
      // @ts-ignore
      (this.fieldJson.required || this.fieldJson.required === "1") &&
      submissionDatum === ""
    ) {
      statusMessages.push({
        severity: "info",
        fieldId: this.fieldId,
        message:
          "Field value appears empty but field is required. (if this field is eventually hidden by logic, then empty value is not significant.)",
      });
    }

    return [
      {
        uiid: `field${this.fieldId}`,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: parsedValues as string,
        statusMessages,
      },
    ];
  }
}

export { NumericOnlyEvaluator };
