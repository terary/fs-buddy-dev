import { TFsFieldAny, TFsFieldType } from "../../type.field";
import { TSubmissionDataItem } from "../../type.form";
//import { InvalidEvaluation } from "../InvalidEvaluation";
import { IEValuator } from "./IEvaluator";
import type { TStatusRecord } from "../../../chrome-extension/type";
import {
  TFlatSubmissionValues,
  TFlatSubmissionValues,
  TUiEvaluationObject,
} from "./type";

abstract class AbstractEvaluator implements IEValuator {
  private _fieldJson: TFsFieldAny;
  private _fieldId: string;
  constructor(fieldJson: TFsFieldAny) {
    this._fieldJson = fieldJson;
    this._fieldId = fieldJson.id;
  }

  get fieldId(): string {
    return this._fieldId;
  }

  get fieldJson() {
    return this._fieldJson;
  }

  get fieldType(): TFsFieldType {
    return this.fieldJson.type;
  }

  abstract parseValues<T>(values: TFlatSubmissionValues): TFlatSubmissionValues<T>;

  protected getStoredValue(values: TFlatSubmissionValues) {
    if (this.fieldId in values) {
      return values[this.fieldId];
    } else {
      return "__EMPTY_SUBMISSION_DATA__";
    }
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

    const statusMessages: TStatusRecord[] = [
      {
        severity: "info",
        fieldId: this.fieldId,
        message: `Stored value: '${this.getStoredValue(values)}'.`,
        relatedFieldIds: [],
      },
    ];

    const parsedValues = this.parseValues<string>(values);
    // if (parsedValues instanceof InvalidEvaluation) {
    //   return [
    //     {
    //       uiid: `field${this.fieldId}`,
    //       fieldId: this.fieldId,
    //       fieldType: this.fieldJson.type,
    //       value: "",
    //       statusMessages: [
    //         {
    //           severity: "error",
    //           message: "Failed to parse field. " + parsedValues.message,
    //           relatedFieldIds: [],
    //         },
    //       ],
    //     } as TUiEvaluationObject,
    //   ];
    // }

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
        uiid: `field${this.fieldId}`,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: parsedValues[this.fieldId] as string,
        statusMessages,
      },
    ];
  }

  abstract evaluateWithValues<T>(
    values: TFlatSubmissionValues
  ): TFlatSubmissionValues<T>;
}
export { AbstractEvaluator };
