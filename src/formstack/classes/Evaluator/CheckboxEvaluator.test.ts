import { TFsFieldAny } from "../../type.field";
import { CheckboxEvaluator } from "./CheckboxEvaluator";

describe("CheckboxEvaluator", () => {
  describe("Multiple selectable options (checkbox)", () => {
    describe(".getUiPopulateObjects(...)", () => {
      it("Should return array of TUiEvaluationObject object when there is submission data.(ideal)", () => {
        const evaluator = new CheckboxEvaluator(fieldJsonCheckbox);
        const actual = evaluator.getUiPopulateObjects(
          submissionDataCheckbox.value
        );
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
            uiid: null,
            fieldId: "147738164",
            fieldType: "checkbox",
            value: "",
            statusMessages: [
              {
                severity: "info",
                fieldId: "147738164",
                message: "Stored value: 'Option1\\nOption2'.",
                relatedFieldIds: [],
              },
            ],
          },
        ]);
      });
      it("Should return TUiEvaluationObject[], including status message for empty submission data.", () => {
        const evaluator = new CheckboxEvaluator({
          ...fieldJsonCheckbox,
          ...{ required: "1" },
        } as unknown as TFsFieldAny);
        const actual = evaluator.getUiPopulateObjects("");
        expect(actual).toStrictEqual([
          {
            uiid: null,
            fieldId: "147738164",
            fieldType: "checkbox",
            value: "",
            statusMessages: [
              {
                severity: "info",
                fieldId: "147738164",
                message: "Stored value: ''.",
                relatedFieldIds: [],
              },
              {
                severity: "warn",
                fieldId: "147738164",
                message:
                  "Submission data missing and required.  This is not an issue if the field is hidden by logic.",
                relatedFieldIds: [],
              },
            ],
          },
        ]);
      });
      it("Should return TUiEvaluationObject[], including status message for empty and require submission data.", () => {
        const evaluator = new CheckboxEvaluator({
          ...fieldJsonCheckbox,
          ...{ required: "1" },
        } as unknown as TFsFieldAny);
        const actual = evaluator.getUiPopulateObjects();
        expect(actual).toStrictEqual([
          {
            uiid: null,
            fieldId: "147738164",
            fieldType: "checkbox",
            value: "",
            statusMessages: [
              {
                severity: "info",
                fieldId: "147738164",
                message: "Stored value: '__EMPTY_AND_REQUIRED__'.",
                relatedFieldIds: [],
              },
              {
                severity: "warn",
                fieldId: "147738164",
                message:
                  "Submission data missing and required.  This is not an issue if the field is hidden by logic.",
                relatedFieldIds: [],
              },
            ],
          },
        ]);
      });
      it("Should return TUiEvaluationObject[], including status message corrupt/broken submission data.", () => {
        const evaluator = new CheckboxEvaluator({
          ...fieldJsonCheckbox,
          ...{ required: "1" },
        } as unknown as TFsFieldAny);
        const actual = evaluator.getUiPopulateObjects([]);
        expect(actual).toStrictEqual([
          {
            uiid: null,
            fieldId: "147738164",
            fieldType: "checkbox",
            value: "",
            statusMessages: [
              {
                severity: "info",
                fieldId: "147738164",
                message: "Stored value: '[]'.",
                relatedFieldIds: [],
              },
              {
                severity: "error",
                fieldId: "147738164",
                message: "_BAD_DATA_TYPE_' type: 'object', value: ''.",
                // message: "stringified: []",
                relatedFieldIds: [],
              },
            ],
          },
        ]);
      });
      it("Should empty return item with empty value and status message if field required and invalid selected.", () => {
        const evaluator = new CheckboxEvaluator(fieldJsonCheckbox);
        const actual = evaluator.getUiPopulateObjects("_INVALID_OPTION_");
        expect(actual).toStrictEqual([
          {
            uiid: null,
            fieldId: "147738164",
            fieldType: "checkbox",
            value: "",
            statusMessages: [
              {
                severity: "info",
                fieldId: "147738164",
                message: "Stored value: '_INVALID_OPTION_'.",
                relatedFieldIds: [],
              },
              {
                severity: "warn",
                fieldId: "147738164",
                message:
                  "Failed to find valid option: '_INVALID_OPTION_' within valid options: 'Option1', 'Option2', 'Option3'.",
                relatedFieldIds: [],
              },
            ],
          },
        ]);
      });
      it("Should status messages indicated any unrecognized selected option.", () => {
        const evaluator = new CheckboxEvaluator(fieldJsonCheckbox);
        const actual = evaluator.getUiPopulateObjects(
          submissionDataCheckbox.value + "\n_INVALID_OPTION_"
        );
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
            uiid: null,
            fieldId: "147738164",
            fieldType: "checkbox",
            value: "",
            statusMessages: [
              {
                severity: "info",
                fieldId: "147738164",
                message:
                  "Stored value: 'Option1\\nOption2\\n_INVALID_OPTION_'.",
                relatedFieldIds: [],
              },
              {
                severity: "warn",
                fieldId: "147738164",
                message:
                  "Failed to find valid option: '_INVALID_OPTION_' within valid options: 'Option1', 'Option2', 'Option3'.",
                relatedFieldIds: [],
              },
            ],
          },
        ]);
      });
    });
  });
});

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
