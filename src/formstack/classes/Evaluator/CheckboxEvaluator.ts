import { TUiEvaluationObject } from "./type";
import { isFunctions } from "../../../common/isFunctions";
import { AbstractSelectOptionEvaluator } from "./AbstractSelectOptionEvaluator";

class CheckboxEvaluator extends AbstractSelectOptionEvaluator {
  isCorrectType<T>(submissionDatum: T): boolean {
    if (!isFunctions.isString(submissionDatum)) {
      return false;
    }
    const parseSubmittedData = this.parseToSelectedValuesArray(
      submissionDatum as string
    );
    return Array.isArray(parseSubmittedData);
  }

  private parseToSelectedValuesArray(submissionDatum?: string): string[] {
    const splitValues = (submissionDatum || "").split("\n");
    return splitValues;
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

    if (!this.isCorrectType(submissionDatum)) {
      statusMessages.push(
        this.wrapAsStatusMessage(
          "error",
          `_BAD_DATA_TYPE_' type: '${typeof submissionDatum}', value: '${submissionDatum}'.`
        )
      );
      return [this.wrapAsUiObject(null, "", statusMessages)];
    }

    const uiFields: TUiEvaluationObject[] = [];
    const selectedValues = this.parseToSelectedValuesArray(
      submissionDatum as string
    );
    const uiidFieldIdMap = this.getUiidFieldIdMap();

    selectedValues.forEach((selectedOption) => {
      if (uiidFieldIdMap[selectedOption]) {
        uiFields.push(
          this.wrapAsUiObject(uiidFieldIdMap[selectedOption], selectedOption)
        );
      } else {
        statusMessages.push(
          this.wrapAsStatusMessage(
            "warn",
            this.invalidSelectedOptionMessage(selectedOption)
          )
        );
      }
    });

    uiFields.push(this.wrapAsUiObject(null, "", statusMessages));
    return uiFields;
  }
}

export { CheckboxEvaluator };
