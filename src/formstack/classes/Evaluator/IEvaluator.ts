import { TUiEvaluationObject } from "./type";

interface IEValuator {
  evaluateWithValues<S = string, T = string>(values: S): T;
  getUiPopulateObjects<T = string>(submissionDatum?: T): TUiEvaluationObject[];
}

export { IEValuator };
