import { InvalidEvaluation } from "../InvalidEvaluation";

type TUiEvaluationObject = {
  uiid: string;
  fieldId: string;
  fieldType: string; // known type/string
  value: string;
  statusMessages: any[];
};

type TEvaluateRequest = { [fieldId: string]: any };
type TEvaluateResponse<T> = { [fieldId: string]: T | InvalidEvaluation };

export type { TEvaluateRequest, TEvaluateResponse, TUiEvaluationObject };
