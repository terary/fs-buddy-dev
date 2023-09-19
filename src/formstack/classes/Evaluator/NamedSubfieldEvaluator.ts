import { AbstractNamedSubfieldEvaluator } from "./AbstractNamedSubfieldEvaluator";

class NamedSubfieldEvaluator extends AbstractNamedSubfieldEvaluator {
  protected _supportedSubfieldIds: string[] = [];
  //   isCorrectType<T>(submissionDatum: T): boolean {
  //     const parseSubmittedData = this.parseValues(submissionDatum);

  //     // should we check if all keys are valid?
  //     return (
  //       typeof parseSubmittedData === "object" &&
  //       parseSubmittedData !== null &&
  //       Object.keys(parseSubmittedData).length > 0
  //     );
  //   }

  //   parseSubmittedData(datum: string) {
  //     if (!datum) {
  //       return null;
  //     }

  //     const records = datum.split("\n");

  //     const s1 = records.map((field: string) => {
  //       const [subfieldIdRaw, valueRaw] = field.split("=");
  //       const subfieldId = (subfieldIdRaw || "").trim();
  //       const value = (valueRaw || "").trim();

  //       return {
  //         subfieldId,
  //         value,
  //       };
  //     }) as [{ subfieldId: string; value: string }];

  //     const s2 = s1.reduce((prev, cur, i, a) => {
  //       if (this._supportedSubfieldIds.includes(cur.subfieldId)) {
  //         prev[cur.subfieldId] = cur.value;
  //       }
  //       return prev;
  //     }, {} as { [subfieldId: string]: string });

  //     return s2;
  //   }

  evaluateWithValues<S = string, T = string>(values: S): T {
    return this.parseSubmittedData(values as string) as T;
  }

  get supportedSubfieldIds() {
    return this._supportedSubfieldIds;
  }
}

export { NamedSubfieldEvaluator };
