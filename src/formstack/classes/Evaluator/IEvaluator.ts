import { TEvaluateRequest, TEvaluateResponse } from "./type";

interface IEValuator {
  evaluateWithValues<T>(values: TEvaluateRequest): TEvaluateResponse<T>;
}

export { IEValuator };
