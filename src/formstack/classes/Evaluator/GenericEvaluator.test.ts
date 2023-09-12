import { TFsFieldAny } from "../../type.field";
import { GenericEvaluator } from "./GenericEvaluator";

describe("GenericEvaluator", () => {
  describe(".evaluateWithValues(...)", () => {
    it("Should parse submittedData", () => {
      //
      const evaluator = new GenericEvaluator(fieldJson);
      const actual = evaluator.evaluateWithValues("Just some plain text.");
      expect(actual).toStrictEqual("Just some plain text.");
    });
  });
});
const submissionData = {
  field: "147738155",
  value: "Just some plain text.",
};

const fieldJson = {
  id: "147738155",
  label: "Long Answer",
  hide_label: "0",
  description: "",
  name: "long_answer",
  type: "textarea",
  options: "",
  required: "0",
  uniq: "0",
  hidden: "0",
  readonly: "0",
  colspan: "1",
  sort: "4",
  logic: null,
  calculation: "",
  workflow_access: "write",
  default: "",
  rows: 10,
  cols: 50,
  minlength: 0,
  maxlength: 0,
  placeholder: "",
} as unknown as TFsFieldAny;
