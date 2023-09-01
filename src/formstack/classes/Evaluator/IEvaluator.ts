import {
  TFlatSubmissionValues,
  TFlatSubmissionValues,
  TUiEvaluationObject,
} from "./type";

interface IEValuator {
  evaluateWithValues<T>(values: TFlatSubmissionValues): TFlatSubmissionValues<T>;
  getUiPopulateObject(values: TFlatSubmissionValues): TUiEvaluationObject[];
}

export { IEValuator };
