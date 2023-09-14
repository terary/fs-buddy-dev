import { AbstractEvaluator } from "./AbstractEvaluator";
import { TFlatSubmissionValues, TUiEvaluationObject } from "./type";

class NonValueEvaluator extends AbstractEvaluator {
  parseValues<S = string, T = string>(submissionDatum?: S): T {
    // parseValues<T>(values: TFlatSubmissionValues): TFlatSubmissionValues<T> {
    return submissionDatum as T;
  }

  // the overload may cause issues,  since it's original writing the definition
  // was changed to use generics
  evaluateWithValues<S = string, T = string>(values: S): T;
  evaluateWithValues(
    values: string //
  ): null {
    return null;
  }

  isCorrectType<T>(submissionDatum: T): boolean {
    return true; // may want to check that submissionData is empty
  }

  getUiPopulateObjects<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
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
