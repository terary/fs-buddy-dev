import { TStatusRecord } from "../../../chrome-extension/type";
// import { InvalidEvaluation } from "../InvalidEvaluation";
import { GenericEvaluator } from "./GenericEvaluator";
import { TUiEvaluationObject } from "./type";

class DateEvaluator extends GenericEvaluator {
  isCorrectType<T>(submissionDatum: T): boolean {
    return (
      this.parseValues<string, Date>(submissionDatum as string).toString() !==
      "Invalid Date"
    );

    // const value = this.parseValues<string, Date>(submissionDatum as string);
    // return true;
  }

  parseValues<S = string, T = string>(submissionDatum?: S): T {
    return new Date(submissionDatum as string) as T;

    // // parseValues<T>(values: TFlatSubmissionValues): TFlatSubmissionValues<T> {
    // const date = new Date(submissionDatum as string);
    // if (date.toString() === "Invalid Date") {
    //   // const invalidEvaluation = new InvalidEvaluation(
    //   //   `Date did not parse correctly. Date: '${values[this.fieldId]}'`,
    //   //   { [this.fieldId]: values[this.fieldId] }
    //   // );
    //   return undefined as T;
    // }

    // return date as T;
  }

  getUiPopulateObject<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
    const statusMessages: TStatusRecord[] = [
      {
        severity: "info",
        fieldId: this.fieldId,
        message: `Stored value: '${submissionDatum}'.`,
        relatedFieldIds: [],
      },
    ];
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
          fieldType: this.fieldJson.type,
          value: "",
          statusMessages,
        } as TUiEvaluationObject,
      ];
    }

    const parsedValues = this.parseValues<string, Date>(
      submissionDatum as string
    );
    if (parsedValues.toString() === "Invalid Date") {
      statusMessages.push({
        severity: "error",
        message: `Failed to parse field. Date did not parse correctly. Date: '${submissionDatum}'`,
        relatedFieldIds: [],
      });
      return [
        {
          uiid: null,
          fieldId: this.fieldId,
          fieldType: this.fieldJson.type,
          value: "",
          statusMessages,
        } as TUiEvaluationObject,
      ];
    }
    //    const x = new Date(parsedValues as unknown as string);
    // if (parsedValues === undefined) {
    //   return [
    //     {
    //       uiid: `field${this.fieldId}`,
    //       fieldId: this.fieldId,
    //       fieldType: this.fieldJson.type,
    //       value: "",
    //       statusMessages: [
    //         {
    //           severity: "error",
    //           message: "Failed to parse field. ",
    //           relatedFieldIds: [],
    //         },
    //       ],
    //     } as TUiEvaluationObject,
    //   ];
    // }
    // need to make sure this is being transformed
    // @ts-ignore - this is expected 'required' to be boolean, which happens only if this json has been transformed

    // const t = x.getTime();
    // const n = Date.now();
    // const diff = Math.abs(x.getTime() - Date.now());
    // console.log({ diff, n, t });
    if (Math.abs(parsedValues.getTime()) < 86400000) {
      statusMessages.push({
        severity: "info",
        fieldId: this.fieldId,
        message: `This date is near the epoch.  This could suggest malformed date string. Date: '${parsedValues.toDateString()}' `,
      });
    }

    // I am not sure how this will work with other languages or field setting date format
    const localizedMonth = parsedValues.toDateString().split(" ")[1] || "";

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
        value: (parsedValues.getDate() + "").padStart(2, "0"), // 1..31
        statusMessages: [],
      },
      {
        uiid: `field${this.fieldId}Y`,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: parsedValues.getFullYear() + 1 + "",
        statusMessages: [],
      },
      {
        uiid: `field${this.fieldId}H`,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: (parsedValues.getHours() + "").padStart(2, "0"), // 0..23
        statusMessages: [],
      },
      {
        uiid: `field${this.fieldId}I`,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: (parsedValues.getMinutes() + "").padStart(2, "0"), // 0..59
        statusMessages: [],
      },
      {
        uiid: `field${this.fieldId}A`,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: parsedValues.getHours() > 12 ? "PM" : "AM",
        statusMessages: [],
      },
      {
        uiid: null,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: "", // this.getStoredValue(submissionDatum),
        statusMessages,
      },
    ];
  }
}

export { DateEvaluator };
