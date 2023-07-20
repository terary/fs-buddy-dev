import { FsTreeLogic } from "./FsTreeLogic";
import { AbstractFsTreeGeneric } from "./AbstractFsTreeGeneric";
import { TFsFieldAnyJson } from "../../types";

describe("FsTreeLogic", () => {
  describe("Creation", () => {
    it("Should be awesome", () => {
      // const tree = new FsTreeLogic("_root_seed_");
      const tree = FsTreeLogic.fromFieldJson(
        TEST_JSON_FIELD as TFsFieldAnyJson
      );
      expect(tree).toBeInstanceOf(AbstractFsTreeGeneric);

      // fieldLogic can/should have fieldId, maybe modified? "fieldId-logic"?
      // expect(tree.fieldId).toEqual("147462596");

      expect(tree.fieldJson).toStrictEqual(
        (TEST_JSON_FIELD as TFsFieldAnyJson).logic
      );
      expect(tree.getDependantFields().sort()).toStrictEqual(
        ["147462595", "147462597", "147462598", "147462600"].sort()
      );
    });
  });
  describe(".evaluateWithValues(...)", () => {
    it("Should return the value of the calculation given field values", () => {
      const valueJson = {
        "147462595": "True",
        "147462598": "True",
        "147462600": "True",
        "147462597": "True",
      };

      const tree = FsTreeLogic.fromFieldJson(
        TEST_JSON_FIELD as TFsFieldAnyJson
      );
      expect(tree.evaluateWithValues(valueJson)).toStrictEqual(true);
    });
    it("Should return false if any condition evaluates to false.", () => {
      const valueJson = {
        "147462595": "True",
        "147462598": "True",
        "147462600": "NOT_TRUE",
        "147462597": "True",
      };
      const tree = FsTreeLogic.fromFieldJson(
        TEST_JSON_FIELD as TFsFieldAnyJson
      );
      expect(tree.evaluateWithValues(valueJson)).toStrictEqual(false);
    });
    it("Should return true if any condition evaluates to true.", () => {
      const valueJson = {
        "147462595": "True",
        "147462598": "_NOT_TRUE_",
        "147462600": "True",
        "147462597": "True",
      };

      const tree = FsTreeLogic.fromFieldJson(
        TEST_JSON_FIELD_OR as TFsFieldAnyJson
      );
      expect(tree.evaluateWithValues(valueJson)).toStrictEqual(true);
    });
    it("Should return false if all condition evaluates to false.", () => {
      const valueJson = {
        "147462595": "_NOT_TRUE_",
        "147462598": "_NOT_TRUE_",
        "147462600": "_NOT_TRUE_",
        "147462597": "_NOT_TRUE_",
      };

      const tree = FsTreeLogic.fromFieldJson(
        TEST_JSON_FIELD_OR as TFsFieldAnyJson
      );
      expect(tree.evaluateWithValues(valueJson)).toStrictEqual(false);
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

const TEST_JSON_FIELD_OR = {
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
    conditional: "any",
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
