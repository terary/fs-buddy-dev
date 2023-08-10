import { TFsFieldAddress } from "../../type.field";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { AbstractSubfieldEvaluator } from "./AbstractSubfieldEvaluator";
import { TEvaluateRequest, TEvaluateResponse } from "./type";

class AddressEvaluator extends AbstractSubfieldEvaluator {
  private _supportedSubfieldIds = [
    "address",
    "address2",
    "city",
    "state",
    "zip",
    "country",
  ];

  get supportedSubfieldIds() {
    return this._supportedSubfieldIds;
  }

  // private parseSubmittedData(values: TEvaluateRequest) {
  //   const submissionData = values[this.fieldId] || [];
  //   if (!submissionData) {
  //     return null;
  //   }
  //   const records = submissionData.split("\n");

  //   const s1 = records.map((field: string) => {
  //     const [subfieldIdRaw, valueRaw] = field.split("=");
  //     const subfieldId = (subfieldIdRaw || "").trim();
  //     const value = (valueRaw || "").trim();

  //     return {
  //       subfieldId,
  //       value,
  //     };
  //   }) as [{ subfieldId: string; value: string }];

  //   const s2 = s1.reduce((prev, cur, i, a) => {
  //     if (this._supportedSubfieldIds.includes(cur.subfieldId)) {
  //       prev[cur.subfieldId] = cur.value;
  //     }
  //     return prev;
  //   }, {} as { [subfieldId: string]: string });

  //   return s2;
  // }

  // evaluateWithValues<T>(values: TEvaluateRequest): TEvaluateResponse<T> {
  //   const s2 = this.parseSubmittedData(values);
  //   return { [this.fieldId]: s2 as T };
  // }
}

export { AddressEvaluator };
