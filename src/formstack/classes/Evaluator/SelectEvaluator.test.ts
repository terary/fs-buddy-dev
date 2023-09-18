import { TFsFieldAny } from "../../type.field";
import { SelectEvaluator } from "./SelectEvaluator";

describe("SelectEvaluator", () => {
  describe(".getUiPopulateObjects(...)", () => {
    it("Should return array of TUiEvaluationObject object when there is submission data.(ideal)", () => {
      const evaluator = new SelectEvaluator(fieldJsonDropdown);
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
    it("Should return TUiEvaluationObject[], including status message for empty submission data.", () => {
      const evaluator = new SelectEvaluator(fieldJsonDropdown);
      const actual = evaluator.getUiPopulateObjects(undefined);
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
              message: "Stored value: '__NO_SUBMISSION_DATA__'.",
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
    it("Should return TUiEvaluationObject[], including status message for empty and require submission data.", () => {
      const fieldJsonDropdownRequired = {
        ...fieldJsonDropdown,
        ...{ required: "1" },
      };
      const evaluator = new SelectEvaluator(fieldJsonDropdownRequired);
      const actual = evaluator.getUiPopulateObjects(undefined);
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
              message: "Stored value: '__EMPTY_AND_REQUIRED__'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738162",
              message:
                "Failed to find valid option: 'undefined' within valid options: 'OPT01', 'OPT02', 'OPT03'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738162",
              message:
                "Submission data missing and required.  This is not an issue if the field is hidden by logic.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should return TUiEvaluationObject[], including status message corrupt/broken submission data.", () => {
      const evaluator = new SelectEvaluator(fieldJsonDropdown);
      const actual = evaluator.getUiPopulateObjects([]);
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
              message: "Stored value: '[]'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738162",
              message: "_BAD_DATA_TYPE_' type: 'object', value: '[]'",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
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
