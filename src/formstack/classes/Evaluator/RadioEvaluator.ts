import { TStatusRecord, TUiEvaluationObject } from "./type";

import { isFunctions } from "../../../common/isFunctions";
import { AbstractSelectOptionEvaluator } from "./AbstractSelectOptionEvaluator";

class RadioEvaluator extends AbstractSelectOptionEvaluator {
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
  getUiPopulateObjects(submissionDatum?: string): TUiEvaluationObject[] {
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

    // if (this.fieldType === "select") {
    //   return this.getUiPopulateObjectsSelect(
    //     submissionDatum as string,
    //     statusMessages
    //   );
    // }

    const parsedValues = this.parseValues<string>(submissionDatum as string);
    const uiidFieldIdMap = this.getUiidFieldIdMap();

    if (!uiidFieldIdMap[parsedValues]) {
      statusMessages.push(
        this.wrapAsStatusMessage(
          "warn",
          this.invalidSelectedOptionMessage(submissionDatum as string)
        )
      );
      return [this.wrapAsUiObject(null, "null", statusMessages)];
    }

    return [
      this.wrapAsUiObject(
        uiidFieldIdMap[parsedValues] || this.fieldId,
        parsedValues,
        statusMessages
      ),
    ];
  }

  /**
   * attempts to find any issues with form/field setup
   */
  findKnownSetupIssues(): TStatusRecord[] {
    const messages = super.findKnownSetupIssues();
    if (!("options" in this.fieldJson)) {
      messages.push(
        this.wrapAsStatusMessage("warn", "Found no select options.")
      );
    }

    if ((this.fieldJson.options?.length || 0) < 2) {
      messages.push(
        this.wrapAsStatusMessage(
          "warn",
          `Select options have ${this.fieldJson.options?.length} options.`
        )
      );
      // messages.push(
      //   `Select options have ${this.fieldJson.options?.length} options.`
      // );
    }

    return messages;
  }
}

export { RadioEvaluator };
