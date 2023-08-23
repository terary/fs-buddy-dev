import { TStatusRecord } from "../../../chrome-extension/type";
import { TFsFieldAddress, TFsFieldMatrix } from "../../type.field";
import { InvalidEvaluation } from "../InvalidEvaluation";
import { AbstractEvaluator } from "./AbstractEvaluator";
import {
  TEvaluateRequest,
  TEvaluateResponse,
  TUiEvaluationObject,
} from "./type";
const isString = (str: any) => typeof str === "string" || str instanceof String;

class MatrixEvaluator extends AbstractEvaluator {
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
        `Matrix value not a string. value: '${submissionData}'.`,
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

  private getAsMatrixUiFieldIdMap(): {
    [row: string]: { [column: string]: string };
  } {
    // I *think* reverse these when that option is set in the fieldJson.options
    const rows = (this.fieldJson as TFsFieldMatrix).row_choices.split("\n");
    const columns = (this.fieldJson as TFsFieldMatrix).column_choices.split(
      "\n"
    );

    const matrix: any = {};
    rows.forEach((row, rowIndex) => {
      matrix[row] = {};
      columns.forEach((column, columnIndex) => {
        matrix[row][column] = `field${this.fieldId}-${rowIndex + 1}-${
          columnIndex + 1
        }`;
      });
    });
    console.log({ matrix });
    return matrix;
  }

  getUiPopulateObject(values: TEvaluateRequest): TUiEvaluationObject[] {
    type TypeSubfieldDatum = { subfieldId: string; value: string };
    const parsedValues = this.parseSubmittedData(values);
    const fieldIdMatrix = this.getAsMatrixUiFieldIdMap();

    if (
      parsedValues &&
      // @ts-ignore - parsedValues could be instance of InvalidEvaluation  (and not parsedValues[fieldId])
      parsedValues[this.fieldId] instanceof InvalidEvaluation
    ) {
      return [
        {
          // uiid: `field${this.fieldId}`,
          uiid: null,
          fieldId: this.fieldId,
          fieldType: this.fieldJson.type,
          value: "",
          statusMessages: [
            {
              severity: "error",
              message: "Failed to parse field",
              relatedFieldIds: [],
            },
          ],
        } as TUiEvaluationObject,
      ];
    }

    // ts-ignore,
    // at this point parsedValues should be an array, except when the field is empty
    // if (parsedValues && !isString(parsedValues[this.fieldId])) {
    //   return [
    //     {
    //       // uiid: `field${this.fieldId}`,
    //       uiid: null,
    //       fieldId: this.fieldId,
    //       fieldType: this.fieldJson.type,
    //       value: "",
    //       statusMessages: [
    //         {
    //           severity: "error",
    //           message: `Failed to parse field. value: parsedValue: ${
    //             // @ts-ignore - may be InvalidEvaluation
    //             parsedValues[this.fieldId]
    //           }`,
    //           relatedFieldIds: [],
    //         } as TStatusRecord,
    //       ],
    //     } as TUiEvaluationObject,
    //   ];
    // }

    // @ts-ignore
    const selectedRows = parsedValues?.map((datum) => {
      const statusMessages: TStatusRecord[] = [];
      const uiFieldId = fieldIdMatrix[datum.subfieldId][datum.value];

      if (uiFieldId === undefined) {
        statusMessages.push({
          severity: "warn",
          message: `Unable to find matrix mapping for: '${JSON.stringify({
            // *tmc* these static labels (row/column) may cause confusion if options are changed
            row: datum.subfieldId,
            column: datum.value,
          })}'.`,
          fieldId: this.fieldId,
          relatedFieldIds: [],
        });
      }

      return {
        uiid: uiFieldId || this.fieldId,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: "checked",
        statusMessages: statusMessages,
      } as TUiEvaluationObject;
    });
    return selectedRows as TUiEvaluationObject[];
  }

  evaluateWithValues<T>(values: TEvaluateRequest): TEvaluateResponse<T> {
    const s1 = this.parseSubmittedData(values);
    const s2 =
      Array.isArray(s1) &&
      s1.reduce((prev, cur, i, a) => {
        prev[cur.subfieldId] = cur.value;
        // if (this._supportedSubfieldIds.includes(cur.subfieldId)) {
        //   prev[cur.subfieldId] = cur.value;
        // }
        return prev;
      }, {} as { [subfieldId: string]: string });

    // return s2;

    return { [this.fieldId]: s2 as T };
  }
}

export { MatrixEvaluator };
