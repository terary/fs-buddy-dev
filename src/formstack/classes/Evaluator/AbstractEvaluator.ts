import { transformers } from "../../transformers";
import { TFsFieldAny, TFsFieldType } from "../../type.field";
import type {
  TUiEvaluationObject,
  TStatusMessageSeverity,
  TStatusRecord,
} from "./type";
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

  get isRequired(): boolean {
    const { required } = this.fieldJson;
    return required === "1" || required === true;
  }

  abstract parseValues<S = string, T = string>(submissionDatum?: S): T;

  abstract isCorrectType<T>(submissionDatum: T): boolean;

  /**
   * attempts to find any issues with form/field setup
   */
  findKnownSetupIssues(): TStatusRecord[] {
    const nonVisibleTypes = ["section", "richtext", "embed"];
    const messages: TStatusRecord[] = [];

    messages.push(
      this.wrapAsStatusMessage(
        "debug",
        `fieldId: ${this._fieldJson.id}, type: ${
          this.fieldType
        }, json: ${transformers.Utility.jsObjectToHtmlFriendlyString(
          this.fieldJson
        )}`,
        [],
        this.fieldId
      )
    );

    if (nonVisibleTypes.includes(this.fieldType)) {
      return [];
    }

    if (!this._fieldJson.label) {
      messages.push(
        this.wrapAsStatusMessage(
          "warn",
          `No label for type: '${this.fieldType}', fieldId: '${this.fieldId}'.`,
          [],
          this.fieldId
        )
      );
    }

    if (this._fieldJson.label !== this._fieldJson.label.trim()) {
      messages.push(
        this.wrapAsStatusMessage(
          "warn",
          `White spaced detected at start or end. Label: "${this._fieldJson.label}".`,
          [],
          this.fieldId
        )
      );
    }

    return messages;
  }

  protected getStoredValue<T = string>(submissionDatum?: T): T {
    if (this.isRequired && submissionDatum === undefined) {
      return "__EMPTY_AND_REQUIRED__" as T;
    }

    if (!this.isRequired && submissionDatum === undefined) {
      return "__NO_SUBMISSION_DATA__" as T;
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

  protected getUiPopulateObjectsEmptyAndRequired(
    statusMessages: TStatusRecord[]
  ): TUiEvaluationObject[] {
    statusMessages.push(this.getStatusMessageEmptyAndRequired());
    return [this.wrapAsUiObject(null, "", statusMessages)];
  }

  protected wrapAsStatusMessage(
    severity: TStatusMessageSeverity,
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
