import { TStatusRecord } from "../../../chrome-extension/type";
// import { InvalidEvaluation } from "../InvalidEvaluation";
import { GenericEvaluator } from "./GenericEvaluator";
import { TUiEvaluationObject } from "./type";

class DateEvaluator extends GenericEvaluator {
  getUiPopulateObjects<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
    const statusMessages =
      this.createStatusMessageArrayWithStoredValue(submissionDatum);
    if ((this.isRequired && submissionDatum === "") || !submissionDatum) {
      return this.getUiPopulateObjectsEmptyAndRequired(statusMessages);
    }

    const parsedValues = this.parseValues<string, Date>(
      submissionDatum as string
    );
    if (parsedValues.toString() === "Invalid Date") {
      statusMessages.push(
        this.wrapAsStatusMessage(
          "error",
          `Failed to parse field. Date did not parse correctly. Date: '${submissionDatum}'`
        )
      );

      return [this.wrapAsUiObject(null, "", statusMessages)];
    }

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

  isCorrectType<T>(submissionDatum: T): boolean {
    return (
      this.parseValues<string, Date>(submissionDatum as string).toString() !==
      "Invalid Date"
    );
  }

  parseValues<S = string, T = string>(submissionDatum?: S): T {
    return new Date(submissionDatum as string) as T;
  }
}

export { DateEvaluator };
