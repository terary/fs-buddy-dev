import { InvalidEvaluation } from "../InvalidEvaluation";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { TEvaluateRequest, TEvaluateResponse } from "./type";
const isNumericLoosely = (value: any) => {
  return Number(value) == value;
};

class NumericOnlyEvaluator extends AbstractEvaluator {
  evaluateWithValues<T>(values: TEvaluateRequest): TEvaluateResponse<T> {
    // const thisValue = values[this.fieldId];
    // if (!thisValue || !("replace" in thisValue)) {
    //   return {
    //     [this.fieldId]: new InvalidEvaluation(
    //       `Could not convert to number: '${values[this.fieldId]}', fieldId: ${
    //         this.fieldId
    //       }.`
    //     ),
    //   };
    // }

    // const validChars = values[this.fieldId].replace(/\D/g, "");

    // if (validChars == values[this.fieldId]) {
    //   return { [this.fieldId]: values[this.fieldId] };
    // }

    if (isNumericLoosely(values[this.fieldId])) {
      return { [this.fieldId]: values[this.fieldId] };
    }

    return {
      [this.fieldId]: new InvalidEvaluation(
        `Could not convert to number: '${values[this.fieldId]}', fieldId: ${
          this.fieldId
        }.`
      ),
    };

    // const testValue = parseFloat(values[this.fieldId] + "");

    // if (isNumber(testValue)) {
    //   return { [this.fieldId]: values[this.fieldId] as T };
    // } else {
    //   return {
    //     [this.fieldId]: new InvalidEvaluation(
    //       `Could not convert to number: '${values[this.fieldId]}', fieldId: ${
    //         this.fieldId
    //       }.`
    //     ),
    //   };
    // }
  }
}

// const isNumber = (value: any) => {
//   return typeof value === "number" && isFinite(value);
// };

export { NumericOnlyEvaluator };
