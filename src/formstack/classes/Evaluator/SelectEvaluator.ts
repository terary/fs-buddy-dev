import { TStatusRecord } from "../../../chrome-extension/type";
import { TFsFieldAny, TFsSelectOption } from "../../type.field";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { TSimpleDictionary, TUiEvaluationObject } from "./type";
import { isFunctions } from "../../../common/isFunctions";
import { AbstractComplexSubmissionDatumEvaluator } from "./AbstractComplexSubmissionDatumEvaluator";
import { CheckboxEvaluator } from "./CheckboxEvaluator";

class SelectEvaluator extends CheckboxEvaluator {
  // private _fieldSelectOptions: TFsSelectOption[];
  // #fieldSelectOptions: TFsSelectOption[];

  // #fieldSelectOptions: TFsSelectOption[];
  // constructor(fieldJson: TFsFieldAny) {
  //   super(fieldJson);
  //   this.#fieldSelectOptions = (fieldJson.options || []) as TFsSelectOption[];
  // }
  // private getSelectOptions() {
  //   return this.#fieldSelectOptions;
  // }
  // evaluateWithValues<S = string, T = string>(value: S): T {
  //   const foundOption = this.getSelectOptions().find(
  //     (option) => option.value === value
  //   ) || { value: undefined };
  //   return foundOption.value as T;
  // }
  // getUiidFieldIdMap() {
  //   return this.getSelectOptions().reduce((prev, cur, i, a) => {
  //     prev[cur.value] = `field${this.fieldId}_${i + 1}`;
  //     return prev;
  //   }, {} as TSimpleDictionary<string>);
  // }
  // private invalidSelectedOptionMessage(selectedOption: string): string {
  //   return `Failed to find valid option: '${selectedOption}' within valid options: '${this.validOptionAsPrintableString()}'.`;
  // }
  // isCorrectType<T>(submissionDatum: T): boolean {
  //   if (!isFunctions.isString(submissionDatum)) {
  //     return false;
  //   }
  //   const parseSubmittedData = this.parseToSelectedValuesArray(
  //     submissionDatum as string
  //   );
  //   return Array.isArray(parseSubmittedData);
  //   // return isFunctions.isString(parseSubmittedData);
  // }
  // private parseToSelectedValuesArray(submissionDatum?: string): string[] {
  //   const splitValues = (submissionDatum || "").split("\n");
  //   return splitValues;
  // }
  // private validOptionAsPrintableString(): string {
  //   return this.getSelectOptions()
  //     .map((x) => x.value)
  //     .join("', '");
  // }
  // getUiPopulateObjects<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
  //   const statusMessages =
  //     this.createStatusMessageArrayWithStoredValue(submissionDatum);
  //   if (!submissionDatum) {
  //     if (this.isRequired) {
  //       return this.getUiPopulateObjectsEmptyAndRequired(statusMessages);
  //     }
  //     return [this.wrapAsUiObject(null, "", statusMessages)];
  //   }
  //   if (!this.isCorrectType(submissionDatum)) {
  //     statusMessages.push(
  //       this.wrapAsStatusMessage(
  //         "error",
  //         `_BAD_DATA_TYPE_' type: '${typeof submissionDatum}', value: '${submissionDatum}'.`
  //       )
  //     );
  //     return [this.wrapAsUiObject(null, "", statusMessages)];
  //   }
  //   const uiFields: TUiEvaluationObject[] = [];
  //   const selectedValues = this.parseToSelectedValuesArray(
  //     submissionDatum as string
  //   );
  //   const uiidFieldIdMap = this.getUiidFieldIdMap();
  //   // this should be map
  //   selectedValues.forEach((selectedOption) => {
  //     if (uiidFieldIdMap[selectedOption]) {
  //       uiFields.push(
  //         this.wrapAsUiObject(uiidFieldIdMap[selectedOption], selectedOption)
  //       );
  //     } else {
  //       statusMessages.push(
  //         this.wrapAsStatusMessage(
  //           "warn",
  //           this.invalidSelectedOptionMessage(selectedOption)
  //         )
  //       );
  //     }
  //   });
  //   uiFields.push(this.wrapAsUiObject(null, "", statusMessages));
  //   return uiFields;
  // }
  // #getSelectOptions() {
  //   return this._fieldSelectOptions;
  // }
  // private validOptionValues(): string {
  //   return this.getSelectOptions()
  //     .map((x) => x.value)
  //     .join("', '");
  // }

  private isValueInSelectOptions(value: string): boolean {
    return this.getSelectOptions().find((x) => x.value === value) !== undefined;
  }

  parseValues<S = string, T = string>(submissionDatum?: S): T;
  parseValues(submissionDatum?: string): string {
    return submissionDatum as string;
  }

  getUiPopulateObjects<T = string>(submissionDatum?: T): TUiEvaluationObject[];
  getUiPopulateObjects(submissionDatum: string): TUiEvaluationObject[] {
    const statusMessages =
      this.createStatusMessageArrayWithStoredValue(submissionDatum);

    if (!submissionDatum) {
      statusMessages.push(
        this.wrapAsStatusMessage(
          "warn",
          this.invalidSelectedOptionMessage(submissionDatum as string)
        )
      );

      if (this.isRequired) {
        return this.getUiPopulateObjectsEmptyAndRequired(statusMessages);
      }
      return [this.wrapAsUiObject(null, "", statusMessages)];
    }

    if (!isFunctions.isString(submissionDatum)) {
      const message =
        `_BAD_DATA_TYPE_' type: '${typeof submissionDatum}', value: '` +
        JSON.stringify(submissionDatum).slice(0, 100) +
        "'";
      statusMessages.push(this.wrapAsStatusMessage("warn", message));

      return [this.wrapAsUiObject(null, "", statusMessages)];
    }

    // if (!isFunctions.isString(submissionDatum)) {
    //   return [
    //     this.wrapAsStatusMessage(
    //       "warn",
    //       `Stored value: '__BAD_DATA_TYPE__ (${typeof submissionDatum})'.`
    //     ),
    //     this.wrapAsStatusMessage(
    //       "warn",
    //       `stringified: ${JSON.stringify(submissionDatum)}`
    //     ),
    //   ];
    // }

    // override parseValues
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

export { SelectEvaluator };
