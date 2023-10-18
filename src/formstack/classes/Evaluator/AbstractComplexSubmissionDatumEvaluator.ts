import { AbstractEvaluator } from "./AbstractEvaluator";
import { TStatusRecord, TUiEvaluationObject } from "./type";

import { isFunctions } from "../../../common/isFunctions";
import type { TSimpleDictionary } from "./type";
type TComplexDatumField = TSimpleDictionary<string>;

abstract class AbstractComplexSubmissionDatumEvaluator extends AbstractEvaluator {
  evaluateWithValues<S = string, T = string>(values: S): T {
    return this.parseValues(values);
  }

  parseValues<S = string, T = string>(submissionDatum?: S): T;
  parseValues(submissionDatum?: string): TComplexDatumField {
    return this.transformSubmittedDatumToObject(submissionDatum as string);
  }
  public isCorrectType<T>(submissionDatum: T): boolean;
  isCorrectType<T>(submissionDatum: T): boolean {
    const parseSubmittedData = this.parseValues(submissionDatum);

    // should we check if all keys are valid?
    return (
      typeof parseSubmittedData === "object" &&
      parseSubmittedData !== null &&
      Object.keys(parseSubmittedData).length > 0
    );
  }

  abstract getUiPopulateObjects<T = string>(
    submissionDatum?: T
  ): TUiEvaluationObject[];

  protected parseSubmittedData(
    submissionDatum?: string
  ): TSimpleDictionary<string> {
    if (!submissionDatum) {
      return {};
    }

    if (!isFunctions.isString(submissionDatum)) {
      return {};
    }

    if (!submissionDatum.match("\n")) {
      return {};
    }

    const records = submissionDatum.split("\n");
    return records.reduce((prev, cur, i, a) => {
      const [subfieldIdRaw, valueRaw] = cur.split("=");
      const subfieldId = (subfieldIdRaw || "").trim();
      const value = (valueRaw || "").trim();
      if (subfieldId !== "" || value !== "") {
        prev[subfieldId] = value;
      }

      return prev;
    }, {} as TSimpleDictionary<string>);
  }

  protected transformSubmittedDatumToObject(
    submissionDatum?: string
  ): TComplexDatumField {
    if (!submissionDatum) {
      return {};
    }

    if (!isFunctions.isString(submissionDatum)) {
      return {};
    }

    const records = submissionDatum.split("\n");
    return records.reduce((prev, cur, i, a) => {
      const [subfieldIdRaw, valueRaw] = cur.split("=");
      const subfieldId = (subfieldIdRaw || "").trim();
      const value = (valueRaw || "").trim();
      if (subfieldId !== "" || value !== "") {
        prev[subfieldId] = value;
      }

      return prev;
    }, {} as TComplexDatumField);
  }

  protected createStatusMessageArrayWithStoredValue<T>(
    submissionDatum?: T | undefined
  ): TStatusRecord[] {
    let message = "";
    if (isFunctions.isString(submissionDatum)) {
      message = `Stored value: '${((submissionDatum as string) || "").replace(
        /\n/g,
        "\\n"
      )}'.`;
    } else if (submissionDatum === undefined) {
      message = `Stored value: '${super.getStoredValue<string>(
        submissionDatum as string
      )}'.`;
    } else {
      message = `Stored value: '${JSON.stringify(submissionDatum)}'.`;
    }

    return [
      {
        severity: "info",
        fieldId: this.fieldId,
        message,
        relatedFieldIds: [],
      },
    ];
  }
}

export { AbstractComplexSubmissionDatumEvaluator };
