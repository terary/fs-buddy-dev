import { TUiEvaluationObject } from "./type";
import { isFunctions } from "../../../common/isFunctions";
import { AbstractSelectOptionEvaluator } from "./AbstractSelectOptionEvaluator";

class SelectEvaluator extends AbstractSelectOptionEvaluator {
  private isValueInSelectOptions(value: string): boolean {
    return this.getSelectOptions().find((x) => x.value === value) !== undefined;
  }

  public isCorrectType<T>(submissionDatum: T): boolean;
  public isCorrectType(submissionDatum: string): boolean {
    return isFunctions.isString(submissionDatum);
  }

  parseValues<S = string, T = string>(submissionDatum?: S): T;
  parseValues(submissionDatum?: string): string {
    return submissionDatum as string;
  }

  getUiPopulateObjects<T = string>(submissionDatum?: T): TUiEvaluationObject[];
  getUiPopulateObjects(submissionDatum: string): TUiEvaluationObject[] {
    const statusMessages =
      this.createStatusMessageArrayWithStoredValue(submissionDatum);

    if (!submissionDatum) {
      statusMessages.push(
        this.wrapAsStatusMessage(
          "warn",
          this.invalidSelectedOptionMessage(submissionDatum as string)
        )
      );

      if (this.isRequired) {
        return this.getUiPopulateObjectsEmptyAndRequired(statusMessages);
      }
      return [this.wrapAsUiObject(null, "", statusMessages)];
    }

    if (!this.isCorrectType(submissionDatum)) {
      const message =
        `_BAD_DATA_TYPE_' type: '${typeof submissionDatum}', value: '` +
        JSON.stringify(submissionDatum).slice(0, 100) +
        "'";
      statusMessages.push(this.wrapAsStatusMessage("warn", message));

      return [this.wrapAsUiObject(null, "", statusMessages)];
    }

    // override parseValues
    const selectedValue = this.parseValues<string>(submissionDatum);

    if (!this.isValueInSelectOptions(selectedValue)) {
      statusMessages.push(
        this.wrapAsStatusMessage(
          "warn",
          this.invalidSelectedOptionMessage(selectedValue)
        )
      );
      return [this.wrapAsUiObject(null, "", statusMessages)];
    }

    return [
      this.wrapAsUiObject(
        `field${this.fieldId}`,
        selectedValue,
        statusMessages
      ),
    ];
  }
}

export { SelectEvaluator };
