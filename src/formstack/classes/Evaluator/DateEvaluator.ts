import { TUiEvaluationObject } from "./type";
import { ScalarEvaluator } from "./ScalarEvaluator";

class DateEvaluator extends ScalarEvaluator {
  isCorrectType<T>(submissionDatum: T): boolean {
    return (
      this.parseValues<string, Date>(submissionDatum as string).toString() !==
      "Invalid Date"
    );
  }

  parseValues<S = string, T = string>(submissionDatum?: S): T {
    return new Date(submissionDatum as string) as T;
  }

  evaluateWithValues<S = string, T = string>(values: S): T {
    return this.parseValues(values);
  }

  getUiPopulateObjects<T = string>(submissionDatum?: T): TUiEvaluationObject[];
  getUiPopulateObjects(submissionDatum?: string): TUiEvaluationObject[] {
    const statusMessages =
      this.createStatusMessageArrayWithStoredValue(submissionDatum);
    if (!submissionDatum) {
      statusMessages.push(
        this.wrapAsStatusMessage(
          "warn",
          `Failed to parse field. Date did not parse correctly. Date: '${submissionDatum}'`
        )
      );

      if (this.isRequired) {
        return this.getUiPopulateObjectsEmptyAndRequired(statusMessages);
      }
      return [this.wrapAsUiObject(null, "", statusMessages)];
    }

    // I think should be done above
    if (!this.isCorrectType(submissionDatum)) {
      const message =
        `_BAD_DATA_TYPE_' type: '${typeof submissionDatum}', value: '` +
        JSON.stringify(submissionDatum).slice(0, 100) +
        "'";
      statusMessages.push(this.wrapAsStatusMessage("warn", message));
      return [this.wrapAsUiObject(null, "", statusMessages)];
    }

    const parsedValues = this.parseValues<string, Date>(
      submissionDatum as string
    );

    if (Math.abs(parsedValues.getTime()) < 86400000) {
      statusMessages.push(
        this.wrapAsStatusMessage(
          "info",
          `This date is near the epoch.  This could suggest malformed date string. Date: '${parsedValues.toDateString()}' `
        )
      );
    }

    // I am not sure how this will work with other languages or field setting date format
    const localizedMonth = parsedValues.toDateString().split(" ")[1] || "";

    return [
      this.wrapAsUiObject(`field${this.fieldId}M`, localizedMonth),
      this.wrapAsUiObject(
        `field${this.fieldId}D`,
        (parsedValues.getDate() + "").padStart(2, "0")
      ), // 1..31
      this.wrapAsUiObject(
        `field${this.fieldId}Y`,
        parsedValues.getFullYear() + 1 + ""
      ),
      this.wrapAsUiObject(
        `field${this.fieldId}H`,
        (parsedValues.getHours() + "").padStart(2, "0")
      ),
      this.wrapAsUiObject(
        `field${this.fieldId}I`,
        (parsedValues.getMinutes() + "").padStart(2, "0")
      ),
      this.wrapAsUiObject(
        `field${this.fieldId}A`,
        parsedValues.getHours() > 12 ? "PM" : "AM"
      ),
      this.wrapAsUiObject(null, "", statusMessages),
    ];
  }
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

export { DateEvaluator };
