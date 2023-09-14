import { TStatusRecord } from "../../../chrome-extension/type";
import { TFsFieldAny, TFsSelectOption } from "../../type.field";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { TUiEvaluationObject } from "./type";

class MultiSelectEvaluator extends AbstractEvaluator {
  private _fieldSelectOptions: TFsSelectOption[];

  constructor(fieldJson: TFsFieldAny) {
    super(fieldJson);
    this._fieldSelectOptions = (fieldJson.options || []) as TFsSelectOption[];
  }

  private getSelectOptions() {
    return this._fieldSelectOptions;
  }

  private isValueInSelectOptions(value: string): boolean {
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
            "info",
            `Failed to find valid option: '${selectedOption}' within valid options: '${this.validOptionValues()}' `
          )
        );
      }
    });

    uiFields.push(this.wrapAsUiObject(null, "", statusMessages));
    return uiFields;
  }

  isCorrectType<T>(submissionDatum: T): boolean {
    const parseSubmittedData = this.parseValues(submissionDatum);
    return (
      typeof parseSubmittedData === "object" &&
      parseSubmittedData !== null &&
      Object.keys(parseSubmittedData).length > 0
    );
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

    if (!this.isValueInSelectOptions(selectedValue)) {
      statusMessages.push(
        this.wrapAsStatusMessage(
          "warn",
          `Failed to find valid option: '${selectedValue}' within valid options: '${this.validOptionValues()}'.`
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
    if ((this.isRequired && submissionDatum === "") || !submissionDatum) {
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
          `Failed to find valid option: '${submissionDatum}' within valid options: '${this.validOptionValues()}' `
        )
      );
    }

    if (this.isRequired && parsedValues === "") {
      statusMessages.push(
        this.wrapAsStatusMessage(
          "info",
          "Field value appears empty but field is required. (if this field is eventually hidden by logic, then empty value is not significant.)"
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

export { MultiSelectEvaluator };
