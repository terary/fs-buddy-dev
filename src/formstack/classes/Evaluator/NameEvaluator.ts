import { TFsFieldAddress } from "../../type.field";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { AbstractSubfieldEvaluator } from "./AbstractSubfieldEvaluator";

class NameEvaluator extends AbstractSubfieldEvaluator {
  private _supportedSubfieldIds = [
    "first",
    "last",
    "initial",
    "prefix",
    "suffix",
    "middle",
  ];

  evaluateWithValues<S = string, T = string>(values: S): T {
    return this.parseValues(values);
    // const s2 = this.parseValues(values);
    // return { [this.fieldId]: s2 as T };
  }

  isCorrectType<T>(submissionDatum: T): boolean {
    const parseSubmittedData = this.parseValues(submissionDatum);

    // should we check if all keys are valid?
    return (
      typeof parseSubmittedData === "object" &&
      parseSubmittedData !== null &&
      Object.keys(parseSubmittedData).length > 0
    );
  }

  get supportedSubfieldIds() {
    return this._supportedSubfieldIds;
  }
}

export { NameEvaluator };
