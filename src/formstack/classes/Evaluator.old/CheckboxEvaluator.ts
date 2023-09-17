import { TStatusRecord } from "../../../chrome-extension/type";
import { TFsFieldAny, TFsSelectOption } from "../../type.field";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { TUiEvaluationObject } from "./type";
import { isFunctions } from "../../../common/isFunctions";
import { MultiSelectEvaluator } from "./MultiSelectEvaluator";

Dropdown storedValue - warn, should be info
Radio button broken data should combine status messages (now it add two UiComponents)

class CheckboxEvaluator extends AbstractEvaluator {
  #fieldSelectOptions: TFsSelectOption[];

  constructor(fieldJson: TFsFieldAny) {
    super(fieldJson);
    this.#fieldSelectOptions = (fieldJson.options || []) as TFsSelectOption[];
  }

  private getSelectOptions() {
    return this.#fieldSelectOptions;
  }

  #isValueInSelectOptions(value: string): boolean {
    return this.getSelectOptions().find((x) => x.value === value) !== undefined;
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
    }, {} as { [optionValue: string]: string });
  }

  private invalidSelectedOptionMessage(selectedOption: string): string {
    return `Failed to find valid option: '${selectedOption}' within valid options: '${this.validOptionValues()}'.`;
  }

  private getUiPopulateObjectsCheckbox(
    submissionDatum: string,
    statusMessages: TStatusRecord[]
  ): TUiEvaluationObject[] {
    const uiFields: TUiEvaluationObject[] = [];
    const selectedValues = this.parseArrayValues<string[]>(submissionDatum);
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
            // `Failed to find valid option: '${selectedOption}' within valid options: '${this.validOptionValues()}' `
          )
        );
      }
    });

    uiFields.push(this.wrapAsUiObject(null, "", statusMessages));
    return uiFields;
  }

  isCorrectType<T>(submissionDatum: T): boolean {
    const parseSubmittedData = this.parseValues(submissionDatum);
    return isFunctions.isString(parseSubmittedData);
  }

  private parseArrayValues<T>(submissionDatum?: string): string[] {
    const splitValues = (submissionDatum || "").split("\n");
    return splitValues;
  }

  parseValues<S = string, T = string>(submissionDatum?: S): T {
    return submissionDatum as T;
  }

  private validOptionValues(): string {
    return this.getSelectOptions()
      .map((x) => x.value)
      .join("', '");
  }

  private getUiPopulateObjectsSelect(
    submissionDatum: string,
    statusMessages: TStatusRecord[]
  ): TUiEvaluationObject[] {
    const uiFields: TUiEvaluationObject[] = [];
    const selectedValue = this.parseValues<string>(submissionDatum);

    if (!this.#isValueInSelectOptions(selectedValue)) {
      statusMessages.push(
        this.wrapAsStatusMessage(
          "warn",
          this.invalidSelectedOptionMessage(selectedValue)

          // `Failed to find valid option: '${selectedValue}' within valid options: '${this.validOptionValues()}'.`
        )
      );
    }
    uiFields.push(
      this.wrapAsUiObject(`field${this.fieldId}`, selectedValue, statusMessages)
    );

    return uiFields;
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
      ];
    }
    //  value: '__BAD_DATA_TYPE__ "string"',

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

    if (
      ["radio", "select"].includes(this.fieldType) &&
      !isFunctions.isString(submissionDatum)
    ) {
      return [this.wrapAsUiObject(null, "", statusMessages)];
    }

    if (this.isRequired && submissionDatum === undefined) {
      return this.getUiPopulateObjectsEmptyAndRequired(statusMessages);
    }

    if (this.fieldType === "checkbox") {
      // is it worth further refactoring Checkbox/Select? or break into there own classes (ideal)
      return this.getUiPopulateObjectsCheckbox(
        submissionDatum as string,
        statusMessages
      );
    } else if (this.fieldType === "select") {
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
          // `Failed to find valid option: '${submissionDatum}' within valid options: '${this.validOptionValues()}'.`
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
}

export { CheckboxEvaluator };
