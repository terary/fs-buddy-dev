import { TFsFieldAny } from "../../type.field";
import { DateEvaluator } from "./DateEvaluator";
'Product' field next


describe("DateEvaluator", () => {
  describe(".getUiPopulateObject(...)", () => {
    it("Should parse submittedData", () => {
      const evaluator = new DateEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObject({
        [submissionData.field]: submissionData.value,
      });
      expect(actual).toStrictEqual([
        {
          uiid: "field147738166M",
          fieldId: "147738166",
          fieldType: "datetime",
          value: "Nov",
          statusMessages: [],
        },
        {
          uiid: "field147738166D",
          fieldId: "147738166",
          fieldType: "datetime",
          value: "13",
          statusMessages: [],
        },
        {
          uiid: "field147738166Y",
          fieldId: "147738166",
          fieldType: "datetime",
          value: "2022",
          statusMessages: [],
        },
        {
          uiid: "field147738166H",
          fieldId: "147738166",
          fieldType: "datetime",
          value: "02",
          statusMessages: [],
        },
        {
          uiid: "field147738166I",
          fieldId: "147738166",
          fieldType: "datetime",
          value: "39",
          statusMessages: [],
        },
        {
          uiid: "field147738166A",
          fieldId: "147738166",
          fieldType: "datetime",
          value: "AM",
          statusMessages: [],
        },
      ]);
    });
    it("Should include statusMessages if date appears to be problematic.", () => {
      const evaluator = new DateEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObject({
        [submissionData.field]: "SOME_INVALID_DATE",
      });
      expect(actual).toStrictEqual([
        {
          uiid: "field147738166",
          fieldId: "147738166",
          fieldType: "datetime",
          value: "",
          statusMessages: [
            {
              severity: "error",
              message:
                "Failed to parse field. Date did not parse correctly. Date: 'SOME_INVALID_DATE'",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
  });
});
const submissionData = {
  field: "147738166",
  value: "Nov 13, 2021 02:39 AM",
};

const fieldJson = {
  id: "147738166",
  label: "Date/Time",
  hide_label: "0",
  description: "",
  name: "datetime",
  type: "datetime",
  options: "",
  required: "0",
  uniq: "0",
  hidden: "0",
  readonly: "0",
  colspan: "1",
  sort: "15",
  logic: null,
  calculation: "",
  workflow_access: "write",
  default: "",
  field_one_calculation: 0,
  field_two_calculation: 0,
  calculation_units: "",
  calculation_operator: "",
  calculation_type: "",
  date_format: "M d, Y",
  max_date: "",
  time_format: "h:i A",
  year_minus: 5,
  year_plus: 5,
} as unknown as TFsFieldAny;
