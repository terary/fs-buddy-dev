import { FsTreeCalcString } from "./FsTreeCalcString";
import { AbstractFsTreeGeneric } from "./AbstractFsTreeGeneric";
import { TFsFieldAnyJson } from "../../types";

describe("FsTreeCalcString", () => {
  let tree: FsTreeCalcString;
  beforeEach(() => {
    tree = FsTreeCalcString.fromFieldJson(TEST_JSON_FIELD as TFsFieldAnyJson);
  });
  describe("Creation", () => {
    it("Should be awesome", () => {
      expect(tree).toBeInstanceOf(AbstractFsTreeGeneric);
      expect(tree.fieldJson).toStrictEqual(TEST_JSON_FIELD.calculation);
      expect(tree.getDependantFieldIds()).toStrictEqual([
        "148149774",
        "148149776",
      ]);
    });
  });
  describe(".fieldJson", () => {
    it("Should be segment of the original json", () => {
      expect(tree.fieldJson).toStrictEqual(TEST_JSON_FIELD.calculation);
    });
  });
  describe(".evaluateWithValues(...)", () => {
    it("Should return the value of the calculation given field values", () => {
      const tree = FsTreeCalcString.fromFieldJson(
        TEST_JSON_FIELD as TFsFieldAnyJson
      );
      expect(
        tree.evaluateWithValues({ "148149774": 3, "148149776": 7 })
      ).toStrictEqual(38);
    });
  });
  describe("getDependantFieldIds", () => {
    it("should return all dependant field IDs of the calculation.", () => {
      expect(tree.getDependantFieldIds()).toEqual(["148149774", "148149776"]);
      //
    });
  });
});

//  "calculation":"[148149774] + [148149776] * 5"
const TEST_JSON_FIELD = {
  id: "147462596",
  label: "",
  hide_label: "0",
  description: "",
  name: "",
  type: "richtext",
  options: "",
  required: "0",
  uniq: "0",
  hidden: "0",
  readonly: "0",
  colspan: "1",
  sort: "0",
  logic: {
    action: "show",
    conditional: "all",
    checks: [
      {
        field: "147462595",
        condition: "equals",
        option: "True",
      },
      {
        field: 147462598,
        condition: "equals",
        option: "True",
      },
      {
        field: 147462600,
        condition: "equals",
        option: "True",
      },
      {
        field: 147462597,
        condition: "equals",
        option: "True",
      },
    ],
  },
  calculation: "[148149774] + [148149776] * 5",
  workflow_access: "write",
  default: "",
  section_text: "<p>The check boxes prevent this from showing.</p>",
  text_editor: "wysiwyg",
} as unknown as TFsFieldAnyJson;
