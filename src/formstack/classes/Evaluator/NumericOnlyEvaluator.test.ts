import { TFsFieldAny } from "../../type.field";
import { InvalidEvaluation } from "../InvalidEvaluation";
import { NumericOnlyEvaluator } from "./NumericOnlyEvaluator";

describe("NumericOnlyEvaluator", () => {
  describe(".evaluateWithValues(...)", () => {
    it("Should parse submittedData, return the same type and value as passed-in data.", () => {
      //
      const evaluator = new NumericOnlyEvaluator(fieldJson);
      const actualString = evaluator.evaluateWithValues({
        [submissionData.field]: submissionData.value,
      });
      const actualNumber = evaluator.evaluateWithValues({
        [submissionData.field]: 3,
      });

      expect(actualString).toStrictEqual({
        "147738160": "1",
      });
      expect(actualString).not.toStrictEqual({
        "147738160": 1,
      });
      expect(actualNumber).toStrictEqual({
        "147738160": 3,
      });
      expect(actualNumber).not.toStrictEqual({
        "147738160": "3",
      });
    });
    it("Should return InvalidEvaluation for something that does not look like a number.", () => {
      //
      const evaluator = new NumericOnlyEvaluator(fieldJson);
      const testValue = "Something that is not a number";
      const actual = evaluator.evaluateWithValues({
        [submissionData.field]: testValue,
      });
      expect(actual[submissionData.field]).toBeInstanceOf(InvalidEvaluation);
      const actualEvaluation = actual[
        submissionData.field
      ] as InvalidEvaluation;
      expect(actualEvaluation.message).toStrictEqual(
        "Could not convert to number: 'Something that is not a number', fieldId: 147738160."
      );
      expect(actualEvaluation.payload).toBeUndefined();
    });
  });
  describe(".getUiPopulateObject(...)", () => {
    it("Should return array of properly formatted UI instructions (shape of TUiEvaluationObject).", () => {
      const testValue = "1";
      const evaluator = new NumericOnlyEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObject({
        [submissionData.field]: testValue,
      });
      expect(actual).toStrictEqual([
        {
          uiid: "field147738160",
          fieldId: "147738160",
          fieldType: "number",
          value: "1",
          statusMessages: [],
        },
      ]);
    });
  });
});
const submissionData = {
  field: "147738160",
  value: "1",
};
const fieldJson = {
  id: "147738160",
  label: "Number",
  hide_label: "0",
  description: "",
  name: "number",
  type: "number",
  options: "",
  required: "0",
  uniq: "0",
  hidden: "0",
  readonly: "0",
  colspan: "1",
  sort: "9",
  logic: null,
  calculation: "",
  workflow_access: "write",
  default: "",
  field_one_calculation: 0,
  field_two_calculation: 0,
  calculation_units: "",
  calculation_operator: "",
  calculation_type: "",
  calculation_category: "",
  calculation_allow_negatives: 0,
  text_size: 5,
  min_value: "",
  max_value: "",
  currency: "",
  decimals: "0",
  slider: "0",
  placeholder: "",
} as unknown as TFsFieldAny;
