import { TStatusRecord } from "../../../chrome-extension/type";
// import { InvalidEvaluation } from "../InvalidEvaluation";
import { AbstractSubfieldEvaluator } from "./AbstractSubfieldEvaluator";
import { TFlatSubmissionValues, TUiEvaluationObject } from "./type";

class ProductEvaluator extends AbstractSubfieldEvaluator {
  //    //     "value": "charge_type = fixed_amount\nquantity = 7\nunit_price = 3.99\ntotal = 27.93"

  private _supportedSubfieldIds = [
    "charge_type",
    "quantity",
    "unit_price",
    "total",
  ];

  evaluateWithValues<S = string, T = string>(values: S): T {
    return this.parseValues(values);
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

  getUiPopulateObjects<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
    const statusMessages =
      this.createStatusMessageArrayWithStoredValue(submissionDatum);

    if ((this.isRequired && submissionDatum === "") || !submissionDatum) {
      return this.getUiPopulateObjectsEmptyAndRequired(statusMessages);
    }

    const parsedValues = this.parseValues<string>(submissionDatum as string);

    if (parsedValues === undefined) {
      statusMessages.push(
        this.wrapAsStatusMessage("error", "Failed to parse field. ")
      );
    }
    const parsedValuesObject = Array.isArray(parsedValues)
      ? (parsedValues as unknown as any[]).reduce((prev, cur, i, a) => {
          prev[cur.subfieldId] = cur.value;
          // I *think* it should be {...prev, ...cur}
          return prev;
        }, {})
      : {};

    return [
      this.wrapAsUiObject(
        `field${this.fieldId}`,
        parsedValuesObject["quantity"],
        statusMessages
      ),
    ];
  }
}

export { ProductEvaluator };