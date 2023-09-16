import { TStatusRecord } from "../../../chrome-extension/type";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { TUiEvaluationObject } from "./type";
const isString = (str: any) => typeof str === "string" || str instanceof String;
class GenericEvaluator extends AbstractEvaluator {
  parseValues<S = string, T = string>(submissionDatum?: S): T {
    return submissionDatum as T;
  }

  evaluateWithValues<S = string, T = string>(values: S): T {
    return this.parseValues(values);
  }

  getUiPopulateObjects<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
    const statusMessages =
      this.createStatusMessageArrayWithStoredValue(submissionDatum);
    if (this.isRequired && (submissionDatum === "" || !submissionDatum)) {
      return this.getUiPopulateObjectsEmptyAndRequired(statusMessages);
    }

    const datum = this.getStoredValue<string>(submissionDatum as string);
    return [
      this.wrapAsUiObject(
        this.isValidSubmissionDatum(datum) ? `field${this.fieldId}` : null,
        this.isValidSubmissionDatum(datum) ? datum : "",
        statusMessages
      ),
    ];
  }

  isCorrectType<T>(submissionDatum: T): boolean {
    const parseSubmittedData = this.parseValues(submissionDatum);
    return isString(parseSubmittedData);
    // should we check if all keys are valid?
    // return (
    //   typeof parseSubmittedData === "object" &&
    //   parseSubmittedData !== null &&
    //   Object.keys(parseSubmittedData).length > 0
    // );
  }
}

export { GenericEvaluator };
