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
    let uiid: string | null = `field${this.fieldId}`;
    const statusMessages: TStatusRecord[] = [
      {
        severity: "info",
        fieldId: this.fieldId,
        message: `Stored value: '${this.getStoredValue(submissionDatum)}'.`,
        relatedFieldIds: [],
      },
    ];
    const parsedValues = this.parseValues<string>(submissionDatum as string);

    // if (parsedValues === undefined) {
    //   statusMessages.push({
    //     severity: "error",
    //     message: "Failed to parse field. ",
    //     relatedFieldIds: [],
    //   });
    // }

    // need to make sure this is being transformed
    // @ts-ignore - this is expected 'required' to be boolean, which happens only if this json has been transformed
    if (
      // @ts-ignore
      (this.fieldJson.required || this.fieldJson.required === "1") &&
      (submissionDatum === "" || !submissionDatum)
    ) {
      uiid = null;
      statusMessages.push({
        severity: "warn",
        fieldId: this.fieldId,
        message:
          "Submission data missing and required.  This is not an issue if the field is hidden by logic.",
        relatedFieldIds: [],
      });
    }

    return [
      {
        uiid,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: parsedValues as string,
        statusMessages,
      },
    ];
  }
}

export { NumericOnlyEvaluator };
