import { TFlatSubmissionValues, TUiEvaluationObject } from "./type";

// *tmc* -  I am not sure this is being used
interface IEValuator {
  evaluateWithValues<T>(
    values: TFlatSubmissionValues<T>
  ): TFlatSubmissionValues<T>;
  getUiPopulateObject<T>(
    values: TFlatSubmissionValues<T>
  ): TUiEvaluationObject[];
}

export { IEValuator };
