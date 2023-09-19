import { TFsFieldAny } from "../../type.field";
import { DateEvaluator } from "./DateEvaluator";

describe("DateEvaluator", () => {
  describe(".evaluateWithValues(...)", () => {
    it.skip("Should parse submittedData", () => {
      //
      const evaluator = new DateEvaluator(fieldJson);
      const actual = evaluator.evaluateWithValues("Just some plain text.");
      expect(actual).toStrictEqual("Just some plain text.");
    });
  });
  describe(".getUiPopulateObjects(...)", () => {
    it("Should return array of TUiEvaluationObject object when there is submission data.(ideal)", () => {
      const evaluator = new DateEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects(submissionData.value);
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
        {
          uiid: null,
          fieldId: "147738166",
          fieldType: "datetime",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738166",
              message: "Stored value: 'Nov 13, 2021 02:39 AM'.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should return TUiEvaluationObject[], including status message for empty (undefined) submission data.", () => {
      const evaluator = new DateEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects(undefined);
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738166",
          fieldType: "datetime",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738166",
              message: "Stored value: '__NO_SUBMISSION_DATA__'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738166",
              message:
                "Failed to parse field. Date did not parse correctly. Date: 'undefined'",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should return TUiEvaluationObject[], including status message for empty and require submission data.", () => {
      const fieldJsonRequired = { ...fieldJson, ...{ required: "1" } };
      const evaluator = new DateEvaluator(fieldJsonRequired);
      const actual = evaluator.getUiPopulateObjects(undefined);
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738166",
          fieldType: "datetime",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738166",
              message: "Stored value: '__EMPTY_AND_REQUIRED__'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738166",
              message:
                "Failed to parse field. Date did not parse correctly. Date: 'undefined'",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738166",
              message:
                "Submission data missing and required.  This is not an issue if the field is hidden by logic.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should return TUiEvaluationObject[], including status message corrupt/broken submission data.", () => {
      const evaluator = new DateEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects({});
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738166",
          fieldType: "datetime",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738166",
              message: "Stored value: '[object Object]'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738166",
              message: "_BAD_DATA_TYPE_' type: 'object', value: '{}'",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    // Date specific tests
    it("Should include statusMessages if it fails to instantiate a Date type.", () => {
      const evaluator = new DateEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects("SOME_INVALID_DATE");
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738166",
          fieldType: "datetime",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738166",
              message: "Stored value: 'SOME_INVALID_DATE'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738166",
              message:
                "_BAD_DATA_TYPE_' type: 'string', value: '\"SOME_INVALID_DATE\"'",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should include statusMessages if date is near epoch.", () => {
      const evaluator = new DateEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects(new Date(0).toISOString());
      expect(actual).toStrictEqual([
        {
          uiid: "field147738166M",
          fieldId: "147738166",
          fieldType: "datetime",
          value: "Dec",
          statusMessages: [],
        },
        {
          uiid: "field147738166D",
          fieldId: "147738166",
          fieldType: "datetime",
          value: "31",
          statusMessages: [],
        },
        {
          uiid: "field147738166Y",
          fieldId: "147738166",
          fieldType: "datetime",
          value: "1970",
          statusMessages: [],
        },
        {
          uiid: "field147738166H",
          fieldId: "147738166",
          fieldType: "datetime",
          value: "18",
          statusMessages: [],
        },
        {
          uiid: "field147738166I",
          fieldId: "147738166",
          fieldType: "datetime",
          value: "00",
          statusMessages: [],
        },
        {
          uiid: "field147738166A",
          fieldId: "147738166",
          fieldType: "datetime",
          value: "PM",
          statusMessages: [],
        },
        {
          uiid: null,
          fieldId: "147738166",
          fieldType: "datetime",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738166",
              message: "Stored value: '1970-01-01T00:00:00.000Z'.",
              relatedFieldIds: [],
            },
            {
              severity: "info",
              fieldId: "147738166",
              message:
                "This date is near the epoch.  This could suggest malformed date string. Date: 'Wed Dec 31 1969' ",
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
