import { TFsFieldAny } from "../../type.field";
import { ProductEvaluator } from "./ProductEvaluator";

describe("ProductEvaluator", () => {
  describe(".evaluateWithValues(...)", () => {
    it("Should parse submittedData", () => {
      //
      const evaluator = new ProductEvaluator(fieldJson);
      const actual = evaluator.evaluateWithValues({
        [submissionData.field]: submissionData.value,
      });
      expect(actual).toStrictEqual({
        "147738157": {
          address: "123 Walt Disney Way 0",
          address2: "Micky Mouse Hut #2, 4",
          city: "Disney World 7",
          state: "DE",
          zip: "04240",
        },
      });
    });
    it("Should quietly ignore bad data if possible (non parsable string)", () => {
      //
      const evaluator = new ProductEvaluator(fieldJson);
      const testValue =
        "Something that does not belong\n" + submissionData.value;
      const actual = evaluator.evaluateWithValues({
        [submissionData.field]: testValue,
      });
      expect(actual).toStrictEqual({
        "147738157": {
          address: "123 Walt Disney Way 0",
          address2: "Micky Mouse Hut #2, 4",
          city: "Disney World 7",
          state: "DE",
          zip: "04240",
        },
      });
    });
    it("Should quietly ignore bad data if possible (unrecognized subfieldId)", () => {
      //
      const evaluator = new ProductEvaluator(fieldJson);
      const testValue = "unknownSubfield = unknown\n" + submissionData.value;
      const actual = evaluator.evaluateWithValues({
        [submissionData.field]: testValue,
      });
      expect(actual).toStrictEqual({
        "147738157": {
          address: "123 Walt Disney Way 0",
          address2: "Micky Mouse Hut #2, 4",
          city: "Disney World 7",
          state: "DE",
          zip: "04240",
        },
      });
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
