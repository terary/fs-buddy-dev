import { TFsFieldAny, TFsFieldType } from "../../type.field";
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

  protected getStatusMessageStoredValue<T>(submissionDatum?: T): TStatusRecord {
    return {
      severity: "info",
      fieldId: this.fieldId,
      message: `Stored value: '${this.getStoredValue(submissionDatum)}'.`,
      relatedFieldIds: [],
    };
  }

  protected getStatusMessageEmptyAndRequired(): TStatusRecord {
    return {
      severity: "warn",
      fieldId: this.fieldId,
      message:
        "Submission data missing and required.  This is not an issue if the field is hidden by logic.",
      relatedFieldIds: [],
    };
  }

  protected createStatusMessageArrayWithStoredValue<T>(
    submissionDatum?: T
  ): TStatusRecord[] {
    return [this.getStatusMessageStoredValue(submissionDatum)];
  }

  protected getEmptyStatusMessageArray(): TStatusRecord[] {
    return [];
  }

  protected getUiPopulateObjectEmptyAndRequired(
    statusMessages: TStatusRecord[]
  ): TUiEvaluationObject[] {
    statusMessages.push(this.getStatusMessageEmptyAndRequired());
    return [
      {
        uiid: null,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: "",
        statusMessages,
      },
    ];
  }

  abstract getUiPopulateObject<T = string>(
    submissionDatum?: T
  ): TUiEvaluationObject[];
}
export { AbstractEvaluator };
