import { TFsFieldMatrix } from "../../type.field";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { TUiEvaluationObject } from "./type";

const isString = (str: any) => typeof str === "string" || str instanceof String;
type TSimpleDictionary<T> = { [key: string]: T };

class MatrixEvaluator extends AbstractEvaluator {
  evaluateWithValues<S = string, T = string>(values: S): T {
    return this.parseSubmittedData(values as string) as T;
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

  getUiPopulateObjects<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
    const statusMessages =
      this.createStatusMessageArrayWithStoredValue(submissionDatum);

    if ((this.isRequired && submissionDatum === "") || !submissionDatum) {
      return this.getUiPopulateObjectsEmptyAndRequired(statusMessages);
    }

    const parsedValues = this.parseSubmittedData(submissionDatum as string);
    const fieldIdMatrix = this.getAsMatrixUiFieldIdMap();

    if (parsedValues === undefined) {
      statusMessages.push(
        this.wrapAsStatusMessage("info", "Failed to parse field. ")
      );

      return [this.wrapAsUiObject(null, "", statusMessages)];
    }

    const selectedRows =
      Object.entries(parsedValues)
        .filter(([row, column]) => {
          const uiFieldId = fieldIdMatrix[row][column];
          if (uiFieldId === undefined) {
            statusMessages.push(
              this.wrapAsStatusMessage(
                "warn",
                `Unable to find matrix mapping for: '${JSON.stringify({
                  row,
                  column,
                })}'.`
              )
            );
          }

          return uiFieldId;
        })
        .map(([row, column]) => {
          const uiFieldId = fieldIdMatrix[row][column];
          return this.wrapAsUiObject(uiFieldId || null, "checked");
        }) || [];

    selectedRows.push(this.wrapAsUiObject(null, "", statusMessages));
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

  parseValues<S = string, T = string>(submissionDatum?: S): T {
    return this.parseSubmittedData(submissionDatum as string) as T;
  }
}

export { MatrixEvaluator };
