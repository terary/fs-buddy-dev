import { TStatusRecord } from "../../../chrome-extension/type";
import { TFsFieldAddress } from "../../type.field";
import { InvalidEvaluation } from "../InvalidEvaluation";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { AbstractSubfieldEvaluator } from "./AbstractSubfieldEvaluator";
import {
  TEvaluateRequest,
  TEvaluateResponse,
  TUiEvaluationObject,
} from "./type";

class ProductEvaluator extends AbstractSubfieldEvaluator {
  //    //     "value": "charge_type = fixed_amount\nquantity = 7\nunit_price = 3.99\ntotal = 27.93"

  private _supportedSubfieldIds = [
    "charge_type",
    "quantity",
    "unit_price",
    "total",
  ];

  get supportedSubfieldIds() {
    return this._supportedSubfieldIds;
  }

  getUiPopulateObject(values: TEvaluateRequest): TUiEvaluationObject[] {
    console.log("Product getUiPopulateObject");
    const statusMessages: TStatusRecord[] = [];

    const parsedValues = this.parseValues<string>(values);

    if (parsedValues[this.fieldId] instanceof InvalidEvaluation) {
      statusMessages.push({
        severity: "error",
        message: "Failed to parse field. " + parsedValues.message,
        relatedFieldIds: [],
      });
    }
    const parsedValuesObject = Array.isArray(parsedValues[this.fieldId])
      ? (parsedValues[this.fieldId] as unknown as any[]).reduce(
          (prev, cur, i, a) => {
            prev[cur.subfieldId] = cur.value;
            // I *think* it should be {...prev, ...cur}
            return prev;
          },
          {}
        )
      : {};
    // need to make sure this is being transformed
    // @ts-ignore - this is expected 'required' to be boolean, which happens only if this json has been transformed
    if (
      // @ts-ignore
      (this.fieldJson.required || this.fieldJson.required === "1") &&
      parsedValues[this.fieldId] === ""
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
