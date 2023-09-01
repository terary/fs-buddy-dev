import { TStatusRecord } from "../../../chrome-extension/type";
// import { InvalidEvaluation } from "../InvalidEvaluation";
import { AbstractEvaluator } from "./AbstractEvaluator";
import {
  TFlatSubmissionValues,
  TFlatSubmissionValues,
  TUiEvaluationObject,
} from "./type";
const isNumericLoosely = (value: any) => {
  return Number(value) == value;
};

class NumericOnlyEvaluator extends AbstractEvaluator {
  parseValues<T>(values: TFlatSubmissionValues): TFlatSubmissionValues<T> {
    return { [this.fieldId]: values[this.fieldId] };
  }

  evaluateWithValues<T>(values: TFlatSubmissionValues): TFlatSubmissionValues<T> {
    if (isNumericLoosely(values[this.fieldId])) {
      return { [this.fieldId]: values[this.fieldId] };
    }
    return { [this.fieldId]: undefined };

    // return {
    //   [this.fieldId]: new InvalidEvaluation(
    //     `Could not convert to number: '${values[this.fieldId]}', fieldId: ${
    //       this.fieldId
    //     }.`
    //   ),
    // };
  }

  getUiPopulateObject(values: TFlatSubmissionValues): TUiEvaluationObject[] {
    console.log(
      `TFlatSubmissionValues and TUiEvaluationObject need to be the same thing so the output can be piped into input. Good for validation (or not validation).`
    );
    const statusMessages: TStatusRecord[] = [
      {
        severity: "info",
        fieldId: this.fieldId,
        message: `Stored value: '${this.getStoredValue(values)}'.`,
        relatedFieldIds: [],
      },
    ];
    const parsedValues = this.parseValues<string>(values);

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
      parsedValues[this.fieldId] === ""
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
        value: parsedValues[this.fieldId] as string,
        statusMessages,
      },
    ];
  }
}

export { NumericOnlyEvaluator };
