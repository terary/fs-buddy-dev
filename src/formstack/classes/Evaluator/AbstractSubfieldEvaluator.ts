import { TStatusRecord } from "../../../chrome-extension/type";
// import { InvalidEvaluation } from "../InvalidEvaluation";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { TFlatSubmissionValues, TUiEvaluationObject } from "./type";

type TAdvancedField = { [subfieldId: string]: string };

const isString = (str: any) => typeof str === "string" || str instanceof String;

abstract class AbstractSubfieldEvaluator extends AbstractEvaluator {
  abstract get supportedSubfieldIds(): string[];

  parseValues<S = string, T = string>(submissionDatum?: S): T {
    return this.parseSubmittedData(submissionDatum as string) as T;
  }

  private parseSubmittedData(
    submissionDatum?: string
  ): TAdvancedField | undefined {
    if (!submissionDatum) {
      return undefined;
    }

    if (!isString(submissionDatum)) {
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
    }, {} as TAdvancedField);
  }

  protected createStatusMessageArrayWithStoredValue<T>(
    submissionDatum?: T | undefined
  ): TStatusRecord[] {
    const message = isString(submissionDatum)
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
      statusMessages.push({
        severity: "warn",
        fieldId: this.fieldId,
        message:
          "Submission data missing and required.  This is not an issue if the field is hidden by logic.",
        relatedFieldIds: [],
      });
      return [
        {
          uiid: null,
          fieldId: this.fieldId,
          fieldType: this.fieldType,
          value: "",
          statusMessages,
        },
      ];
    }

    if (parsedValues === undefined) {
      return [
        {
          uiid: null,
          fieldId: this.fieldId,
          fieldType: this.fieldType,
          value: "",
          statusMessages,
        },
      ];
    }

    if (Object.keys(parsedValues).length === 0) {
      return [
        {
          uiid: null,
          fieldId: this.fieldId,
          fieldType: this.fieldJson.type,
          value: "",
          statusMessages: [
            ...statusMessages,
            {
              severity: "error",
              message: "Failed to parse field",
              relatedFieldIds: [],
            },
          ],
        } as TUiEvaluationObject,
      ];
    }

    Object.entries(parsedValues).forEach(([key, value]) => {
      if (!this.supportedSubfieldIds.includes(key)) {
        statusMessages.push({
          severity: "warn",
          message: `Found unexpected subfield: '${key}'. With value: '${value}'.`,
          fieldId: this.fieldId,
          relatedFieldIds: [],
        });
      }
    });

    const uiComponents = this.supportedSubfieldIds.map((subfieldId) => {
      return {
        uiid: `field${this.fieldId}-${subfieldId}`,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: parsedValues[subfieldId],
        statusMessages: [],
      } as TUiEvaluationObject;
    });

    // add one more for status message
    uiComponents.push({
      uiid: null,
      fieldId: this.fieldId,
      fieldType: this.fieldJson.type,
      value: "",
      statusMessages: statusMessages,
    } as TUiEvaluationObject);
    return uiComponents;
  }
}

export { AbstractSubfieldEvaluator };
