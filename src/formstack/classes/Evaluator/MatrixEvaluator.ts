import { TFsFieldAddress } from "../../type.field";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { TEvaluateRequest, TEvaluateResponse } from "./type";

class MatrixEvaluator extends AbstractEvaluator {
  private _supportedSubfieldIds = [
    "first",
    "last",
    "initial",
    "prefix",
    "suffix",
    "middle",
  ];

  get supportedSubfieldIds() {
    return this._supportedSubfieldIds;
  }

  private parseSubmittedData(values: TEvaluateRequest) {
    const submissionData = values[this.fieldId] || [];
    if (!submissionData) {
      return null;
    }
    const records = submissionData.split("\n");

    const s1 = records.map((field: string) => {
      const [subfieldIdRaw, valueRaw] = field.split("=");
      const subfieldId = (subfieldIdRaw || "").trim();
      const value = (valueRaw || "").trim();

      return {
        subfieldId,
        value,
      };
    }) as [{ subfieldId: string; value: string }];

    const s2 = s1.reduce((prev, cur, i, a) => {
      prev[cur.subfieldId] = cur.value;
      // if (this._supportedSubfieldIds.includes(cur.subfieldId)) {
      //   prev[cur.subfieldId] = cur.value;
      // }
      return prev;
    }, {} as { [subfieldId: string]: string });

    return s2;
  }

  evaluateWithValues<T>(values: TEvaluateRequest): TEvaluateResponse<T> {
    const s2 = this.parseSubmittedData(values);
    return { [this.fieldId]: s2 as T };
  }
}

export { MatrixEvaluator };
