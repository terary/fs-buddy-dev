import { InvalidEvaluation } from "../InvalidEvaluation";

type TEvaluateRequest = { [fieldId: string]: any };
type TEvaluateResponse<T> = { [fieldId: string]: T | InvalidEvaluation };

export { TEvaluateRequest, TEvaluateResponse };
