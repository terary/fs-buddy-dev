import {
  TEvaluateRequest,
  TEvaluateResponse,
  TUiEvaluationObject,
} from "./type";

interface IEValuator {
  evaluateWithValues<T>(values: TEvaluateRequest): TEvaluateResponse<T>;
  getUiPopulateObject(values: TEvaluateRequest): TUiEvaluationObject[];
}

export { IEValuator };
