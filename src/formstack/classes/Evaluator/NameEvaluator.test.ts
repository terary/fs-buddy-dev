import { TFsFieldAny } from "../../type.field";
import { NameEvaluator } from "./NameEvaluator";

describe("NameEvaluator", () => {
  describe(".evaluateWithValues(...)", () => {
    it("Should parse submittedData", () => {
      //
      const evaluator = new NameEvaluator(fieldJson);
      // const actual = evaluator.evaluateWithValues({
      //   [submissionData.field]: submissionData.value,
      // });
      const actual = evaluator.evaluateWithValues(submissionData.value);
      expect(actual).toStrictEqual({
        first: "First Name 439",
        last: "Last Name 925",
      });
    });

    it("Should quietly ignore bad data if possible (non parsable string)", () => {
      //
      const evaluator = new NameEvaluator(fieldJson);
      const testValue =
        "Something that does not belong\n" + submissionData.value;
      // const actual = evaluator.evaluateWithValues({
      //   [submissionData.field]: testValue,
      // });
      const actual = evaluator.evaluateWithValues(testValue);
      expect(actual).toStrictEqual({
        "Something that does not belong": "",
        first: "First Name 439",
        last: "Last Name 925",
      });
    });
    it("Should quietly ignore bad data if possible (unrecognized subfieldId)", () => {
      //
      const evaluator = new NameEvaluator(fieldJson);
      const testValue = "unknownSubfield = unknown\n" + submissionData.value;
      const actual = evaluator.evaluateWithValues(testValue);
      expect(actual).toStrictEqual({
        unknownSubfield: "unknown",
        first: "First Name 439",
        last: "Last Name 925",
      });
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
