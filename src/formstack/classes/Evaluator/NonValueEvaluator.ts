import { AbstractEvaluator } from "./AbstractEvaluator";
import {
  TFlatSubmissionValues,
  TFlatSubmissionValues,
  TUiEvaluationObject,
} from "./type";

class NonValueEvaluator extends AbstractEvaluator {
  parseValues<T>(values: TFlatSubmissionValues): TFlatSubmissionValues<T> {
    return { [this.fieldId]: values[this.fieldId] };
  }

  evaluateWithValues<T>(values: TFlatSubmissionValues): TFlatSubmissionValues<T>;
  evaluateWithValues(values: TFlatSubmissionValues): TFlatSubmissionValues<null> {
    return { [this.fieldId]: null };
  }

  getUiPopulateObject(values: TFlatSubmissionValues): TUiEvaluationObject[] {
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
