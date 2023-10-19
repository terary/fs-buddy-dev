import { TStatusRecord, TUiEvaluationObject } from "./type";

interface IEValuator {
  evaluateWithValues<S = string, T = string>(values: S): T;
  getUiPopulateObjects<T = string>(submissionDatum?: T): TUiEvaluationObject[];
  getJsMatcherExpression(): string;
  /**
   * attempts to find any issues with form/field setup
   */
  findKnownSetupIssues(): TStatusRecord[];
}

export { IEValuator };
