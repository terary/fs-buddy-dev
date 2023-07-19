import { FsTreeFieldCollection } from "./FsTreeFieldCollection";
import { TFsFieldAnyJson } from "../types";
import { FsTreeField } from "./FsTreeField";

describe("FsTreeFieldCollection", () => {
  describe("Creation", () => {
    it.only("Should be awesome", () => {
      const tree = FsTreeFieldCollection.fromFieldJson(
        // fields: [TEST_JSON_FIELD_CALC_STRING],
        // fields: [TEST_JSON_FIELD_LOGIC],
        TEST_JSON_FIELDS as TFsFieldAnyJson[]
      );
      expect(tree).toBeInstanceOf(FsTreeFieldCollection);

      // tree has 3 child nodes, 2 calc and 1 logic;
      // It should have two nodes Fields 1 and 2
      //    Field should have tree(s) logic and/or cals
    });
  });

  // I *think*,  I think there is root node and plus 1?  Should root not be null??
  describe(".evaluateWithValues(...)", () => {
    it("Should return the value of the calculation given field values", () => {
      const tree = FsTreeFieldCollection.fromFieldJson(
        TEST_JSON_FIELDS as TFsFieldAnyJson[]
      );
      expect(tree).toStrictEqual(38);
    });
  });

  /// --------------------------------
  describe(".getFieldTreeByFieldId(...)", () => {
    it.only("Should be awesome", () => {
      const tree = FsTreeFieldCollection.fromFieldJson(TEST_JSON_FIELDS);
      const field = tree.getFieldTreeByFieldId(TEST_JSON_FIELDS[0].id || "");
      expect(field.fieldId).toStrictEqual(TEST_JSON_FIELDS[0].id);
      // expect(field.fieldJson["name"]).toStrictEqual(TEST_JSON_FIELDS[0].name);
      expect(field).toBeInstanceOf(FsTreeField);
    });
  });

  /// ---------------------------------
});

//  "calculation":"[148149774] + [148149776] * 5"
const TEST_JSON_FIELD_LOGIC = {
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
  calculation: "",
  workflow_access: "write",
  default: "",
  section_text: "<p>The check boxes prevent this from showing.</p>",
  text_editor: "wysiwyg",
} as unknown;

const TEST_JSON_FIELD_CALC_STRING = {
  id: "147462597",
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
  logic: null,
  calculation: "[148149774] + [148149776] * 5",
  workflow_access: "write",
  default: "",
  section_text: "<p>The check boxes prevent this from showing.</p>",
  text_editor: "wysiwyg",
} as unknown;

const TEST_JSON_FIELDS = [
  TEST_JSON_FIELD_CALC_STRING,
  TEST_JSON_FIELD_LOGIC,
] as TFsFieldAnyJson[];
