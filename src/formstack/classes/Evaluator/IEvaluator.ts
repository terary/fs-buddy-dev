import { TFlatSubmissionValues, TUiEvaluationObject } from "./type";

// *tmc* -  I am not sure this is being used
interface IEValuator {
  evaluateWithValues<S = string, T = string>(values: S): T;

  // evaluateWithValues<T>(
  //   values: TFlatSubmissionValues<T>
  // ): TFlatSubmissionValues<T>;
  // getUiPopulateObject<T>(
  //   values: TFlatSubmissionValues<T>
  // ): TUiEvaluationObject[];
  getUiPopulateObject<T = string>(submissionDatum?: T): TUiEvaluationObject[];
}

export { IEValuator };
