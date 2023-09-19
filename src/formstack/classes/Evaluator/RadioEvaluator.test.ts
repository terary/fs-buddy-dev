import { TFsFieldAny } from "../../type.field";
import { RadioEvaluator } from "./RadioEvaluator";

describe("RadioEvaluator", () => {
  describe(".getUiPopulateObjects(...)", () => {
    it("Should return array of TUiEvaluationObject object when there is submission data.(ideal)", () => {
      const evaluator = new RadioEvaluator(fieldJsonRadio);
      const actual = evaluator.getUiPopulateObjects(submissionDataRadio.value);
      expect(actual).toStrictEqual([
        {
          uiid: "field147738163_2",
          fieldId: "147738163",
          fieldType: "radio",
          value: "Option2",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738163",
              message: "Stored value: 'Option2'.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should return TUiEvaluationObject[], including status message for empty submission data.", () => {
      const evaluator = new RadioEvaluator(fieldJsonRadio);
      const actual = evaluator.getUiPopulateObjects(undefined);
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738163",
          fieldType: "radio",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738163",
              message: "Stored value: '__NO_SUBMISSION_DATA__'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738163",
              message:
                "Failed to find valid option: 'undefined' within valid options: 'Option1', 'Option2', 'Option3'.",

              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should return TUiEvaluationObject[], including status message for empty and require submission data.", () => {
      const fieldJsonRadioRequired = {
        ...fieldJsonRadio,
        ...{ required: "1" },
      };
      const evaluator = new RadioEvaluator(fieldJsonRadioRequired);
      const actual = evaluator.getUiPopulateObjects(undefined);
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738163",
          fieldType: "radio",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738163",
              message: "Stored value: '__EMPTY_AND_REQUIRED__'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738163",
              message:
                "Failed to find valid option: 'undefined' within valid options: 'Option1', 'Option2', 'Option3'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738163",
              message:
                "Submission data missing and required.  This is not an issue if the field is hidden by logic.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should return TUiEvaluationObject[], including status message corrupt/broken submission data.", () => {
      const evaluator = new RadioEvaluator(fieldJsonRadio);
      const actual = evaluator.getUiPopulateObjects([]);
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738163",
          fieldType: "radio",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738163",
              message: "Stored value: '[]'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738163",
              message: "_BAD_DATA_TYPE_' type: 'object', value: '[]'",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should status messages indicated any unrecognized selected option.", () => {
      const evaluator = new RadioEvaluator(fieldJsonRadio);
      const actual = evaluator.getUiPopulateObjects("_INVALID_OPTION_");
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738163",
          fieldType: "radio",
          value: "null",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738163",
              message: "Stored value: '_INVALID_OPTION_'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738163",
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

const submissionDataRadio = {
  field: "147738163",
  value: "Option2",
};
const fieldJsonRadio = {
  id: "147738163",
  label: "Radio Button",
  hide_label: "0",
  description: "",
  name: "radio_button",
  type: "radio",
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
  sort: "12",
  logic: null,
  calculation: "",
  workflow_access: "write",
  default: "",
  option_layout: "vertical",
  option_other: 0,
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
} as unknown as TFsFieldAny;
