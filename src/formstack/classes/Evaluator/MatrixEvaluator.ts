import { TStatusRecord } from "../../../chrome-extension/type";
import { TFsFieldAddress, TFsFieldMatrix } from "../../type.field";
// import { InvalidEvaluation } from "../InvalidEvaluation";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { TFlatSubmissionValues, TUiEvaluationObject } from "./type";
const isString = (str: any) => typeof str === "string" || str instanceof String;
type TSimpleDictionary<T> = { [key: string]: T };
class MatrixEvaluator extends AbstractEvaluator {
  parseValues<S = string, T = string>(submissionDatum?: S): T {
    // parseValues<T>(values: TFlatSubmissionValues): TFlatSubmissionValues<T> {
    // const s2 = this.parseSubmittedData(values);
    return this.parseSubmittedData(submissionDatum as string) as T;
  }

  private parseSubmittedData(
    submissionDatum?: string
  ): TSimpleDictionary<string> | undefined {
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
    }, {} as TSimpleDictionary<string>);
  }

  // private parseSubmittedData(values: TFlatSubmissionValues) {
  private x_parseSubmittedData(submissionDatum?: string) {
    // const submissionData = values[this.fieldId] || [];
    if (!submissionDatum) {
      return null;
    }
    if (!isString(submissionDatum)) {
      return null;
      // return new InvalidEvaluation(
      //   `Matrix value not a string. value: '${submissionData}'.`,
      //   {
      //     value: values[this.fieldId],
      //   }
      // );
    }

    const records = submissionDatum.split("\n");
    return records.map((field: string) => {
      const [subfieldIdRaw, valueRaw] = field.split("=");
      const subfieldId = (subfieldIdRaw || "").trim();
      const value = (valueRaw || "").trim();

      return {
        subfieldId,
        value,
      };
    }) as [{ subfieldId: string; value: string }];
    // return records.map((field: string) => {
    //   const [subfieldIdRaw, valueRaw] = field.split("=");
    //   const subfieldId = (subfieldIdRaw || "").trim();
    //   const value = (valueRaw || "").trim();

    //   return {
    //     subfieldId,
    //     value,
    //   };
    // }) as [{ subfieldId: string; value: string }];
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

  // getUiPopulateObject(values: TFlatSubmissionValues): TUiEvaluationObject[] {
  getUiPopulateObject<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
    // if (!(this.fieldId in values)) {
    //   return [
    //     {
    //       uiid: null,
    //       fieldId: this.fieldId,
    //       fieldType: this.fieldJson.type,
    //       value: "__EMPTY_SUBMISSION_DATA__",
    //       statusMessages: [
    //         {
    //           severity: "info",
    //           message: `Stored value: '__EMPTY_SUBMISSION_DATA__'.`,
    //           relatedFieldIds: [],
    //         },
    //       ],
    //     } as TUiEvaluationObject,
    //   ];
    // }

    // type TypeSubfieldDatum = { subfieldId: string; value: string };
    const parsedValues = this.parseSubmittedData(submissionDatum as string);
    const fieldIdMatrix = this.getAsMatrixUiFieldIdMap();

    if (parsedValues === undefined) {
      return [
        {
          // uiid: `field${this.fieldId}`,
          uiid: null,
          fieldId: this.fieldId,
          fieldType: this.fieldJson.type,
          value: "",
          statusMessages: [
            {
              severity: "info",
              message: "Failed to parse field. ", // + parsedValues.message,
              relatedFieldIds: [],
            },
          ],
        } as TUiEvaluationObject,
      ];
    }
    // if (parsedValues) {
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
    //           message: "Failed to parse field",
    //           relatedFieldIds: [],
    //         },
    //       ],
    //     } as TUiEvaluationObject,
    //   ];
    // }
    const statusMessages: TStatusRecord[] = [
      {
        severity: "info",
        fieldId: this.fieldId,
        message: `Stored value: '${this.getStoredValue(submissionDatum)}'.`,
        relatedFieldIds: [],
      },
    ];

    const selectedRows =
      Object.entries(parsedValues)
        .filter(([row, column]) => {
          const uiFieldId = fieldIdMatrix[row][column];
          if (uiFieldId === undefined) {
            statusMessages.push({
              severity: "warn",
              message: `Unable to find matrix mapping for: '${JSON.stringify({
                row,
                column,
              })}'.`,
              fieldId: this.fieldId,
              relatedFieldIds: [],
            });
          }

          return uiFieldId;
        })
        .map(([row, column]) => {
          const uiFieldId = fieldIdMatrix[row][column];

          // if (uiFieldId === undefined) {
          //   statusMessages.push({
          //     severity: "warn",
          //     message: `Unable to find matrix mapping for: '${JSON.stringify({
          //       row,
          //       column,
          //     })}'.`,
          //     fieldId: this.fieldId,
          //     relatedFieldIds: [],
          //   });
          // }

          return {
            uiid: uiFieldId || null,
            fieldId: this.fieldId,
            fieldType: this.fieldJson.type,
            value: "checked",
            statusMessages: [], //statusMessages,
          } as TUiEvaluationObject;
        }) || [];

    selectedRows.push({
      uiid: null,
      fieldId: this.fieldId,
      fieldType: this.fieldJson.type,
      value: "", // this.getStoredValue<string>(submissionDatum as string),
      statusMessages,
    });
    return selectedRows as TUiEvaluationObject[];
  }

  isCorrectType<T>(submissionDatum: T): boolean {
    const parseSubmittedData = this.parseValues(submissionDatum);

    // should we check if all keys are valid?
    return (
      typeof parseSubmittedData === "object" &&
      parseSubmittedData !== null &&
      Object.keys(parseSubmittedData).length > 0
    );
  }

  evaluateWithValues<S = string, T = string>(values: S): T {
    //     evaluateWithValues<T>(values: TFlatSubmissionValues ): TFlatSubmissionValues<T> {
    const s1 = this.parseSubmittedData(values as string);
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

    // return { [this.fieldId]: s2 as T };
    return s2 as T;
  }
}

export { MatrixEvaluator };
