import { TFsFieldAny, TFsFieldType } from "../../type.field";
import type { TStatusRecord } from "../../../chrome-extension/type";
import { TFlatSubmissionValues, TUiEvaluationObject } from "./type";

type SeverityTypes = "debug" | "error" | "info" | "warn";

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
    return this.wrapAsStatusMessage(
      "info",
      `Stored value: '${this.getStoredValue(submissionDatum)}'.`
    );
  }

  protected getStatusMessageEmptyAndRequired(): TStatusRecord {
    return this.wrapAsStatusMessage(
      "warn",
      "Submission data missing and required.  This is not an issue if the field is hidden by logic."
    );
  }

  protected createStatusMessageArrayWithStoredValue<T>(
    submissionDatum?: T
  ): TStatusRecord[] {
    return [this.getStatusMessageStoredValue(submissionDatum)];
  }

  protected getEmptyStatusMessageArray(): TStatusRecord[] {
    return [];
  }

  protected getUiPopulateObjectsEmptyAndRequired(
    statusMessages: TStatusRecord[]
  ): TUiEvaluationObject[] {
    statusMessages.push(this.getStatusMessageEmptyAndRequired());
    return [this.wrapAsUiObject(null, "", statusMessages)];
  }

  protected wrapAsStatusMessage(
    severity: SeverityTypes,
    message: string,
    relatedFieldIds: string[] = [],
    fieldId?: string
  ): TStatusRecord {
    return {
      severity,
      fieldId: fieldId || this.fieldId,
      message,
      relatedFieldIds,
    };
  }
  protected wrapAsUiObject(
    uiid: string | null, // null -> on field, not on subfield, undefined => on form not on field/subfield, defined => attached to field/subfield
    value: string,
    statusMessages: TStatusRecord[] = []
  ): TUiEvaluationObject {
    return {
      uiid,
      fieldId: this.fieldId,
      fieldType: this.fieldType,
      value,
      statusMessages,
    } as TUiEvaluationObject;
  }

  abstract getUiPopulateObjects<T = string>(
    submissionDatum?: T
  ): TUiEvaluationObject[];
}
export { AbstractEvaluator };
