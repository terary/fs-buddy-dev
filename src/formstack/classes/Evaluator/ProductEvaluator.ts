import { NamedSubfieldEvaluator } from "./NamedSubfieldEvaluator";
import { TUiEvaluationObject } from "./type";

type ProductRecordType = {
  charge_type: string;
  quantity?: string | number;
  unit_price: string | number;
  total: string | number;
};

class ProductEvaluator extends NamedSubfieldEvaluator {
  protected _supportedSubfieldIds = [
    "charge_type",
    "quantity",
    "unit_price",
    "total",
  ];

  getUiPopulateObjects<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
    const statusMessages =
      this.createStatusMessageArrayWithStoredValue(submissionDatum);

    if (!submissionDatum) {
      statusMessages.push(
        this.wrapAsStatusMessage(
          "warn",
          `Failed to parse field. Product did not parse correctly. submissionDatum: '${submissionDatum}'.`
        )
      );

      if (this.isRequired) {
        return this.getUiPopulateObjectsEmptyAndRequired(statusMessages);
      }
      return [this.wrapAsUiObject(null, "", statusMessages)];
    }
    if (!this.isCorrectType(submissionDatum)) {
      const message =
        `_BAD_DATA_TYPE_' type: '${typeof submissionDatum}', value: '` +
        JSON.stringify(submissionDatum).slice(0, 100) +
        "'";

      statusMessages.push(this.wrapAsStatusMessage("warn", message));
      return [this.wrapAsUiObject(null, "", statusMessages)];
    }

    const parsedValues = this.parseValues<string, ProductRecordType>(
      submissionDatum as string
    );

    if (parsedValues === undefined) {
      statusMessages.push(
        this.wrapAsStatusMessage("error", "Failed to parse field. ")
      );
    }

    const uiFieldValue =
      "quantity" in parsedValues ? parsedValues.quantity + "" : "_UNDEFINED_";

    return [
      this.wrapAsUiObject(`field${this.fieldId}`, uiFieldValue, statusMessages),
    ];
  }
}

export { ProductEvaluator };
