import { TStatusRecord } from "../../../chrome-extension/type";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { TUiEvaluationObject } from "./type";
import { isFunctions } from "../../../common/isFunctions";
import { ScalarEvaluator } from "./ScalarEvaluator";

class NumberEvaluator extends ScalarEvaluator {
  parseValues<S = string, T = string>(submissionDatum?: S): T;
  parseValues(submissionDatum?: string): number | undefined {
    return submissionDatum ? Number(submissionDatum) : undefined;
  }

  evaluateWithValues<S = string, T = string>(values: S): T {
    return this.parseValues(values);
  }

  isCorrectType<T>(submissionDatum: T): boolean {
    const parseSubmittedData = this.parseValues(submissionDatum);
    return isFunctions.isLooselyNumeric(parseSubmittedData);
  }

  x_getUiPopulateObjects<T = string>(
    submissionDatum?: T
  ): TUiEvaluationObject[];
  x_getUiPopulateObjects(
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
}

export { NumberEvaluator };
