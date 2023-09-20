import { TStatusRecord } from "../../../chrome-extension/type";
import { TFsFieldAny, TFsSelectOption } from "../../type.field";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { TSimpleDictionary, TUiEvaluationObject } from "./type";
import { isFunctions } from "../../../common/isFunctions";
import { AbstractComplexSubmissionDatumEvaluator } from "./AbstractComplexSubmissionDatumEvaluator";

abstract class AbstractSelectOptionEvaluator extends AbstractComplexSubmissionDatumEvaluator {
  #fieldSelectOptions: TFsSelectOption[];

  constructor(fieldJson: TFsFieldAny) {
    super(fieldJson);
    this.#fieldSelectOptions = (fieldJson.options || []) as TFsSelectOption[];
  }

  protected getSelectOptions() {
    return this.#fieldSelectOptions;
  }

  evaluateWithValues<S = string, T = string>(value: S): T {
    const foundOption = this.getSelectOptions().find(
      (option) => option.value === value
    ) || { value: undefined };

    return foundOption.value as T;
  }

  getUiidFieldIdMap() {
    return this.getSelectOptions().reduce((prev, cur, i, a) => {
      prev[cur.value] = `field${this.fieldId}_${i + 1}`;
      return prev;
    }, {} as TSimpleDictionary<string>);
  }

  protected invalidSelectedOptionMessage(selectedOption: string): string {
    return `Failed to find valid option: '${selectedOption}' within valid options: '${this.validOptionAsPrintableString()}'.`;
  }

  private validOptionAsPrintableString(): string {
    return this.getSelectOptions()
      .map((x) => x.value)
      .join("', '");
  }

  abstract getUiPopulateObjects<T = string>(
    submissionDatum?: T
  ): TUiEvaluationObject[];
}

export { AbstractSelectOptionEvaluator };