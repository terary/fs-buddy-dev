import { TFsFieldAny } from "../../type.field";
import { NameEvaluator } from "./NameEvaluator";
describe("NameEvaluator", () => {
  describe(".getUiPopulateObjects(...)", () => {
    it("Should return array of TUiEvaluationObject object when there is submission data.(ideal)", () => {
      const evaluator = new NameEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects(submissionData.value);
      expect(actual).toStrictEqual([
        {
          uiid: "field147738156-first",
          fieldId: "147738156",
          fieldType: "name",
          value: "First Name 439",
          statusMessages: [],
        },
        {
          uiid: "field147738156-last",
          fieldId: "147738156",
          fieldType: "name",
          value: "Last Name 925",
          statusMessages: [],
        },
        {
          uiid: "field147738156-initial",
          fieldId: "147738156",
          fieldType: "name",
          value: undefined,
          statusMessages: [],
        },
        {
          uiid: "field147738156-prefix",
          fieldId: "147738156",
          fieldType: "name",
          value: undefined,
          statusMessages: [],
        },
        {
          uiid: "field147738156-suffix",
          fieldId: "147738156",
          fieldType: "name",
          value: undefined,
          statusMessages: [],
        },
        {
          uiid: "field147738156-middle",
          fieldId: "147738156",
          fieldType: "name",
          value: undefined,
          statusMessages: [],
        },
        {
          uiid: null,
          fieldId: "147738156",
          fieldType: "name",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738156",
              message:
                "Stored value: 'first = First Name 439\\nlast = Last Name 925'.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
      //     it("Should quietly ignore bad data if possible (non parsable string)", () => {
    });
    it("Should return TUiEvaluationObject[], including status message for empty (undefined) submission data.", () => {
      const evaluator = new NameEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects(undefined);
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738156",
          fieldType: "name",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738156",
              message: "Stored value: '__NO_SUBMISSION_DATA__'.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should return TUiEvaluationObject[], including status message for empty and require submission data.", () => {
      const fieldJsonRequired = { ...fieldJson, ...{ required: "1" } };
      const evaluator = new NameEvaluator(fieldJsonRequired);
      const actual = evaluator.getUiPopulateObjects(undefined);
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738156",
          fieldType: "name",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738156",
              message: "Stored value: '__EMPTY_AND_REQUIRED__'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738156",
              message:
                "Submission data missing and required.  This is not an issue if the field is hidden by logic.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should return TUiEvaluationObject[], including status message corrupt/broken submission data.", () => {
      const evaluator = new NameEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects(
        new Date("1984-01-18T00:00:00.000Z")
      );
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738156",
          fieldType: "name",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738156",
              message: "Stored value: '\"1984-01-18T00:00:00.000Z\"'.",
              relatedFieldIds: [],
            },
            {
              severity: "error",
              fieldId: "147738156",
              message:
                "No subfields with id: 'first', 'last', 'initial', 'prefix', 'suffix', 'middle' found in submission data: '<pre><code>\"1984-01-18T00:00:00.000Z\"</code></pre>'.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
  });
});

const submissionData = {
  field: "147738156",
  value: "first = First Name 439\nlast = Last Name 925",
};

const fieldJson = {
  id: "147738156",
  label: "Name",
  hide_label: "0",
  description: "",
  name: "name",
  type: "name",
  options: "",
  required: "0",
  uniq: "0",
  hidden: "0",
  readonly: "0",
  colspan: "1",
  sort: "5",
  logic: null,
  calculation: "",
  workflow_access: "write",
  default: "",
  show_prefix: true,
  show_middle: true,
  show_initial: true,
  show_suffix: true,
  text_size: 20,
  middle_initial_optional: 0,
  middle_name_optional: 0,
  prefix_optional: 0,
  suffix_optional: 0,
  visible_subfields: ["first", "last", "initial", "prefix", "suffix", "middle"],
} as unknown as TFsFieldAny;
