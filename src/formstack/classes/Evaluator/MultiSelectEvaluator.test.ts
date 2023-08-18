import { TFsFieldAny } from "../../type.field";
import { InvalidEvaluation } from "../InvalidEvaluation";
import { MultiSelectEvaluator } from "./MultiSelectEvaluator";

describe("MultiSelectEvaluator", () => {
  describe("Single select controls (radio, dropdown)", () => {
    describe(".evaluateWithValues(...)", () => {
      it("Should parse submittedData, return the same type and value as passed-in data.", () => {
        //
        const evaluator = new MultiSelectEvaluator(fieldJsonDropdown);
        const actual = evaluator.evaluateWithValues({
          [submissionDataDropdown.field]: submissionDataDropdown.value,
        });

        expect(actual).toStrictEqual({
          "147738162": "OPT03",
        });
      });
      it("Should return InvalidEvaluation for something that does not look like a number.", () => {
        //
        const evaluator = new MultiSelectEvaluator(fieldJsonDropdown);
        const testValue = "Something that is not a number";
        const actual = evaluator.evaluateWithValues({
          [submissionDataDropdown.field]: testValue,
        });
        expect(actual[submissionDataDropdown.field]).toBeInstanceOf(
          InvalidEvaluation
        );
        const actualEvaluation = actual[
          submissionDataDropdown.field
        ] as InvalidEvaluation;
        expect(actualEvaluation.message).toStrictEqual(
          "Selected option not found."
        );
        expect(actualEvaluation.payload).toStrictEqual({
          options: [
            { imageUrl: null, label: "Option1", value: "OPT01" },
            { imageUrl: null, label: "Option2", value: "OPT02" },
            { imageUrl: null, label: "Option3", value: "OPT03" },
          ],
          searchValue: "Something that is not a number",
        });
      });
    });
    describe(".getUiPopulateObject(...)", () => {
      it("Should return array of properly formatted UI instructions (shape of TUiEvaluationObject).", () => {
        const testValue = "1";
        const evaluator = new MultiSelectEvaluator(fieldJsonDropdown);
        const actual = evaluator.getUiPopulateObject({
          [submissionDataDropdown.field]: submissionDataDropdown.value,
        });
        expect(actual).toStrictEqual([
          {
            uiid: "field147738162",
            fieldId: "147738162",
            fieldType: "select",
            value: "OPT03",
            statusMessages: [],
          },
        ]);
      });
      it("Should include statusMessage when the parsedValue is not one of the available options.", () => {
        const testValue = "1";
        const evaluator = new MultiSelectEvaluator(fieldJsonDropdown);
        const actual = evaluator.getUiPopulateObject({
          [submissionDataDropdown.field]: "INVALID_OPTION",
        });
        expect(actual).toStrictEqual([
          {
            uiid: "field147738162",
            fieldId: "147738162",
            fieldType: "select",
            value: "INVALID_OPTION",
            statusMessages: [
              {
                severity: "warn",
                fieldId: "147738162",
                message:
                  "Failed to find valid option: 'INVALID_OPTION' within valid options: 'OPT01', 'OPT02', 'OPT03' ",
                relatedFieldIds: [],
              },
            ],
          },
        ]);
      });
    });
  });
  describe("Multiple selectable options (checkbox)", () => {
    describe(".getUiPopulateObject(...)", () => {
      it("Should return array of properly formatted UI instructions (shape of TUiEvaluationObject).", () => {
        const evaluator = new MultiSelectEvaluator(fieldJsonCheckbox);
        const actual = evaluator.getUiPopulateObject({
          [submissionDataCheckbox.field]: submissionDataCheckbox.value,
        });
        expect(actual).toStrictEqual([
          {
            uiid: "field147738164_1",
            fieldId: "147738164",
            fieldType: "checkbox",
            value: "Option1",
            statusMessages: [],
          },
          {
            uiid: "field147738164_2",
            fieldId: "147738164",
            fieldType: "checkbox",
            value: "Option2",
            statusMessages: [],
          },
        ]);
      });
      it("Should empty return item with empty value and status message if field required and no options selected.", () => {
        const evaluator = new MultiSelectEvaluator(fieldJsonCheckbox);
        const actual = evaluator.getUiPopulateObject({
          [submissionDataCheckbox.field]: "",
        });
        expect(actual).toStrictEqual([
          {
            uiid: "147738164",
            fieldId: "147738164",
            fieldType: "checkbox",
            value: "",
            statusMessages: [
              {
                severity: "info",
                fieldId: "147738164",
                message:
                  "Failed to find valid option: '' within valid options: 'Option1', 'Option2', 'Option3' ",
                relatedFieldIds: [],
              },
            ],
          },
        ]);
      });
      it("Should empty return item with empty value and status message if field required and invalid selected.", () => {
        const evaluator = new MultiSelectEvaluator(fieldJsonCheckbox);
        const actual = evaluator.getUiPopulateObject({
          [submissionDataCheckbox.field]: "_INVALID_OPTION_",
        });
        expect(actual).toStrictEqual([
          {
            uiid: "147738164",
            fieldId: "147738164",
            fieldType: "checkbox",
            value: "",
            statusMessages: [
              {
                severity: "info",
                fieldId: "147738164",
                message:
                  "Failed to find valid option: '_INVALID_OPTION_' within valid options: 'Option1', 'Option2', 'Option3' ",
                relatedFieldIds: [],
              },
            ],
          },
        ]);
      });
      it("Should empty return item with empty value and status message if field required and invalid selected.", () => {
        const evaluator = new MultiSelectEvaluator(fieldJsonCheckbox);
        const actual = evaluator.getUiPopulateObject({
          [submissionDataCheckbox.field]:
            submissionDataCheckbox.value + "\n_INVALID_OPTION_",
        });
        expect(actual).toStrictEqual([
          {
            uiid: "field147738164_1",
            fieldId: "147738164",
            fieldType: "checkbox",
            value: "Option1",
            statusMessages: [],
          },
          {
            uiid: "field147738164_2",
            fieldId: "147738164",
            fieldType: "checkbox",
            value: "Option2",
            statusMessages: [],
          },
          {
            uiid: "147738164",
            fieldId: "147738164",
            fieldType: "checkbox",
            value: "",
            statusMessages: [
              {
                severity: "info",
                fieldId: "147738164",
                message:
                  "Failed to find valid option: '_INVALID_OPTION_' within valid options: 'Option1', 'Option2', 'Option3' ",
                relatedFieldIds: [],
              },
            ],
          },
        ]);
      });
      it.skip("Should include statusMessage when the parsedValue is not one of the available options.", () => {
        // skipped because this is using dropdown,
        const evaluator = new MultiSelectEvaluator(fieldJsonDropdown);
        const actual = evaluator.getUiPopulateObject({
          [submissionDataDropdown.field]: "INVALID_OPTION",
        });
        expect(actual).toStrictEqual([
          {
            uiid: "147738162",
            fieldId: "147738162",
            fieldType: "select",
            value: "INVALID_OPTION",
            statusMessages: [
              {
                severity: "warn",
                fieldId: "147738162",
                message:
                  "Failed to find valid option: 'INVALID_OPTION' within valid options: 'OPT01', 'OPT02', 'OPT03' ",
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

const fieldJsonCheckbox = {
  id: "147738164",
  label: "Checkbox",
  hide_label: "0",
  description: "",
  name: "checkbox",
  type: "checkbox",
  options: [
    {
      label: "Option1",
      value: "Option1",
    },
    {
      label: "Option2",
      value: "Option2",
    },
    {
      label: "Option3",
      value: "Option3",
    },
  ],
  required: "0",
  uniq: "0",
  hidden: "0",
  readonly: "0",
  colspan: "1",
  sort: "13",
  logic: null,
  calculation: "",
  workflow_access: "write",
  default: "",
  option_layout: "vertical",
  option_other: 0,
  option_checkall: 0,
  randomize_options: 0,
  option_store: "value",
  option_show_values: 0,
  use_images: 0,
  image_dimensions: "customDimensions",
  image_height: 100,
  image_width: 100,
  lock_image_ratio: true,
  lock_image_ratio_option: "fitProportionally",
  image_label_alignment: "bottom",
  hide_option_button: true,
} as unknown as TFsFieldAny;
