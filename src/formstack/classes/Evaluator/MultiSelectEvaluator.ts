import { TStatusRecord } from "../../../chrome-extension/type";
import {
  TFsFieldAny,
  TFsFieldCheckbox,
  TFsFieldRadio,
  TFsFieldSelect,
  TFsSelectOption,
} from "../../type.field";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { TFlatSubmissionValues, TUiEvaluationObject } from "./type";

type TSelectFields = TFsFieldRadio | TFsFieldSelect | TFsFieldCheckbox;

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

  parseValues<S = string, T = string>(submissionDatum?: S): T {
    // parseValues<T>(values: TFlatSubmissionValues): TFlatSubmissionValues<T> {
    // return { [this.fieldId]: values[this.fieldId] as T };
    return submissionDatum as T;
  }

  private parseArrayValues<T>(submissionDatum?: string): string[] {
    const splitValues = (submissionDatum || "").split("\n");
    return splitValues;
  }

  evaluateWithValues<S = string, T = string>(value: S): T {
    //     evaluateWithValues<T>( values: TFlatSubmissionValues) : TFlatSubmissionValues<T> {

    const foundOption = this.getSelectOptions().find(
      (option) => option.value === value
    ) || { value: undefined };

    // if (foundOption === undefined) {
    //   return {
    //     [this.fieldId]: new InvalidEvaluation("Selected option not found.", {
    //       options: (this.fieldJson as TSelectFields).options || [],
    //       searchValue: values[this.fieldId],
    //     }),
    //   };
    // } else {
    //   return { [this.fieldId]: foundOption.value as T };
    // }
    // return { [this.fieldId]: foundOption.value as T };
    return foundOption.value as T;
  }

  getUiidFieldIdMap() {
    return this.getSelectOptions().reduce((prev, cur, i, a) => {
      prev[cur.value] = `field${this.fieldId}_${i + 1}`;
      return prev;
    }, {} as { [optionValue: string]: string });
  }

  // getUiPopulateObjects<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
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
          //   {
          //   uiid: uiidFieldIdMap[selectedOption],
          //   fieldId: this.fieldId,
          //   fieldType: this.fieldJson.type,
          //   value: selectedOption,
          //   statusMessages: [],
          // }
        );
      } else {
        statusMessages.push(
          this.wrapAsStatusMessage(
            "info",
            `Failed to find valid option: '${selectedOption}' within valid options: '${this.validOptionValues()}' `
          )
          //   {
          //   severity: "info",
          //   fieldId: this.fieldId,
          //   message: `Failed to find valid option: '${selectedOption}' within valid options: '${this.validOptionValues()}' `,
          //   relatedFieldIds: [],
          // }
        );
      }
    });

    // if (this.isRequired && selectedValues.length === 0) {
    //   statusMessages.push({
    //     severity: "warn",
    //     fieldId: this.fieldId,
    //     message:
    //       "Field value appears empty but field is required. (if this field is eventually hidden by logic, then empty value is not significant.)",
    //   });
    // }

    uiFields.push(
      this.wrapAsUiObject(null, "", statusMessages)
      //   {
      //   uiid: null,
      //   fieldId: this.fieldId,
      //   fieldType: this.fieldJson.type,
      //   value: "",
      //   statusMessages,
      // }
    );
    return uiFields;
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
        //   {
        //   severity: "warn",
        //   fieldId: this.fieldId,
        //   message: `Failed to find valid option: '${selectedValue}' within valid options: '${this.validOptionValues()}' `,
        //   relatedFieldIds: [],
        // }
      );
    }

    // if (this.isRequired && selectedValue.length === 0) {
    //   statusMessages.push({
    //     severity: "warn",
    //     fieldId: this.fieldId,
    //     message:
    //       "Field value appears empty but field is required. (if this field is eventually hidden by logic, then empty value is not significant.)",
    //   });
    // }

    uiFields.push(
      this.wrapAsUiObject(`field${this.fieldId}`, selectedValue, statusMessages)
      //   {
      //   // others are subfields, this is the main/parent record, used primarily to attach status messages.
      //   uiid: `field${this.fieldId}`,
      //   fieldId: this.fieldId,
      //   fieldType: this.fieldJson.type,
      //   value: selectedValue,
      //   statusMessages,
      // }
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
      // {
      //   severity: "info",
      //   fieldId: this.fieldId,
      // message: `Stored value: '${((submissionDatum as string) || "").replace(
      //   /\n/g,
      //   "\\n"
      // )}'.`,
      //   relatedFieldIds: [],
      // },
    ];
  }

  getUiPopulateObjects<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
    const statusMessages =
      this.createStatusMessageArrayWithStoredValue(submissionDatum);
    if ((this.isRequired && submissionDatum === "") || !submissionDatum) {
      return this.getUiPopulateObjectsEmptyAndRequired(statusMessages);
    }

    // if (this.isRequired && (submissionDatum === "" || !submissionDatum)) {
    //   statusMessages.push({
    //     severity: "warn",
    //     fieldId: this.fieldId,
    //     message:
    //       "Submission data missing and required.  This is not an issue if the field is hidden by logic.",
    //     relatedFieldIds: [],
    //   });
    //   return [
    //     {
    //       uiid: null,
    //       fieldId: this.fieldId,
    //       fieldType: this.fieldJson.type,
    //       value: "",
    //       statusMessages,
    //     } as TUiEvaluationObject,
    //   ];
    // }

    if (this.fieldType === "checkbox") {
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
        //   {
        //   severity: "warn",
        //   fieldId: this.fieldId,
        //   message: `Failed to find valid option: '${submissionDatum}' within valid options: '${this.validOptionValues()}' `,
        //   relatedFieldIds: [],
        // }
      );
    }

    if (this.isRequired && parsedValues === "") {
      statusMessages.push(
        this.wrapAsStatusMessage(
          "info",
          "Field value appears empty but field is required. (if this field is eventually hidden by logic, then empty value is not significant.)"
        )
        //   {
        //   severity: "info",
        //   fieldId: this.fieldId,
        //   message:
        //     "Field value appears empty but field is required. (if this field is eventually hidden by logic, then empty value is not significant.)",
        // }
      );
    }

    return [
      this.wrapAsUiObject(
        uiidFieldIdMap[parsedValues] || this.fieldId,
        parsedValues
      ),
      // {
      //   uiid: uiidFieldIdMap[parsedValues] || this.fieldId,
      //   fieldId: this.fieldId,
      //   fieldType: this.fieldJson.type,
      //   value: parsedValues as string,
      //   statusMessages: [],
      // },
      this.wrapAsUiObject(null, "null", statusMessages),
      // {
      //   uiid: null,
      //   fieldId: this.fieldId,
      //   fieldType: this.fieldJson.type,
      //   value: "null",
      //   statusMessages,
      // },
    ];
  }
}

export { MultiSelectEvaluator };
