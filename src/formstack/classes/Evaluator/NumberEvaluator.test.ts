import { TFsFieldAny } from "../../type.field";
import { NumberEvaluator } from "./NumberEvaluator";

describe("NumberEvaluator", () => {
  describe(".evaluateWithValues(...)", () => {
    it.skip("Should parse submittedData", () => {
      //
      const evaluator = new NumberEvaluator(fieldJson);
      const actual = evaluator.evaluateWithValues("Just some plain text.");
      expect(actual).toStrictEqual("Just some plain text.");
    });
  });
  describe(".getUiPopulateObjects(...)", () => {
    it("Should return array of TUiEvaluationObject object when there is submission data.(ideal)", () => {
      const evaluator = new NumberEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects(101);
      expect(actual).toStrictEqual([
        {
          uiid: "field147738160",
          fieldId: "147738160",
          fieldType: "number",
          value: 101,
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738160",
              message: "Stored value: '101'.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should return TUiEvaluationObject[], including status message for empty (undefined) submission data.", () => {
      const evaluator = new NumberEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects(undefined);
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738160",
          fieldType: "number",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738160",
              message: "Stored value: '__NO_SUBMISSION_DATA__'.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should return TUiEvaluationObject[], including status message for empty and require submission data.", () => {
      const fieldJsonRequired = { ...fieldJson, ...{ required: "1" } };
      const evaluator = new NumberEvaluator(fieldJsonRequired);
      const actual = evaluator.getUiPopulateObjects(undefined);
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738160",
          fieldType: "number",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738160",
              message: "Stored value: '__EMPTY_AND_REQUIRED__'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738160",
              message:
                "Submission data missing and required.  This is not an issue if the field is hidden by logic.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should return TUiEvaluationObject[], including status message corrupt/broken submission data.", () => {
      const evaluator = new NumberEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects({});
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738160",
          fieldType: "number",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738160",
              message: "Stored value: '[object Object]'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738160",
              message: "_BAD_DATA_TYPE_' type: 'object', value: '{}'",
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
