import { TFlatSubmissionValues, TUiEvaluationObject } from "./type";

// *tmc* -  I am not sure this is being used
interface IEValuator {
  evaluateWithValues<S = string, T = string>(values: S): T;

  // evaluateWithValues<T>(
  //   values: TFlatSubmissionValues<T>
  // ): TFlatSubmissionValues<T>;
  // getUiPopulateObjects<T>(
  //   values: TFlatSubmissionValues<T>
  // ): TUiEvaluationObject[];
  getUiPopulateObjects<T = string>(submissionDatum?: T): TUiEvaluationObject[];
}

export { IEValuator };
