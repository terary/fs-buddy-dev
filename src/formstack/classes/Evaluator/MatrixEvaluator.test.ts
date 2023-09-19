import { MatrixEvaluator } from "./MatrixEvaluator";
import { TFsFieldAny } from "../../type.field";

describe("MatrixEvaluator", () => {
  describe(".getUiPopulateObjects(...)", () => {
    it("Should return array of TUiEvaluationObject object when there is submission data.(ideal)", () => {
      const testValue = "Row 1 = Column 1\nRow 2 = Column 2\nRow 3 = Column 3";
      const evaluator = new MatrixEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects(testValue);
      expect(actual).toStrictEqual([
        {
          uiid: "field147738168-1-1",
          fieldId: "147738168",
          fieldType: "matrix",
          value: "checked",
          statusMessages: [],
        },
        {
          uiid: "field147738168-2-2",
          fieldId: "147738168",
          fieldType: "matrix",
          value: "checked",
          statusMessages: [],
        },
        {
          uiid: "field147738168-3-3",
          fieldId: "147738168",
          fieldType: "matrix",
          value: "checked",
          statusMessages: [],
        },
        {
          uiid: null,
          fieldId: "147738168",
          fieldType: "matrix",
          value: "", // "Row 1 = Column 1\nRow 2 = Column 2\nRow 3 = Column 3",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738168",
              message:
                "Stored value: 'Row 1 = Column 1\\nRow 2 = Column 2\\nRow 3 = Column 3'.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });

    it("Should return TUiEvaluationObject[], including status message for empty (undefined) submission data.", () => {
      const evaluator = new MatrixEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects(undefined);
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738168",
          fieldType: "matrix",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738168",
              message: "Stored value: '__NO_SUBMISSION_DATA__'.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should return TUiEvaluationObject[], including status message for empty and require submission data.", () => {
      const fieldJsonRequire = { ...fieldJson, ...{ required: "1" } };
      const evaluator = new MatrixEvaluator(fieldJsonRequire);
      const actual = evaluator.getUiPopulateObjects(undefined);
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738168",
          fieldType: "matrix",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738168",
              message: "Stored value: '__EMPTY_AND_REQUIRED__'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738168",
              message:
                "Submission data missing and required.  This is not an issue if the field is hidden by logic.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should return TUiEvaluationObject[], including status message corrupt/broken submission data.", () => {
      const evaluator = new MatrixEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects([]);
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738168",
          fieldType: "matrix",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738168",
              message: "Stored value: '[]'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738168",
              message:
                'Found no selected rows/columns within submitted data: \'{"Row 1":{"Column 1":"field147738168-1-1","Column 2":"field147738168-1-2","Column 3":"field147738168-1-3"},"Row 2":{"Column 1":"field147738168-2-1","Column 2":"field147738168-2-2","Column 3":"field147738168-2-3"},"Row 3":{"Column 1":"field147738168-3-1","Column 2":"field147738168-3-2","Column 3":"field147738168-3-3"}}\' found in submission data: \'\'.',
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    // -- matrix specific
    it("Should return (Unknown Column).", () => {
      const testValue =
        "Row 1 = Column 1\nRow 2 = Column 2\nRow 3 = Column 3\nRow 3 = NON_COLUMN";
      const evaluator = new MatrixEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects(testValue);

      expect(actual).toStrictEqual([
        {
          uiid: "field147738168-1-1",
          fieldId: "147738168",
          fieldType: "matrix",
          value: "checked",
          statusMessages: [],
        },
        {
          uiid: "field147738168-2-2",
          fieldId: "147738168",
          fieldType: "matrix",
          value: "checked",
          statusMessages: [],
        },
        {
          uiid: null,
          fieldId: "147738168",
          fieldType: "matrix",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738168",
              message:
                "Stored value: 'Row 1 = Column 1\\nRow 2 = Column 2\\nRow 3 = Column 3\\nRow 3 = NON_COLUMN'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              message:
                'Unable to find matrix mapping for: \'{"row":"Row 3","column":"NON_COLUMN"}\'.',
              fieldId: "147738168",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
  });
});

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
