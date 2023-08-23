import { TStatusRecord } from "../../../chrome-extension/type";
import { TFsFieldAddress } from "../../type.field";
import { InvalidEvaluation } from "../InvalidEvaluation";
import { AbstractEvaluator } from "./AbstractEvaluator";
import {
  TEvaluateRequest,
  TEvaluateResponse,
  TUiEvaluationObject,
} from "./type";

const isString = (str: any) => typeof str === "string" || str instanceof String;

abstract class AbstractSubfieldEvaluator extends AbstractEvaluator {
  abstract get supportedSubfieldIds(): string[];

  parseValues<T>(values: TEvaluateRequest): TEvaluateResponse<T> {
    const s2 = this.parseSubmittedData(values);
    return { [this.fieldId]: s2 as T };
  }

  private parseSubmittedData(values: TEvaluateRequest) {
    const submissionData = values[this.fieldId] || [];
    if (!submissionData) {
      return null;
    }

    if (!isString(submissionData)) {
      return new InvalidEvaluation(
        `Subfield value not a string. value: '${submissionData}'.`,
        {
          value: values[this.fieldId],
        }
      );
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

  getUiPopulateObject(values: TEvaluateRequest): TUiEvaluationObject[] {
    // this is where submission error/warn/info should happen
    type TypeSubfieldDatum = { subfieldId: string; value: string };
    type TypeSubfieldParse = TypeSubfieldDatum[];

    const parsedValues = this.parseValues<TypeSubfieldParse>(values); // I think parseValue is typed wrong or returns incorrect shape
    const statusMessages: TStatusRecord[] = [];
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

    if (statusMessages.length > 0) {
      uiComponents.push({
        uiid: `field${this.fieldId}`,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: "",
        statusMessages: statusMessages,
      } as TUiEvaluationObject);
    }
    return uiComponents;
  }

  evaluateWithValues<T>(values: TEvaluateRequest): TEvaluateResponse<T> {
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
