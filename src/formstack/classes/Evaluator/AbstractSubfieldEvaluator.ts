import { TStatusRecord } from "../../../chrome-extension/type";
// import { InvalidEvaluation } from "../InvalidEvaluation";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { TFlatSubmissionValues, TUiEvaluationObject } from "./type";

type TAdvancedField = { [subfieldId: string]: string };

const isString = (str: any) => typeof str === "string" || str instanceof String;

abstract class AbstractSubfieldEvaluator extends AbstractEvaluator {
  abstract get supportedSubfieldIds(): string[];

  // abstract parseValues<T>(
  //   values: TFlatSubmissionValues<T>
  // ): TFlatSubmissionValues<T>;

  // I think T should default to object
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
      // return new InvalidEvaluation(
      //   `Subfield value not a string. value: '${submissionData}'.`,
      //   {
      //     value: values[this.fieldId],
      //   }
      // );
      return {};
    }

    if (!submissionDatum.match("\n")) {
      return {};
    }

    const records = submissionDatum.split("\n");

    const x: TAdvancedField = {};
    records.forEach((field: string) => {
      // maybe this should be reduce - so it can be returned directly?
      const [subfieldIdRaw, valueRaw] = field.split("=");
      const subfieldId = (subfieldIdRaw || "").trim();
      const value = (valueRaw || "").trim();
      if (subfieldId !== "" || value !== "") {
        x[subfieldId] = value;
      }
    });

    return x;
  }

  // getStoredValue<T = string>(submittedDatum: string): string {
  //   if (this.fieldId in submittedDatum) {
  //     return (values[this.fieldId] || "").replace(/\n/g, "\\n");
  //   } else {
  //     return "__EMPTY_SUBMISSION_DATA__";
  //   }
  // }
  protected getStoredValue<T = string>(submissionDatum?: T): T {
    // this is exactly the same as parent class.  If no changes made, inherit from parent

    if (this.isRequired && submissionDatum === undefined) {
      return "__MISSING_AND_REQUIRED__" as T;
    }

    if (!this.isRequired && submissionDatum === undefined) {
      return "__EMPTY_SUBMISSION_DATA__" as T;
    }

    if (!this.isCorrectType(submissionDatum)) {
      return `__BAD_DATA_TYPE__ "${typeof submissionDatum}"` as T;
    }

    return submissionDatum as T;
  }

  getUiPopulateObject<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
    const parsedValues = this.parseValues<
      string,
      { [subfieldId: string]: string }
    >(submissionDatum as string);

    if (parsedValues === undefined) {
      return [
        {
          uiid: null,
          fieldId: this.fieldId,
          fieldType: this.fieldType,
          value: "",
          statusMessages: [
            {
              severity: "info",
              message: "Stored value: '__EMPTY_SUBMISSION_DATA__'.",
              relatedFieldIds: [],
            },
          ],
        },
      ];
    }

    const statusMessages: TStatusRecord[] = [
      {
        severity: "info",
        fieldId: this.fieldId,
        message: `Stored value: '${JSON.stringify(
          this.getStoredValue(submissionDatum)
        )}'.`,
        relatedFieldIds: [],
      },
    ];

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
    // unexpectedSubfields.forEach((datum: TypeSubfieldDatum) => {
    // });

    const uiComponents = this.supportedSubfieldIds.map((subfieldId) => {
      return {
        uiid: `field${this.fieldId}-${subfieldId}`,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: parsedValues[subfieldId],
        // // @ts-ignore
        // parsedValuesTyped[this.fieldId].find(
        //   (x: any) => x.subfieldId === subfieldId
        // )?.value || "", //[subfieldId], //values[this.fieldId],
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
  // abstract evaluateWithValues<T = string>(
  //   values: TFlatSubmissionValues<T>
  // ): TFlatSubmissionValues<T>;

  x_evaluateWithValues<T>(submissionDatum: string): any {
    const s1 = this.parseSubmittedData(submissionDatum);
    return s1;
    // const s2 =
    //   Array.isArray(s1) &&
    //   s1.reduce((prev, cur) => {
    //     if (this.supportedSubfieldIds.includes(cur.subfieldId)) {
    //       prev[cur.subfieldId] = cur.value;
    //     }
    //     return prev;
    //   }, {} as { [subfieldId: string]: string });

    // // return s2;

    // return { [this.fieldId]: s2 as T };
  }
}

export { AbstractSubfieldEvaluator };
