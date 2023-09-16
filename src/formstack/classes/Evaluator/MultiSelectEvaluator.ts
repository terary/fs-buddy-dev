import { TStatusRecord } from "../../../chrome-extension/type";
import { TFsFieldAny, TFsSelectOption } from "../../type.field";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { TUiEvaluationObject } from "./type";
import { isFunctions } from "../../../common/isFunctions";
class MultiSelectEvaluator extends AbstractEvaluator {
  private _fieldSelectOptions: TFsSelectOption[];

  constructor(fieldJson: TFsFieldAny) {
    super(fieldJson);
    this._fieldSelectOptions = (fieldJson.options || []) as TFsSelectOption[];
  }

  #getSelectOptions() {
    return this._fieldSelectOptions;
  }

  private isValueInSelectOptions(value: string): boolean {
    return (
      this.#getSelectOptions().find((x) => x.value === value) !== undefined
    );
  }

  evaluateWithValues<S = string, T = string>(value: S): T {
    const foundOption = this.#getSelectOptions().find(
      (option) => option.value === value
    ) || { value: undefined };

    return foundOption.value as T;
  }

  getUiidFieldIdMap() {
    return this.#getSelectOptions().reduce((prev, cur, i, a) => {
      prev[cur.value] = `field${this.fieldId}_${i + 1}`;
      return prev;
    }, {} as { [optionValue: string]: string });
  }

  private invalidSelectedOptionMessage(selectedOption: string): string {
    return `Failed to find valid option: '${selectedOption}' within valid options: '${this.validOptionValues()}'.`;
  }

  isCorrectType<T>(submissionDatum: T): boolean {
    const parseSubmittedData = this.parseValues(submissionDatum);
    return isFunctions.isString(parseSubmittedData);
  }

  parseValues<S = string, T = string>(submissionDatum?: S): T {
    return submissionDatum as T;
  }

  private validOptionValues(): string {
    return this.#getSelectOptions()
      .map((x) => x.value)
      .join("', '");
  }

  protected createStatusMessageArrayWithStoredValue<T>(
    submissionDatum?: T | undefined
  ): TStatusRecord[] {
    if (submissionDatum === undefined && this.isRequired) {
      return [
        this.wrapAsStatusMessage(
          "warn",
          `Stored value: '__MISSING_AND_REQUIRED__'.`
        ),
        this.wrapAsStatusMessage(
          "warn",
          this.invalidSelectedOptionMessage(submissionDatum as string)
        ),
      ];
    }

    if (!isFunctions.isString(submissionDatum)) {
      return [
        this.wrapAsStatusMessage(
          "warn",
          `Stored value: '__BAD_DATA_TYPE__ (${typeof submissionDatum})'.`
        ),
        this.wrapAsStatusMessage(
          "warn",
          `stringified: ${JSON.stringify(submissionDatum)}`
        ),
      ];
    }

    return [
      this.wrapAsStatusMessage(
        "info",
        `Stored value: '${((submissionDatum as string) || "").replace(
          /\n/g,
          "\\n"
        )}'.`
      ),
    ];
  }

  getUiPopulateObjects<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
    const statusMessages =
      this.createStatusMessageArrayWithStoredValue(submissionDatum);

    if (!isFunctions.isString(submissionDatum)) {
      return [this.wrapAsUiObject(null, "", statusMessages)];
    }

    if (this.fieldType === "select") {
      return this.getUiPopulateObjectsSelect(
        submissionDatum as string,
        statusMessages
      );
    }

    const parsedValues = this.parseValues<string>(submissionDatum as string);
    const uiidFieldIdMap = this.getUiidFieldIdMap();

    if (!uiidFieldIdMap[parsedValues]) {
      statusMessages.push(
        this.wrapAsStatusMessage(
          "warn",
          this.invalidSelectedOptionMessage(submissionDatum as string)
        )
      );
    }

    return [
      this.wrapAsUiObject(
        uiidFieldIdMap[parsedValues] || this.fieldId,
        parsedValues
      ),
      this.wrapAsUiObject(null, "null", statusMessages),
    ];
  }

  private getUiPopulateObjectsSelect(
    submissionDatum: string,
    statusMessages: TStatusRecord[]
  ): TUiEvaluationObject[] {
    const selectedValue = this.parseValues<string>(submissionDatum);

    if (!this.isValueInSelectOptions(selectedValue)) {
      statusMessages.push(
        this.wrapAsStatusMessage(
          "warn",
          this.invalidSelectedOptionMessage(selectedValue)
        )
      );
      return [this.wrapAsUiObject(null, "", statusMessages)];
    }
    return [
      this.wrapAsUiObject(
        `field${this.fieldId}`,
        selectedValue,
        statusMessages
      ),
    ];
  }
}

export { MultiSelectEvaluator };
