import { AbstractComplexSubmissionDatumEvaluator } from "./AbstractComplexSubmissionDatumEvaluator";
import { TFsFieldMatrix } from "../../type.field";
import { TUiEvaluationObject } from "./type";

class MatrixEvaluator extends AbstractComplexSubmissionDatumEvaluator {
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

    if (!submissionDatum) {
      if (this.isRequired) {
        return this.getUiPopulateObjectsEmptyAndRequired(statusMessages);
      }
      return [this.wrapAsUiObject(null, "", statusMessages)];
    }

    const parsedValues = this.parseSubmittedData(submissionDatum as string);
    const fieldIdMatrix = this.getAsMatrixUiFieldIdMap();

    if (Object.keys(parsedValues).length === 0) {
      statusMessages.push(
        this.wrapAsStatusMessage(
          "warn",
          `Found no selected rows/columns within submitted data: '${JSON.stringify(
            fieldIdMatrix
          )}' found in submission data: '${submissionDatum}'.`
        )
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
}
export { MatrixEvaluator };
