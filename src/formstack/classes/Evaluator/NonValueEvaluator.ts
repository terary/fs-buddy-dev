import { AbstractEvaluator } from "./AbstractEvaluator";
import { TFlatSubmissionValues, TUiEvaluationObject } from "./type";

class NonValueEvaluator extends AbstractEvaluator {
  // the overload may cause issues,  since it's original writing the definition
  // was changed to use generics
  evaluateWithValues<S = string, T = string>(values: S): T;
  evaluateWithValues(
    values: string //
  ): null {
    return null;
  }

  getUiPopulateObjects<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
    return [
      this.wrapAsUiObject(null, "", [
        this.wrapAsStatusMessage(
          "debug",
          'Sections may have statusMessages but they will never get "parsed".'
        ),
      ]),
    ];
  }

  isCorrectType<T>(submissionDatum: T): boolean {
    return true; // may want to check that submissionData is empty
  }

  parseValues<S = string, T = string>(submissionDatum?: S): T {
    return submissionDatum as T;
  }
}

export { NonValueEvaluator };
