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
}
export { AbstractEvaluator };
