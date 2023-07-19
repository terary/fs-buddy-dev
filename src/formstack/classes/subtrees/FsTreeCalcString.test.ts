import { IExpressionTree } from "predicate-tree-advanced-poc/dist/src";
import { FsTreeCalcString } from "./FsTreeCalcString";
import { AbstractFsTreeGeneric } from "../AbstractFsTreeGeneric";
import { TFsFieldAnyJson } from "../types";

describe("FsTreeCalcString", () => {
  describe("Creation", () => {
    it("Should be awesome", () => {
      // const tree = new FsTreeCalcString("_root_seed_");
      const tree = FsTreeCalcString.fromFieldJson(
        TEST_JSON_FIELD as TFsFieldAnyJson
      );
      expect(tree).toBeInstanceOf(AbstractFsTreeGeneric);
      // expect(tree.fieldId).toEqual("147462596");
      // the class instance doesn't have '_fieldJson', this is parent? is that a good id?
      // certainly it's not 'fieldJson' but maybe 'logicJson'
      expect(tree.fieldJson).toStrictEqual(TEST_JSON_FIELD);
      expect(tree.getDependantFields()).toStrictEqual([
        "148149774",
        "148149776",
      ]);
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
} as unknown;
