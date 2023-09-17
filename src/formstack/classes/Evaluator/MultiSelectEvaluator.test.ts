import { TFsFieldAny } from "../../type.field";
import { MultiSelectEvaluator } from "./MultiSelectEvaluator";

describe("MultiSelectEvaluator", () => {
  describe("Single select controls (radio, dropdown)", () => {
    describe(".evaluateWithValues(...)", () => {
      it("Should parse submittedData, return the same type and value as passed-in data.", () => {
        //
        const evaluator = new MultiSelectEvaluator(fieldJsonDropdown);
        const actual = evaluator.evaluateWithValues(
          submissionDataDropdown.value
        );

        expect(actual).toStrictEqual("OPT03");
      });
    });
    describe(".getUiPopulateObjects(...)", () => {
      it("Should return array of properly formatted UI instructions (shape of TUiEvaluationObject).", () => {
        const evaluator = new MultiSelectEvaluator(fieldJsonDropdown);
        const actual = evaluator.getUiPopulateObjects(
          submissionDataDropdown.value
        );
        expect(actual).toStrictEqual([
          {
            uiid: "field147738162",
            fieldId: "147738162",
            fieldType: "select",
            value: "OPT03",
            statusMessages: [
              {
                severity: "info",
                fieldId: "147738162",
                message: "Stored value: 'OPT03'.",
                relatedFieldIds: [],
              },
            ],
          },
        ]);
      });
      it("Should return array of properly formatted UI instructions (radio).", () => {
        const testValue = "1";
        const evaluator = new MultiSelectEvaluator({
          ...fieldJsonDropdown,
          ...{ type: "radio" },
        });
        const actual = evaluator.getUiPopulateObjects(
          submissionDataDropdown.value
        );
        expect(actual).toStrictEqual([
          {
            uiid: "field147738162_3",
            fieldId: "147738162",
            fieldType: "radio",
            value: "OPT03",
            statusMessages: [],
          },
          {
            uiid: null,
            fieldId: "147738162",
            fieldType: "radio",
            value: "null",
            statusMessages: [
              {
                severity: "info",
                fieldId: "147738162",
                message: `Stored value: 'OPT03'.`,
                relatedFieldIds: [],
              },
            ],
          },
        ]);
      });
      it("Should include statusMessage when the parsedValue is not one of the available options.", () => {
        const testValue = "1";
        const evaluator = new MultiSelectEvaluator(fieldJsonDropdown);
        const actual = evaluator.getUiPopulateObjects("INVALID_OPTION");
        expect(actual).toStrictEqual([
          {
            uiid: null,
            fieldId: "147738162",
            fieldType: "select",
            value: "",
            statusMessages: [
              {
                severity: "info",
                fieldId: "147738162",
                message: "Stored value: 'INVALID_OPTION'.",
                relatedFieldIds: [],
              },
              {
                severity: "warn",
                fieldId: "147738162",
                message:
                  "Failed to find valid option: 'INVALID_OPTION' within valid options: 'OPT01', 'OPT02', 'OPT03'.",
                relatedFieldIds: [],
              },
            ],
          },
        ]);
      });
    });
  });
  describe("Multiple selectable options (checkbox)", () => {
    describe(".getUiPopulateObjects(...)", () => {
      it("Should return TUiEvaluationObject[] with statusMessage indicating empty and require value, if datum is undefined.", () => {
        const evaluator = new MultiSelectEvaluator({
          ...fieldJsonDropdown,
          ...{ required: "1" },
        } as unknown as TFsFieldAny);
        const actual = evaluator.getUiPopulateObjects();
        expect(actual).toStrictEqual([
          {
            uiid: null,
            fieldId: "147738162",
            fieldType: "select",
            value: "",
            statusMessages: [
              {
                severity: "warn",
                fieldId: "147738162",
                message: "Stored value: '__MISSING_AND_REQUIRED__'.",
                relatedFieldIds: [],
              },
              {
                severity: "warn",
                fieldId: "147738162",
                message:
                  "Failed to find valid option: 'undefined' within valid options: 'OPT01', 'OPT02', 'OPT03'.",
                relatedFieldIds: [],
              },
            ],
          },
        ]);
      });
      it("Should return TUiEvaluationObject[] with statusMessage indicating bad data type if datum type not string. (radio/select)", () => {
        const evaluator = new MultiSelectEvaluator({
          ...fieldJsonDropdown,
          ...{ required: "1", type: "radio" },
        } as unknown as TFsFieldAny);
        const actual = evaluator.getUiPopulateObjects([]);
        expect(actual).toStrictEqual([
          {
            uiid: null,
            fieldId: "147738162",
            fieldType: "radio",
            value: "",
            statusMessages: [
              {
                severity: "warn",
                fieldId: "147738162",
                message: "Stored value: '__BAD_DATA_TYPE__ (object)'.",
                relatedFieldIds: [],
              },
              {
                severity: "warn",
                fieldId: "147738162",
                message: "stringified: []",
                relatedFieldIds: [],
              },
            ],
          },
        ]);
      });
      it("Should empty return item with empty value and status message if field required and invalid selected.", () => {
        const evaluator = new MultiSelectEvaluator(fieldJsonDropdown);
        const actual = evaluator.getUiPopulateObjects("_INVALID_OPTION_");
        expect(actual).toStrictEqual([
          {
            uiid: null,
            fieldId: "147738162",
            fieldType: "select",
            value: "",
            statusMessages: [
              {
                severity: "info",
                fieldId: "147738162",
                message: "Stored value: '_INVALID_OPTION_'.",
                relatedFieldIds: [],
              },
              {
                severity: "warn",
                fieldId: "147738162",
                message:
                  "Failed to find valid option: '_INVALID_OPTION_' within valid options: 'OPT01', 'OPT02', 'OPT03'.",
                relatedFieldIds: [],
              },
            ],
          },
        ]);
      });
    });
  });
});
const submissionDataDropdown = {
  field: "147738162",
  value: "OPT03",
};
const fieldJsonDropdown = {
  id: "147738162",
  label: "Dropdown List With Values And Labels",
  hide_label: "0",
  description: "",
  name: "dropdown_list_with_values_and_labels",
  type: "select",
  options: [
    {
      label: "Option1",
      value: "OPT01",
      imageUrl: null,
    },
    {
      label: "Option2",
      value: "OPT02",
      imageUrl: null,
    },
    {
      label: "Option3",
      value: "OPT03",
      imageUrl: null,
    },
  ],
  required: "0",
  uniq: "0",
  hidden: "0",
  readonly: "0",
  colspan: "1",
  sort: "11",
  logic: null,
  calculation: "",
  workflow_access: "write",
  default: "",
  select_size: 1,
  option_layout: "vertical",
  option_other: 0,
  randomize_options: 0,
  option_store: "value",
  option_show_values: true,
} as unknown as TFsFieldAny;

const submissionDataCheckbox = {
  field: "147738164",
  value: "Option1\nOption2",
};
