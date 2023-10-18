import { AbstractEvaluator } from "./AbstractEvaluator";
import { TStatusRecord, TUiEvaluationObject } from "./type";
import { isFunctions } from "../../../common/isFunctions";
class ScalarEvaluator extends AbstractEvaluator {
  parseValues<S = string, T = string>(submissionDatum?: S): T {
    return submissionDatum as T;
  }

  evaluateWithValues<S = string, T = string>(values: S): T {
    return this.parseValues(values);
  }

  getUiPopulateObjects<T = string>(submissionDatum?: T): TUiEvaluationObject[];
  getUiPopulateObjects(
    submissionDatum?: string | undefined
  ): TUiEvaluationObject[] {
    const statusMessages =
      this.createStatusMessageArrayWithStoredValue(submissionDatum);

    const datum = this.getStoredValue<string>(submissionDatum as string);
    if (!submissionDatum) {
      if (this.isRequired) {
        return this.getUiPopulateObjectsEmptyAndRequired(statusMessages);
      }
      return [this.wrapAsUiObject(null, "", statusMessages)];
    }

    if (!this.isCorrectType(datum)) {
      const message =
        `_BAD_DATA_TYPE_' type: '${typeof datum}', value: '` +
        JSON.stringify(datum).slice(0, 100) +
        "'";
      statusMessages.push(this.wrapAsStatusMessage("warn", message));
      return [this.wrapAsUiObject(null, "", statusMessages)];
    }

    return [this.wrapAsUiObject(`field${this.fieldId}`, datum, statusMessages)];
  }

  isCorrectType<T>(submissionDatum: T): boolean {
    const parseSubmittedData = this.parseValues(submissionDatum);
    return isFunctions.isString(parseSubmittedData);
  }
}

export { ScalarEvaluator };
