import { isFunctions } from "../../../common/isFunctions";
import { ScalarEvaluator } from "./ScalarEvaluator";

class NumberEvaluator extends ScalarEvaluator {
  parseValues<S = string, T = string>(submissionDatum?: S): T;
  parseValues(submissionDatum?: string): number | undefined {
    return submissionDatum ? Number(submissionDatum) : undefined;
  }

  evaluateWithValues<S = string, T = string>(values: S): T {
    return this.parseValues(values);
  }

  isCorrectType<T>(submissionDatum: T): boolean {
    const parseSubmittedData = this.parseValues(submissionDatum);
    return isFunctions.isLooselyNumeric(parseSubmittedData);
  }
}

export { NumberEvaluator };
