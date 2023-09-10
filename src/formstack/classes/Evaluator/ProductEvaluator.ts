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

  getUiPopulateObject<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
    // getUiPopulateObject(values: TFlatSubmissionValues): TUiEvaluationObject[] {
    const statusMessages: TStatusRecord[] = [
      {
        severity: "info",
        fieldId: this.fieldId,
        message: `Stored value: '${this.getStoredValue(submissionDatum)}'.`,
        relatedFieldIds: [],
      },
    ];

    const parsedValues = this.parseValues<string>(submissionDatum as string);

    if (parsedValues === undefined) {
      statusMessages.push({
        severity: "error",
        message: "Failed to parse field. ",
        relatedFieldIds: [],
      });
    }
    const parsedValuesObject = Array.isArray(parsedValues)
      ? (parsedValues as unknown as any[]).reduce((prev, cur, i, a) => {
          prev[cur.subfieldId] = cur.value;
          // I *think* it should be {...prev, ...cur}
          return prev;
        }, {})
      : {};
    // need to make sure this is being transformed
    // @ts-ignore - this is expected 'required' to be boolean, which happens only if this json has been transformed
    if (
      // @ts-ignore
      (this.fieldJson.required || this.fieldJson.required === "1") &&
      parsedValues === ""
    ) {
      statusMessages.push({
        severity: "info",
        fieldId: this.fieldId,
        message:
          "Field value appears empty but field is required. (if this field is eventually hidden by logic, then empty value is not significant.)",
      });
    }

    return [
      {
        uiid: `field${this.fieldId}`,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: parsedValuesObject["quantity"] as string,
        statusMessages,
      },
    ];
  }
}

export { ProductEvaluator };
