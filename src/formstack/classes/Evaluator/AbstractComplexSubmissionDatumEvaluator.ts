import { TStatusRecord } from "../../../chrome-extension/type";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { TUiEvaluationObject } from "./type";
import { isFunctions } from "../../../common/isFunctions";
type TComplexDatumField = { [subfieldId: string]: string };

abstract class AbstractComplexSubmissionDatumEvaluator extends AbstractEvaluator {
  abstract get supportedSubfieldIds(): string[];

  parseValues<S = string, T = string>(submissionDatum?: S): T {
    return this.parseSubmittedDatum(submissionDatum as string) as T;
  }

  private parseSubmittedDatum(
    submissionDatum?: string
  ): TComplexDatumField | undefined {
    if (!submissionDatum) {
      return undefined;
    }

    if (!isFunctions.isString(submissionDatum)) {
      return {};
    }

    if (!submissionDatum.match("\n")) {
      return {};
    }

    const records = submissionDatum.split("\n");
    return records.reduce((prev, cur, i, a) => {
      const [subfieldIdRaw, valueRaw] = cur.split("=");
      const subfieldId = (subfieldIdRaw || "").trim();
      const value = (valueRaw || "").trim();
      if (subfieldId !== "" || value !== "") {
        prev[subfieldId] = value;
      }

      return prev;
    }, {} as TComplexDatumField);
  }

  protected createStatusMessageArrayWithStoredValue<T>(
    submissionDatum?: T | undefined
  ): TStatusRecord[] {
    const message = isFunctions.isString(submissionDatum)
      ? `Stored value: '${((submissionDatum as string) || "").replace(
          /\n/g,
          "\\n"
        )}'.`
      : `Stored value: '${JSON.stringify(submissionDatum)}'.`;

    return [
      {
        severity: "info",
        fieldId: this.fieldId,
        message,
        relatedFieldIds: [],
      },
    ];
  }

  getUiPopulateObjects<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
    const statusMessages =
      this.createStatusMessageArrayWithStoredValue(submissionDatum);

    if ((this.isRequired && submissionDatum === "") || !submissionDatum) {
      return this.getUiPopulateObjectsEmptyAndRequired(statusMessages);
    }

    const parsedValues = this.parseValues<
      string,
      { [subfieldId: string]: string }
    >(submissionDatum as string);

    if (this.isRequired && (submissionDatum === "" || !submissionDatum)) {
      statusMessages.push(
        this.wrapAsStatusMessage(
          "warn",
          "Submission data missing and required.  This is not an issue if the field is hidden by logic."
        )
      );

      return [this.wrapAsUiObject(null, "", statusMessages)];
    }

    if (parsedValues === undefined) {
      return [this.wrapAsUiObject(null, "", statusMessages)];
    }

    if (Object.keys(parsedValues).length === 0) {
      statusMessages.push(
        this.wrapAsStatusMessage("error", "Failed to parse field")
      );

      return [this.wrapAsUiObject(null, "", statusMessages)];
    }

    Object.entries(parsedValues).forEach(([key, value]) => {
      if (!this.supportedSubfieldIds.includes(key)) {
        statusMessages.push(
          this.wrapAsStatusMessage(
            "warn",
            `Found unexpected subfield: '${key}'. With value: '${value}'.`
          )
        );
      }
    });

    const uiComponents = this.supportedSubfieldIds.map((subfieldId) => {
      return this.wrapAsUiObject(
        `field${this.fieldId}-${subfieldId}`,
        parsedValues[subfieldId]
      );
    });

    // add one more for status message
    uiComponents.push(this.wrapAsUiObject(null, "", statusMessages));
    return uiComponents;
  }
}

export { AbstractComplexSubmissionDatumEvaluator };
