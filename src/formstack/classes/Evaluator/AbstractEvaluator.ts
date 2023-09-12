import { TFsFieldAny, TFsFieldType } from "../../type.field";
import { TSubmissionDataItem } from "../../type.form";
//import { InvalidEvaluation } from "../InvalidEvaluation";
import { IEValuator } from "./IEvaluator";
import type { TStatusRecord } from "../../../chrome-extension/type";
import { TFlatSubmissionValues, TUiEvaluationObject } from "./type";

abstract class AbstractEvaluator {
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
    return structuredClone(this._fieldJson);
  }

  get fieldType(): TFsFieldType {
    return this.fieldJson.type.slice() as TFsFieldType;
  }

  get isRequired() {
    const { required } = this.fieldJson;
    // @ts-ignore - because field json is supposed to go through transformation that will
    // that will type this boolean
    return required === "1" || required === true;
  }

  abstract parseValues<S = string, T = string>(submissionDatum?: S): T;

  abstract isCorrectType<T>(submissionDatum: T): boolean;

  protected isValidSubmissionDatum(submissionDatum: string) {
    return !(
      ["__EMPTY_SUBMISSION_DATA__", "__MISSING_AND_REQUIRED__"].includes(
        submissionDatum
      ) || "__BAD_DATA_TYPE__ ".match(submissionDatum)
    );
  }

  protected getStoredValue<T = string>(submissionDatum?: T): T {
    if (this.isRequired && submissionDatum === undefined) {
      return "__MISSING_AND_REQUIRED__" as T;
    }

    if (!this.isRequired && submissionDatum === undefined) {
      return "__EMPTY_SUBMISSION_DATA__" as T;
    }

    if (!this.isCorrectType(submissionDatum)) {
      return `__BAD_DATA_TYPE__ "${typeof submissionDatum}"` as T;
    }

    return submissionDatum as T;
  }

  getUiPopulateObject<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
    const datum = this.getStoredValue<string>(submissionDatum as string);

    const statusMessages: TStatusRecord[] = [
      {
        severity: datum === "__MISSING_AND_REQUIRED__" ? "warn" : "info",
        message: `Stored value: '${datum}'.`,
        relatedFieldIds: [],
      },
    ];

    if (datum === "__MISSING_AND_REQUIRED__") {
      statusMessages.push({
        fieldId: this.fieldId,
        severity: "warn",
        message: `Submission data missing and required.  This is not an issue if the field is hidden by logic.`,
        relatedFieldIds: [],
      });
    }

    return [
      {
        uiid: this.isValidSubmissionDatum(datum)
          ? `field${this.fieldId}`
          : null,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: this.isValidSubmissionDatum(datum) ? datum : "",

        statusMessages: statusMessages,
      },
    ];
  }

  private x_getUiPopulateObject_subfields<T = string>(
    values?: any
  ): TUiEvaluationObject[] {
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

    const parsedValues = this.parseValues<T>(values);

    // need to make sure this is being transformed
    // @ts-ignore - this is expected 'required' to be boolean, which happens only if this json has been transformed
    if (
      // @ts-ignore
      (this.fieldJson.required || this.fieldJson.required === "1") &&
      // @ts-ignore
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
        // @ts-ignore

        value: parsedValues[this.fieldId] as string,
        statusMessages,
      },
    ];
  }

  // abstract evaluateWithValues<T = string>(
  //   submissionData: TFlatSubmissionValues<T>
  // ): TFlatSubmissionValues<T>;
}
export { AbstractEvaluator };
