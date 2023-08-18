import { AbstractEvaluator } from "./AbstractEvaluator";
import {
  TEvaluateRequest,
  TEvaluateResponse,
  TUiEvaluationObject,
} from "./type";

class NonValueEvaluator extends AbstractEvaluator {
  parseValues<T>(values: TEvaluateRequest): TEvaluateResponse<T> {
    return { [this.fieldId]: values[this.fieldId] };
  }

  evaluateWithValues<T>(values: TEvaluateRequest): TEvaluateResponse<T>;
  evaluateWithValues(values: TEvaluateRequest): TEvaluateResponse<null> {
    return { [this.fieldId]: null };
  }

  getUiPopulateObject(values: TEvaluateRequest): TUiEvaluationObject[] {
    return [
      {
        uiid: null,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        statusMessages: [
          {
            severity: "debug",
            message:
              'Sections may have statusMessages but they will never get "parsed".',
            fieldId: "147738168",
            relatedFieldIds: [],
          },
        ],
      },
    ] as TUiEvaluationObject[];
  }
}

export { NonValueEvaluator };
