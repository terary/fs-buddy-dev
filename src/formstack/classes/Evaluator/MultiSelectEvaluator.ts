import {
  TFsFieldCheckbox,
  TFsFieldRadio,
  TFsFieldSelect,
} from "../../type.field";
import { InvalidEvaluation } from "../InvalidEvaluation";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { TEvaluateRequest, TEvaluateResponse } from "./type";

type TSelectFields = TFsFieldRadio | TFsFieldSelect | TFsFieldCheckbox;

class MultiSelectEvaluator extends AbstractEvaluator {
  parseValues<T>(values: TEvaluateRequest): TEvaluateResponse<T> {
    const options = (this.fieldJson as TSelectFields).options || [];
    const selectedOption = options.find(
      (option) => option.value === values[this.fieldId]
    );

    return { [this.fieldId]: selectedOption?.value as T };
  }

  evaluateWithValues<T>(values: TEvaluateRequest): TEvaluateResponse<T> {
    const selectedOption = this.parseValues(values)[this.fieldId];
    if (selectedOption === undefined) {
      return {
        [this.fieldId]: new InvalidEvaluation("Selected option not found.", {
          options: (this.fieldJson as TSelectFields).options || [],
          searchValue: values[this.fieldId],
        }),
      };
    } else {
      return { [this.fieldId]: selectedOption as T };
    }
  }

  private evaluateMultiSelect<T>(
    values: TEvaluateRequest
  ): TEvaluateResponse<T> {
    const options = (this.fieldJson as TSelectFields).options || [];
    const selectedOption = options.find(
      (option) => option.value === values[this.fieldId]
    );

    if (selectedOption === undefined) {
      return {
        [this.fieldId]: new InvalidEvaluation("Selected option not found.", {
          options,
          searchValue: values[this.fieldId],
        }),
      };
    } else {
      return { [this.fieldId]: selectedOption.value as T };
    }
  }
}

export { MultiSelectEvaluator };
