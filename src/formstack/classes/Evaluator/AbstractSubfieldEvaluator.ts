import { TFsFieldAddress } from "../../type.field";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { TEvaluateRequest, TEvaluateResponse } from "./type";

abstract class AbstractSubfieldEvaluator extends AbstractEvaluator {
  abstract get supportedSubfieldIds(): string[];

  parseValues<T>(values: TEvaluateRequest): TEvaluateResponse<T> {
    const s2 = this.parseSubmittedData(values);
    return { [this.fieldId]: s2 as T };
  }

  private parseSubmittedData(values: TEvaluateRequest) {
    const submissionData = values[this.fieldId] || [];
    if (!submissionData) {
      return null;
    }
    const records = submissionData.split("\n");

    return records.map((field: string) => {
      const [subfieldIdRaw, valueRaw] = field.split("=");
      const subfieldId = (subfieldIdRaw || "").trim();
      const value = (valueRaw || "").trim();

      return {
        subfieldId,
        value,
      };
    }) as [{ subfieldId: string; value: string }];
  }

  evaluateWithValues<T>(values: TEvaluateRequest): TEvaluateResponse<T> {
    const s1 = this.parseSubmittedData(values);
    const s2 =
      Array.isArray(s1) &&
      s1.reduce((prev, cur, i, a) => {
        if (this.supportedSubfieldIds.includes(cur.subfieldId)) {
          prev[cur.subfieldId] = cur.value;
        }
        return prev;
      }, {} as { [subfieldId: string]: string });

    // return s2;

    return { [this.fieldId]: s2 as T };
  }
}

export { AbstractSubfieldEvaluator };
