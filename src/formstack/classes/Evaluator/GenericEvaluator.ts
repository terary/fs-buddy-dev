import { AbstractEvaluator } from "./AbstractEvaluator";

class GenericEvaluator extends AbstractEvaluator {
  parseValues<S = string, T = string>(submissionDatum?: S): T {
    // parseValues<T>(values: TFlatSubmissionValues): TFlatSubmissionValues<T> {
    return submissionDatum as T;
  }
  evaluateWithValues<S = string, T = string>(values: S): T {
    return this.parseValues(values);
    // const s2 = this.parseValues(values);
    // return { [this.fieldId]: s2 as T };
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

  // evaluateWithValues<T>(
  //   values: TFlatSubmissionValues
  // ): TFlatSubmissionValues<T> {
  //   return this.parseValues(values);
  // }
}

export { GenericEvaluator };
