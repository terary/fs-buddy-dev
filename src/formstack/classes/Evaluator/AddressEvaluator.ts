import { AbstractSubfieldEvaluator } from "./AbstractSubfieldEvaluator";

class AddressEvaluator extends AbstractSubfieldEvaluator {
  private _supportedSubfieldIds = [
    "address",
    "address2",
    "city",
    "state",
    "zip",
    "country",
  ];

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

export { AddressEvaluator };
