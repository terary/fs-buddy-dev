import { TStatusRecord } from "../../../chrome-extension/type";
// import { InvalidEvaluation } from "../InvalidEvaluation";
import { AbstractEvaluator } from "./AbstractEvaluator";
import {
  TFlatSubmissionValues,
  TFlatSubmissionValues,
  TUiEvaluationObject,
} from "./type";

const isString = (str: any) => typeof str === "string" || str instanceof String;

abstract class AbstractSubfieldEvaluator extends AbstractEvaluator {
  abstract get supportedSubfieldIds(): string[];

  parseValues<T>(values: TFlatSubmissionValues): TFlatSubmissionValues<T> {
    const s2 = this.parseSubmittedData(values);
    return { [this.fieldId]: s2 as T };
  }

  private parseSubmittedData(values: TFlatSubmissionValues) {
    const submissionData = values[this.fieldId] || [];
    if (!submissionData) {
      return null;
    }

    if (!isString(submissionData)) {
      // return new InvalidEvaluation(
      //   `Subfield value not a string. value: '${submissionData}'.`,
      //   {
      //     value: values[this.fieldId],
      //   }
      // );
      return null;
    }

    const records = submissionData.split("\n");

    return records.map((field: string) => {
      const [subfieldIdRaw, valueRaw] = field.split("=");
      const subfieldId = (subfieldIdRaw || "").trim();
      const value = (valueRaw || "").trim();

      return {
        subfieldId,
        value,
      };
    }) as [{ subfieldId: string; value: string }];
  }

  getStoredValue(values: TFlatSubmissionValues): string {
    if (this.fieldId in values) {
      return (values[this.fieldId] || "").replace(/\n/g, "\\n");
    } else {
      return "__EMPTY_SUBMISSION_DATA__";
    }
  }

  getUiPopulateObject(values: TFlatSubmissionValues): TUiEvaluationObject[] {
    // this is where submission error/warn/info should happen
    type TypeSubfieldDatum = { subfieldId: string; value: string };
    type TypeSubfieldParse = TypeSubfieldDatum[];

    if (!(this.fieldId in values)) {
      return [
        {
          uiid: null,
          fieldId: this.fieldId,
          fieldType: this.fieldJson.type,
          value: "__EMPTY_SUBMISSION_DATA__",
          statusMessages: [
            {
              severity: "info",
              message: `Stored value: '__EMPTY_SUBMISSION_DATA__'.`,
              relatedFieldIds: [],
            },
          ],
        } as TUiEvaluationObject,
      ];
    }
    const parsedValues = this.parseValues<TypeSubfieldParse>(values); // I think parseValue is typed wrong or returns incorrect shape
    const statusMessages: TStatusRecord[] = [
      {
        severity: "info",
        fieldId: this.fieldId,
        message: `Stored value: '${this.getStoredValue(values)}'.`,
        relatedFieldIds: [],
      },
    ];

    if (parsedValues[this.fieldId] === undefined) {
      return [
        {
          uiid: `field${this.fieldId}`,
          fieldId: this.fieldId,
          fieldType: this.fieldJson.type,
          value: "",
          statusMessages: [
            {
              severity: "error",
              message: "Failed to parse field" + parsedValues.message,
              relatedFieldIds: [],
            },
          ],
        } as TUiEvaluationObject,
      ];
    }

    const parsedValuesTyped = parsedValues as unknown as TypeSubfieldParse;
    // @ts-ignore
    const unexpectedSubfields = parsedValuesTyped[this.fieldId].filter(
      (datum: TypeSubfieldDatum) => {
        return !this.supportedSubfieldIds.includes(datum.subfieldId);
      }
    );
    unexpectedSubfields.forEach((datum: TypeSubfieldDatum) => {
      statusMessages.push({
        severity: "warn",
        message: `Found unexpected subfield: '${datum.subfieldId}'. With value: '${datum.value}'.`,
        fieldId: this.fieldId,
        relatedFieldIds: [],
      });
    });

    const uiComponents = this.supportedSubfieldIds.map((subfieldId) => {
      return {
        uiid: `field${this.fieldId}-${subfieldId}`,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value:
          // @ts-ignore
          parsedValuesTyped[this.fieldId].find(
            (x: any) => x.subfieldId === subfieldId
          )?.value || "", //[subfieldId], //values[this.fieldId],
        statusMessages: [],
      } as TUiEvaluationObject;
    });

    uiComponents.push({
      uiid: null,
      fieldId: this.fieldId,
      fieldType: this.fieldJson.type,
      value: "",
      statusMessages: statusMessages,
    } as TUiEvaluationObject);
    return uiComponents;
  }

  evaluateWithValues<T>(
    values: TFlatSubmissionValues
  ): TFlatSubmissionValues<T> {
    const s1 = this.parseSubmittedData(values);
    const s2 =
      Array.isArray(s1) &&
      s1.reduce((prev, cur) => {
        if (this.supportedSubfieldIds.includes(cur.subfieldId)) {
          prev[cur.subfieldId] = cur.value;
        }
        return prev;
      }, {} as { [subfieldId: string]: string });

    // return s2;

    return { [this.fieldId]: s2 as T };
  }
}

export { AbstractSubfieldEvaluator };
