import { TFsFieldAny } from "../../type.field";
import { AbstractSubfieldEvaluator } from "./AbstractSubfieldEvaluator";

class TestSubfieldEvaluator extends AbstractSubfieldEvaluator {
  get supportedSubfieldIds() {
    return ["subfield0", "subfield1", "subfield2"];
  }
  isCorrectType<T>(submissionDatum: T): boolean {
    return true;
  }
}

describe("AbstractSubfieldEvaluator", () => {
  describe(".getUiPopulateObjects(...)", () => {
    it("Should return __EMPTY_SUBMISSION_DATA__ for fields without submission data", () => {
      const requireFieldJson = {
        ...fieldJson,
        ...{ required: "1" },
      } as unknown as TFsFieldAny;
      const evaluator = new TestSubfieldEvaluator(requireFieldJson);
      const actual = evaluator.getUiPopulateObjects(undefined);
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738157",
          fieldType: "address",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738157",
              message: "Stored value: 'undefined'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738157",
              message:
                "Submission data missing and required.  This is not an issue if the field is hidden by logic.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });

    it("Should return Something if the object is empty?? for fields without submission data", () => {
      const evaluator = new TestSubfieldEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects({});
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738157",
          fieldType: "address",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738157",
              message: "Stored value: '{}'.",
              relatedFieldIds: [],
            },
            {
              severity: "error",
              fieldId: "147738157", // if we exclude fieldId it should attached the message on the form, I think we want that here?
              message: "Failed to parse field",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should return array of properly formatted UI instructions (shape of TUiEvaluationObject).", () => {
      const testValue =
        "subfield0 = The First Value.\nsubfield1 = The Second Value.\nsubfield2 = The Final Value.";
      const evaluator = new TestSubfieldEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects(testValue);
      expect(actual).toStrictEqual([
        {
          uiid: "field147738157-subfield0",
          fieldId: "147738157",
          fieldType: "address",
          value: "The First Value.",
          statusMessages: [],
        },
        {
          uiid: "field147738157-subfield1",
          fieldId: "147738157",
          fieldType: "address",
          value: "The Second Value.",
          statusMessages: [],
        },
        {
          uiid: "field147738157-subfield2",
          fieldId: "147738157",
          fieldType: "address",
          value: "The Final Value.",
          statusMessages: [],
        },
        {
          uiid: null,
          fieldId: "147738157",
          fieldType: "address",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738157",
              message:
                "Stored value: 'subfield0 = The First Value.\\nsubfield1 = The Second Value.\\nsubfield2 = The Final Value.'.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should return status messages indicated unknown field found.", () => {
      const testValue =
        "subfield0 = The First Value.\nsubfield1 = The Second Value.\nsubfield2 = The Final Value.\nUnknownSubField = some unknown value\n";
      const evaluator = new TestSubfieldEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects(testValue);
      expect(actual).toStrictEqual([
        {
          uiid: "field147738157-subfield0",
          fieldId: "147738157",
          fieldType: "address",
          value: "The First Value.",
          statusMessages: [],
        },
        {
          uiid: "field147738157-subfield1",
          fieldId: "147738157",
          fieldType: "address",
          value: "The Second Value.",
          statusMessages: [],
        },
        {
          uiid: "field147738157-subfield2",
          fieldId: "147738157",
          fieldType: "address",
          value: "The Final Value.",
          statusMessages: [],
        },
        {
          uiid: null,
          fieldId: "147738157",
          fieldType: "address",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738157",
              message:
                "Stored value: 'subfield0 = The First Value.\\nsubfield1 = The Second Value.\\nsubfield2 = The Final Value.\\nUnknownSubField = some unknown value\\n'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              message:
                "Found unexpected subfield: 'UnknownSubField'. With value: 'some unknown value'.",
              fieldId: "147738157",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
  });
});

const submissionData = {
  field: "147738157",
  value:
    "address = 123 Walt Disney Way 0\naddress2 = Micky Mouse Hut #2, 4\ncity = Disney World 7\nstate = DE\nzip = 04240",
};

const fieldJson = {
  id: "147738157",
  label: "Address",
  hide_label: "0",
  description: "",
  name: "address",
  type: "address",
  options: "",
  required: "0",
  uniq: "0",
  hidden: "0",
  readonly: "0",
  colspan: "1",
  sort: "6",
  logic: null,
  calculation: "",
  workflow_access: "write",
  default: "",
  text_size: 50,
  show_country: 0,
  format: "US",
  hide_address: 0,
  hide_address2: 0,
  hide_city: 0,
  hide_state: 0,
  hide_zip: 0,
  visible_subfields: ["address", "address2", "city", "state", "zip"],
} as unknown as TFsFieldAny;
