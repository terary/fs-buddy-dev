import { TStatusRecord } from "../../../chrome-extension/type";
import { TFsFieldAny, TFsSelectOption } from "../../type.field";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { TSimpleDictionary, TUiEvaluationObject } from "./type";
import { isFunctions } from "../../../common/isFunctions";
import { AbstractComplexSubmissionDatumEvaluator } from "./AbstractComplexSubmissionDatumEvaluator";

class CheckboxEvaluator extends AbstractComplexSubmissionDatumEvaluator {
  #fieldSelectOptions: TFsSelectOption[];

  constructor(fieldJson: TFsFieldAny) {
    super(fieldJson);
    this.#fieldSelectOptions = (fieldJson.options || []) as TFsSelectOption[];
  }

  protected getSelectOptions() {
    return this.#fieldSelectOptions;
  }

  evaluateWithValues<S = string, T = string>(value: S): T {
    const foundOption = this.getSelectOptions().find(
      (option) => option.value === value
    ) || { value: undefined };

    return foundOption.value as T;
  }

  getUiidFieldIdMap() {
    return this.getSelectOptions().reduce((prev, cur, i, a) => {
      prev[cur.value] = `field${this.fieldId}_${i + 1}`;
      return prev;
    }, {} as TSimpleDictionary<string>);
  }

  protected invalidSelectedOptionMessage(selectedOption: string): string {
    return `Failed to find valid option: '${selectedOption}' within valid options: '${this.validOptionAsPrintableString()}'.`;
  }

  isCorrectType<T>(submissionDatum: T): boolean {
    if (!isFunctions.isString(submissionDatum)) {
      return false;
    }
    const parseSubmittedData = this.parseToSelectedValuesArray(
      submissionDatum as string
    );
    return Array.isArray(parseSubmittedData);
    // return isFunctions.isString(parseSubmittedData);
  }

  private parseToSelectedValuesArray(submissionDatum?: string): string[] {
    const splitValues = (submissionDatum || "").split("\n");
    return splitValues;
  }

  private validOptionAsPrintableString(): string {
    return this.getSelectOptions()
      .map((x) => x.value)
      .join("', '");
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

    // this should be map
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
