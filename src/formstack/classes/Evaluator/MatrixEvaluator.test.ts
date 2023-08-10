import { TFsFieldAny } from "../../type.field";
import { MatrixEvaluator } from "./MatrixEvaluator";

describe("MatrixEvaluator", () => {
  describe(".evaluateWithValues(...)", () => {
    it("Should parse submittedData", () => {
      //
      const evaluator = new MatrixEvaluator(fieldJson);
      const actual = evaluator.evaluateWithValues({
        [submissionData.field]: submissionData.value,
      });
      expect(actual).toStrictEqual({
        "147738168": {
          "Row 1": "Column 1",
          "Row 2": "Column 2",
          "Row 3": "Column 3",
        },
      });
    });
    it("Should append column if key/value is missing value, to make matrix shape.", () => {
      //
      const evaluator = new MatrixEvaluator(fieldJson);
      const testValue =
        "Something that does not belong\n" + submissionData.value;
      const actual = evaluator.evaluateWithValues({
        [submissionData.field]: testValue,
      });
      expect(actual).toStrictEqual({
        "147738168": {
          "Row 1": "Column 1",
          "Row 2": "Column 2",
          "Row 3": "Column 3",
          "Something that does not belong": "",
        },
      });
    });
    it("Should add unknown field row/column pairs", () => {
      //
      const evaluator = new MatrixEvaluator(fieldJson);
      const testValue = "unknownSubfield = unknown\n" + submissionData.value;
      const actual = evaluator.evaluateWithValues({
        [submissionData.field]: testValue,
      });
      expect(actual).toStrictEqual({
        "147738168": {
          "Row 1": "Column 1",
          "Row 2": "Column 2",
          "Row 3": "Column 3",
          unknownSubfield: "unknown",
        },
      });
    });
  });
});
const submissionData = {
  field: "147738168",
  value: "Row 1 = Column 1\nRow 2 = Column 2\nRow 3 = Column 3",
};

const fieldJson = {
  id: "147738168",
  label: "Matrix",
  hide_label: "0",
  description: "",
  name: "matrix",
  type: "matrix",
  options: "",
  required: "0",
  uniq: "0",
  hidden: "0",
  readonly: "0",
  colspan: "1",
  sort: "17",
  logic: null,
  calculation: "",
  workflow_access: "write",
  default: {
    "Row 1": [""],
    "Row 2": [""],
    "Row 3": [""],
  },
  row_choices: "Row 1\nRow 2\nRow 3",
  column_choices: "Column 1\nColumn 2\nColumn 3",
  one_per_row: "1",
  one_per_column: "0",
  randomize_rows: "0",
} as unknown as TFsFieldAny;
