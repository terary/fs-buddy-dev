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
    return matrix;
  }

  // getUiPopulateObject(values: TFlatSubmissionValues): TUiEvaluationObject[] {
  getUiPopulateObject<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
    const statusMessages: TStatusRecord[] = [
      {
        severity: "info",
        fieldId: this.fieldId,
        message: `Stored value: '${this.getStoredValue(submissionDatum)}'.`,
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

    const parsedValues = this.parseSubmittedData(submissionDatum as string);
    const fieldIdMatrix = this.getAsMatrixUiFieldIdMap();

    if (parsedValues === undefined) {
      statusMessages.push({
        severity: "info",
        fieldId: this.fieldId,
        message: "Failed to parse field. ", // + parsedValues.message,
        relatedFieldIds: [],
      });

      return [
        {
          // uiid: `field${this.fieldId}`,
          uiid: null,
          fieldId: this.fieldId,
          fieldType: this.fieldJson.type,
          value: "",
          statusMessages,
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
    return s1 as T;
    // const s2 =
    //   Array.isArray(s1) &&
    //   s1.reduce((prev, cur, i, a) => {
    //     prev[cur.subfieldId] = cur.value;
    //     // if (this._supportedSubfieldIds.includes(cur.subfieldId)) {
    //     //   prev[cur.subfieldId] = cur.value;
    //     // }
    //     return prev;
    //   }, {} as { [subfieldId: string]: string });

    // // return s2;

    // // return { [this.fieldId]: s2 as T };
    // return s2 as T;
  }
}

export { MatrixEvaluator };
