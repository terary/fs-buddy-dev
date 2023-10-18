import { TFsFieldAny } from "../../type.field";
import { AddressEvaluator } from "./AddressEvaluator";
describe("AddressEvaluator", () => {
  describe(".getUiPopulateObjects(...)", () => {
    it("Should return array of TUiEvaluationObject object when there is submission data.(ideal)", () => {
      const evaluator = new AddressEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects(submissionData.value);
      expect(actual).toStrictEqual([
        {
          uiid: "field147738157-address",
          fieldId: "147738157",
          fieldType: "address",
          value: "123 Walt Disney Way 0",
          statusMessages: [],
        },
        {
          uiid: "field147738157-address2",
          fieldId: "147738157",
          fieldType: "address",
          value: "Micky Mouse Hut #2, 4",
          statusMessages: [],
        },
        {
          uiid: "field147738157-city",
          fieldId: "147738157",
          fieldType: "address",
          value: "Disney World 7",
          statusMessages: [],
        },
        {
          uiid: "field147738157-state",
          fieldId: "147738157",
          fieldType: "address",
          value: "DE",
          statusMessages: [],
        },
        {
          uiid: "field147738157-zip",
          fieldId: "147738157",
          fieldType: "address",
          value: "04240",
          statusMessages: [],
        },
        {
          uiid: "field147738157-country",
          fieldId: "147738157",
          fieldType: "address",
          value: undefined,
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
                "Stored value: 'address = 123 Walt Disney Way 0\\naddress2 = Micky Mouse Hut #2, 4\\ncity = Disney World 7\\nstate = DE\\nzip = 04240'.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
      //     it("Should quietly ignore bad data if possible (non parsable string)", () => {
    });

    it("Should return TUiEvaluationObject[], including status message for empty (undefined) submission data.", () => {
      const evaluator = new AddressEvaluator(fieldJson);
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
              message: "Stored value: '__NO_SUBMISSION_DATA__'.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });

    it("Should return TUiEvaluationObject[], including status message for empty and require submission data.", () => {
      const fieldJsonRequired = { ...fieldJson, ...{ required: "1" } };
      const evaluator = new AddressEvaluator(fieldJsonRequired);
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
              message: "Stored value: '__EMPTY_AND_REQUIRED__'.",
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

    it("Should return TUiEvaluationObject[], including status message corrupt/broken submission data.", () => {
      const evaluator = new AddressEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects(
        new Date("1984-01-18T00:00:00.000Z")
      );
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
              message: "Stored value: '\"1984-01-18T00:00:00.000Z\"'.",
              relatedFieldIds: [],
            },
            {
              severity: "error",
              fieldId: "147738157",
              message:
                "No subfields with id: 'address', 'address2', 'city', 'state', 'zip', 'country' found in submission data: '<pre><code>\"1984-01-18T00:00:00.000Z\"</code></pre>'.",
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
