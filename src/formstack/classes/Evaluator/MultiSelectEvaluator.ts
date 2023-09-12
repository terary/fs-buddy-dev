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

  // getUiPopulateObject<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
  private getUiPopulateObjectCheckbox(
    submissionDatum?: string
  ): TUiEvaluationObject[] {
    const uiFields: TUiEvaluationObject[] = [];
    const selectedValues = this.parseArrayValues<string[]>(submissionDatum);
    const uiidFieldIdMap = this.getUiidFieldIdMap();
    const statusMessages: TStatusRecord[] = [
      {
        severity: "info",
        fieldId: this.fieldId,
        message: `Stored value: '${(submissionDatum || "").replace(
          /\n/g,
          "\\n"
        )}'.`,
        relatedFieldIds: [],
      },
    ];

    selectedValues.forEach((selectedOption) => {
      if (uiidFieldIdMap[selectedOption]) {
        uiFields.push({
          uiid: uiidFieldIdMap[selectedOption],
          fieldId: this.fieldId,
          fieldType: this.fieldJson.type,
          value: selectedOption,
          statusMessages: [],
        });
      } else {
        statusMessages.push({
          severity: "info",
          fieldId: this.fieldId,
          message: `Failed to find valid option: '${selectedOption}' within valid options: '${this.validOptionValues()}' `,
          relatedFieldIds: [],
        });
      }
    });

    // need to make sure this is being transformed
    // @ts-ignore - this is expected 'required' to be boolean, which happens only if this json has been transformed
    if (
      // @ts-ignore
      (this.fieldJson.required || this.fieldJson.required === "1") &&
      selectedValues.length === 0
    ) {
      statusMessages.push({
        severity: "warn",
        fieldId: this.fieldId,
        message:
          "Field value appears empty but field is required. (if this field is eventually hidden by logic, then empty value is not significant.)",
      });
    }

    // if (statusMessages.length > 0) {
    uiFields.push({
      uiid: null,
      fieldId: this.fieldId,
      fieldType: this.fieldJson.type,
      value: "",
      statusMessages,
    });
    // }

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
  private getUiPopulateObjectSelect(
    submissionDatum?: string
  ): TUiEvaluationObject[] {
    const uiFields: TUiEvaluationObject[] = [];
    const selectedValue = this.parseValues<string>(submissionDatum);
    const statusMessages: TStatusRecord[] = [
      {
        severity: "info",
        fieldId: this.fieldId,
        message: `Stored value: '${(submissionDatum || "").replace(
          /\n/g,
          "\\n"
        )}'.`,

        relatedFieldIds: [],
      },
    ];

    //    const uiidFieldIdMap = this.getUiidFieldIdMap();

    if (!this.isValueInSelectOptions(selectedValue)) {
      statusMessages.push({
        severity: "warn",
        fieldId: this.fieldId,
        message: `Failed to find valid option: '${selectedValue}' within valid options: '${this.validOptionValues()}' `,
        relatedFieldIds: [],
      });
    }

    // need to make sure this is being transformed
    // @ts-ignore - this is expected 'required' to be boolean, which happens only if this json has been transformed
    if (
      // @ts-ignore
      (this.fieldJson.required || this.fieldJson.required === "1") &&
      selectedValue.length === 0
    ) {
      statusMessages.push({
        severity: "warn",
        fieldId: this.fieldId,
        message:
          "Field value appears empty but field is required. (if this field is eventually hidden by logic, then empty value is not significant.)",
      });
    }

    uiFields.push({
      // others are subfields, this is the main/parent record, used primarily to attach status messages.
      uiid: `field${this.fieldId}`,
      fieldId: this.fieldId,
      fieldType: this.fieldJson.type,
      value: selectedValue,
      statusMessages,
    });

    return uiFields;
  }

  getUiPopulateObject<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
    // getUiPopulateObject(values: TFlatSubmissionValues): TUiEvaluationObject[] {
    // if (!(this.fieldId in values)) {
    //   return [
    //     {
    //       uiid: null,
    //       fieldId: this.fieldId,
    //       fieldType: this.fieldJson.type,
    //       value: "__EMPTY_SUBMISSION_DATA__",
    //       statusMessages: [
    //         {
    //           severity: "info",
    //           message: `Stored value: '__EMPTY_SUBMISSION_DATA__'.`,
    //           relatedFieldIds: [],
    //         },
    //       ],
    //     } as TUiEvaluationObject,
    //   ];
    // }

    if (this.fieldType === "checkbox") {
      return this.getUiPopulateObjectCheckbox(submissionDatum as string);
    } else if (this.fieldType === "select") {
      return this.getUiPopulateObjectSelect(submissionDatum as string);
    }

    const parsedValues = this.parseValues<string>(submissionDatum as string);
    const uiidFieldIdMap = this.getUiidFieldIdMap();
    const statusMessages: TStatusRecord[] = [
      {
        severity: "info",
        fieldId: this.fieldId,
        message: `Stored value: '${((submissionDatum as string) || "").replace(
          /\n/g,
          "\\n"
        )}'.`,
        relatedFieldIds: [],
      },
    ];

    if (!uiidFieldIdMap[parsedValues]) {
      statusMessages.push({
        severity: "warn",
        fieldId: this.fieldId,
        message: `Failed to find valid option: '${submissionDatum}' within valid options: '${this.validOptionValues()}' `,
        relatedFieldIds: [],
      });
    }

    // need to make sure this is being transformed
    // @ts-ignore - this is expected 'required' to be boolean, which happens only if this json has been transformed
    if (
      // @ts-ignore
      (this.fieldJson.required || this.fieldJson.required === "1") &&
      parsedValues === ""
    ) {
      statusMessages.push({
        severity: "info",
        fieldId: this.fieldId,
        message:
          "Field value appears empty but field is required. (if this field is eventually hidden by logic, then empty value is not significant.)",
      });
    }

    return [
      {
        uiid: uiidFieldIdMap[parsedValues] || this.fieldId,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: parsedValues as string,
        statusMessages: [],
      },
      {
        uiid: null,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: "null",
        statusMessages,
      },
    ];
  }
}

export { MultiSelectEvaluator };
