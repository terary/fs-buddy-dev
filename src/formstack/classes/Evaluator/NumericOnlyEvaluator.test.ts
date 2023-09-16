import { TFsFieldAny } from "../../type.field";
// import { InvalidEvaluation } from "../InvalidEvaluation";
import { NumericOnlyEvaluator } from "./NumericOnlyEvaluator";

describe("NumericOnlyEvaluator", () => {
  describe(".evaluateWithValues(...)", () => {
    it("Should parse submittedData, return the same type and value as passed-in data.", () => {
      //
      const evaluator = new NumericOnlyEvaluator(fieldJson);
      const actualString = evaluator.evaluateWithValues(submissionData.value);
      const actualNumber = evaluator.evaluateWithValues(3);

      expect(actualString).toStrictEqual("1");
      expect(actualString).not.toStrictEqual(1);
      expect(actualNumber).toStrictEqual(3);
      expect(actualNumber).not.toStrictEqual("3");
    });
  });
  describe(".getUiPopulateObjects(...)", () => {
    it("Should return array of properly formatted UI instructions (shape of TUiEvaluationObject).", () => {
      const testValue = "1";
      const evaluator = new NumericOnlyEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects(testValue);
      expect(actual).toStrictEqual([
        {
          uiid: "field147738160",
          fieldId: "147738160",
          fieldType: "number",
          value: "1",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738160",
              message: "Stored value: '1'.",
              relatedFieldIds: [],
            },
          ],
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
