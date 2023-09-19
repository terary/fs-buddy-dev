import { TFsFieldAny } from "../../type.field";
import { ScalarEvaluator } from "./ScalarEvaluator";

describe("ScalarEvaluator", () => {
  describe(".evaluateWithValues(...)", () => {
    it("Should parse submittedData", () => {
      //
      const evaluator = new ScalarEvaluator(fieldJsonTextArea);
      const actual = evaluator.evaluateWithValues("Just some plain text.");
      expect(actual).toStrictEqual("Just some plain text.");
    });
  });
  describe(".getUiPopulateObjects(...)", () => {
    it("Should return array of TUiEvaluationObject object when there is submission data.(ideal)", () => {
      const testValue = "Anything will do";
      const evaluator = new ScalarEvaluator(fieldJsonText);
      const actual = evaluator.getUiPopulateObjects(testValue);
      expect(actual).toStrictEqual([
        {
          uiid: "field147738154",
          fieldId: "147738154",
          fieldType: "text",
          value: "Anything will do",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738154",
              message: "Stored value: 'Anything will do'.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should return TUiEvaluationObject[], including status message for empty (undefined) submission data.", () => {
      const evaluator = new ScalarEvaluator(fieldJsonText);
      const actual = evaluator.getUiPopulateObjects(undefined);
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738154",
          fieldType: "text",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738154",
              message: "Stored value: '__NO_SUBMISSION_DATA__'.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should return TUiEvaluationObject[], including status message for empty and require submission data.", () => {
      const fieldJsonTextRequired = { ...fieldJsonText, ...{ required: "1" } };
      const evaluator = new ScalarEvaluator(fieldJsonTextRequired);
      const actual = evaluator.getUiPopulateObjects(undefined);
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738154",
          fieldType: "text",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738154",
              message: "Stored value: '__EMPTY_AND_REQUIRED__'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738154",
              message:
                "Submission data missing and required.  This is not an issue if the field is hidden by logic.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should return TUiEvaluationObject[], including status message corrupt/broken submission data.", () => {
      const evaluator = new ScalarEvaluator(fieldJsonText);
      const actual = evaluator.getUiPopulateObjects({});
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738154",
          fieldType: "text",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738154",
              message: "Stored value: '[object Object]'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738154",
              message: "_BAD_DATA_TYPE_' type: 'object', value: '{}'",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
  });
});

const fieldJsonTextArea = {
  id: "147738155",
  label: "Long Answer",
  hide_label: "0",
  description: "",
  name: "long_answer",
  type: "textarea",
  options: "",
  required: "0",
  uniq: "0",
  hidden: "0",
  readonly: "0",
  colspan: "1",
  sort: "4",
  logic: null,
  calculation: "",
  workflow_access: "write",
  default: "",
  rows: 10,
  cols: 50,
  minlength: 0,
  maxlength: 0,
  placeholder: "",
} as unknown as TFsFieldAny;

const fieldJsonText = {
  id: "147738154",
  label: "Short Answer Hidden",
  hide_label: "0",
  description: "",
  name: "short_answer_hidden",
  type: "text",
  options: "",
  required: "0",
  uniq: "0",
  hidden: "0",
  readonly: "0",
  colspan: "1",
  sort: "1",
  logic: {
    action: "show",
    conditional: "all",
    checks: [
      { field: 148111228, condition: "equals", option: "Show" },
      { field: 148111228, condition: "equals", option: "Hidden" },
    ],
  },
  calculation: "",
  workflow_access: "write",
  default: "",
  text_size: 50,
  minlength: 0,
  maxlength: 0,
  placeholder: "",
  field_one_calculation: 0,
  field_two_calculation: 0,
  calculation_units: "",
  calculation_operator: "",
  calculation_type: "",
  calculation_allow_negatives: 0,
  hide_input_characters: 0,
  remove_data_from_emails: 0,
  require_confirmation: 0,
  confirmationText: "",
  restrict_data_access: 0,
} as unknown as TFsFieldAny;
