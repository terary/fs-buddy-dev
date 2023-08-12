import { TEvaluateRequest, TEvaluateResponse } from "./type";

type UiEvaluationObject = {
  uiid: string;
  fieldId: string;
  fieldType: string; // known type/string
  value: string;
  statusMessages: any[];
};

interface IEValuator {
  evaluateWithValues<T>(values: TEvaluateRequest): TEvaluateResponse<T>;
  getUiPopulateObject(values: TEvaluateRequest): UiEvaluationObject;
}

export { IEValuator };
