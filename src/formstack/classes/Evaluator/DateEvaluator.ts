import { TStatusRecord } from "../../../chrome-extension/type";
import { InvalidEvaluation } from "../InvalidEvaluation";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { GenericEvaluator } from "./GenericEvaluator";
import {
  TEvaluateRequest,
  TEvaluateResponse,
  TUiEvaluationObject,
} from "./type";

class DateEvaluator extends GenericEvaluator {
  parseValues<T>(values: TEvaluateRequest): TEvaluateResponse<T> {
    const date = new Date(values[this.fieldId]);
    if (date.toString() === "Invalid Date") {
      const invalidEvaluation = new InvalidEvaluation(
        `Date did not parse correctly. Date: '${values[this.fieldId]}'`,
        { [this.fieldId]: values[this.fieldId] }
      );
      return { [this.fieldId]: invalidEvaluation };
    }

    return { [this.fieldId]: date as T };
  }

  getUiPopulateObject(values: TEvaluateRequest): TUiEvaluationObject[] {
    // this is where submission error/warn/info should happen

    const parsedValues = this.parseValues<string>(values);
    const x = new Date(parsedValues[this.fieldId] as unknown as string);
    if (parsedValues[this.fieldId] instanceof InvalidEvaluation) {
      return [
        {
          uiid: `field${this.fieldId}`,
          fieldId: this.fieldId,
          fieldType: this.fieldJson.type,
          value: "",
          statusMessages: [
            {
              severity: "error",
              message:
                "Failed to parse field. " +
                (parsedValues[this.fieldId] as InvalidEvaluation).message,
              relatedFieldIds: [],
            },
          ],
        } as TUiEvaluationObject,
      ];
    }
    const statusMessages: TStatusRecord[] = [];

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

    // const t = x.getTime();
    // const n = Date.now();
    // const diff = Math.abs(x.getTime() - Date.now());
    // console.log({ diff, n, t });
    if (Math.abs(x.getTime()) < 86400000) {
      statusMessages.push({
        severity: "info",
        fieldId: this.fieldId,
        message: `This date is near the epoch.  This could suggest malformed date string. Date: '${x.toDateString()}' `,
      });
    }

    // I am not sure how this will work with other languages or field setting date format
    const localizedMonth = x.toDateString().split(" ")[1] || "";

    return [
      {
        uiid: `field${this.fieldId}M`,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: localizedMonth,
        statusMessages: [],
      },
      {
        uiid: `field${this.fieldId}D`,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: (x.getDate() + "").padStart(2, "0"), // 1..31
        statusMessages: [],
      },
      {
        uiid: `field${this.fieldId}Y`,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: x.getFullYear() + 1 + "",
        statusMessages: [],
      },
      {
        uiid: `field${this.fieldId}H`,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: (x.getHours() + "").padStart(2, "0"), // 0..23
        statusMessages: [],
      },
      {
        uiid: `field${this.fieldId}I`,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: (x.getMinutes() + "").padStart(2, "0"), // 0..59
        statusMessages: [],
      },
      {
        uiid: `field${this.fieldId}A`,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: x.getHours() > 12 ? "PM" : "AM",
        statusMessages: [],
      },
      {
        uiid: null,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: values[this.fieldId] as string,
        statusMessages,
      },
    ];
  }
}

export { DateEvaluator };
