import { AbstractEvaluator } from "./AbstractEvaluator";
import { TUiEvaluationObject } from "./type";

class NonValueEvaluator extends AbstractEvaluator {
  evaluateWithValues<S = string, T = string>(values: S): T;
  evaluateWithValues(values: string): null {
    return null;
  }

  getUiPopulateObjects<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
    return [
      this.wrapAsUiObject(null, "", [
        this.wrapAsStatusMessage(
          "debug",
          'Sections may have statusMessages but they will never get "parsed".'
        ),
        this.wrapAsStatusMessage(
          "info",
          `non-printable type: '${this.fieldType}'.`
        ),
      ]),
    ];
  }

  isCorrectType<T>(submissionDatum: T): boolean {
    return true;
  }

  parseValues<S = string, T = string>(submissionDatum?: S): T {
    return submissionDatum as T;
  }
}

export { NonValueEvaluator };
