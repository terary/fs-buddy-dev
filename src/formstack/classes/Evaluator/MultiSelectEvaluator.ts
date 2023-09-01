import { TStatusRecord } from "../../../chrome-extension/type";
import {
  TFsFieldAny,
  TFsFieldCheckbox,
  TFsFieldRadio,
  TFsFieldSelect,
  TFsSelectOption,
} from "../../type.field";
import { AbstractEvaluator } from "./AbstractEvaluator";
import {
  TFlatSubmissionValues,
  TFlatSubmissionValues,
  TUiEvaluationObject,
} from "./type";

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

  parseValues<T>(values: TFlatSubmissionValues): TFlatSubmissionValues<T> {
    return { [this.fieldId]: values[this.fieldId] as T };
  }

  private parseArrayValues<T>(values: TFlatSubmissionValues): TFlatSubmissionValues<T> {
    const splitValues = (values[this.fieldId] || "").split("\n");
    return { [this.fieldId]: splitValues as T };
  }

  evaluateWithValues<T>(values: TFlatSubmissionValues): TFlatSubmissionValues<T> {
    // const selectedOption = this.parseValues(values)[this.fieldId];

    const foundOption = this.getSelectOptions().find(
      (option) => option.value === values[this.fieldId]
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
    return { [this.fieldId]: foundOption.value as T };
  }

  getUiidFieldIdMap() {
    return this.getSelectOptions().reduce((prev, cur, i, a) => {
      prev[cur.value] = `field${this.fieldId}_${i + 1}`;
      return prev;
    }, {} as { [optionValue: string]: string });
  }

  private getUiPopulateObjectCheckbox(
    values: TFlatSubmissionValues
  ): TUiEvaluationObject[] {
    const uiFields: TUiEvaluationObject[] = [];
    const selectedValues = (this.parseArrayValues<string[]>(values)[
      this.fieldId
    ] || []) as string[];
    const uiidFieldIdMap = this.getUiidFieldIdMap();
    const statusMessages: TStatusRecord[] = [
      {
        severity: "info",
        fieldId: this.fieldId,
        message: `Stored value: '${(values[this.fieldId] || "").replace(
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
        severity: "info",
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

  private validOptionValues(): string {
    return this.getSelectOptions()
      .map((x) => x.value)
      .join("', '");
  }
  private getUiPopulateObjectSelect(
    values: TFlatSubmissionValues
  ): TUiEvaluationObject[] {
    const uiFields: TUiEvaluationObject[] = [];
    const selectedValue = (this.parseValues<string>(values)[this.fieldId] ||
      "") as string;
    const statusMessages: TStatusRecord[] = [
      {
        severity: "info",
        fieldId: this.fieldId,
        message: `Stored value: '${(values[this.fieldId] || "").replace(
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

  getUiPopulateObject(values: TFlatSubmissionValues): TUiEvaluationObject[] {
    if (!(this.fieldId in values)) {
      return [
        {
          uiid: null,
          fieldId: this.fieldId,
          fieldType: this.fieldJson.type,
          value: "__EMPTY_SUBMISSION_DATA__",
          statusMessages: [
            {
              severity: "info",
              message: `Stored value: '__EMPTY_SUBMISSION_DATA__'.`,
              relatedFieldIds: [],
            },
          ],
        } as TUiEvaluationObject,
      ];
    }

    if (this.fieldType === "checkbox") {
      return this.getUiPopulateObjectCheckbox(values);
    } else if (this.fieldType === "select") {
      return this.getUiPopulateObjectSelect(values);
    }

    const parsedValues = this.parseValues<string>(values);
    const uiidFieldIdMap = this.getUiidFieldIdMap();
    const statusMessages: TStatusRecord[] = [
      {
        severity: "info",
        fieldId: this.fieldId,
        message: `Stored value: '${(values[this.fieldId] || "").replace(
          /\n/g,
          "\\n"
        )}'.`,
        relatedFieldIds: [],
      },
    ];

    if (!uiidFieldIdMap[parsedValues[this.fieldId]]) {
      statusMessages.push({
        severity: "warn",
        fieldId: this.fieldId,
        message: `Failed to find valid option: '${
          values[this.fieldId]
        }' within valid options: '${this.validOptionValues()}' `,
        relatedFieldIds: [],
      });
    }

    // need to make sure this is being transformed
    // @ts-ignore - this is expected 'required' to be boolean, which happens only if this json has been transformed
    if (
      // @ts-ignore
      (this.fieldJson.required || this.fieldJson.required === "1") &&
      parsedValues[this.fieldId] === ""
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
        uiid: uiidFieldIdMap[parsedValues[this.fieldId]] || this.fieldId,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: parsedValues[this.fieldId] as string,
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
