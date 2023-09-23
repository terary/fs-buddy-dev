import { FsTreeLogic } from "./FsTreeLogic";
import { AbstractFsTreeGeneric } from "./AbstractFsTreeGeneric";
import { TFsFieldAnyJson } from "../../types";
import fifthDegreeBadCircuitFormJson from "../../../../test-dev-resources/form-json/5375703.20230922.json";

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
      expect(tree.getDependantFieldIds().sort()).toStrictEqual(
        ["147462595", "147462597", "147462598", "147462600"].sort()
      );
    });
  });
  describe(".fieldJson", () => {
    let tree: FsTreeLogic;
    beforeEach(() => {
      tree = FsTreeLogic.fromFieldJson(TEST_JSON_FIELD as TFsFieldAnyJson);
    });

    it("Should be segment of the original json", () => {
      expect(tree.fieldJson).toStrictEqual(TEST_JSON_FIELD.logic);

      const childrenContent = tree.getChildrenContentOf(tree.rootNodeId);
      // maybe should sort this?
      expect(childrenContent).toStrictEqual([
        {
          fieldId: "147462595",
          fieldJson: {
            field: "147462595",
            condition: "equals",
            option: "True",
          },
          condition: "equals",
          option: "True",
        },
        {
          fieldId: "147462598",
          fieldJson: {
            field: 147462598,
            condition: "equals",
            option: "True",
          },
          condition: "equals",
          option: "True",
        },
        {
          fieldId: "147462600",
          fieldJson: {
            field: 147462600,
            condition: "equals",
            option: "True",
          },
          condition: "equals",
          option: "True",
        },
        {
          fieldId: "147462597",
          fieldJson: {
            field: 147462597,
            condition: "equals",
            option: "True",
          },
          condition: "equals",
          option: "True",
        },
      ]);
    });
  });

  describe.skip(".evaluateWithValues(...)", () => {
    it("Should return true when all conditions are true.", () => {
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
    describe.skip(".evaluateShowHide(...)", () => {
      let tree: FsTreeLogic;
      const valueJson = {
        "147462595": "True",
        "147462598": "True",
        "147462600": "True",
        "147462597": "True",
      };
      Object.freeze(valueJson);
      beforeEach(() => {
        const tree = FsTreeLogic.fromFieldJson(
          TEST_JSON_FIELD as TFsFieldAnyJson
        );
      });

      it('Should return "show" given all logic evaluates to true and action="show".', () => {
        const tree = FsTreeLogic.fromFieldJson(
          TEST_JSON_FIELD as TFsFieldAnyJson
        );
        expect(tree.evaluateWithValues(valueJson)).toStrictEqual(true);
        expect(tree.evaluateShowHide(valueJson)).toStrictEqual("show");
      });
      it('Should return "show" given all logic evaluates to true and action="hide".', () => {
        const hideLogicJson = { ...TEST_JSON_FIELD };
        // @ts-ignore
        hideLogicJson.logic.action = "hide";
        const tree = FsTreeLogic.fromFieldJson(
          hideLogicJson as TFsFieldAnyJson
        );
        expect(tree.evaluateWithValues(valueJson)).toStrictEqual(true);
        expect(tree.evaluateShowHide(valueJson)).toStrictEqual("hide");
      });
      it("Should return null given logic evaluates to false.", () => {
        // *tmc* - verify that FS 'logic' should return null if logic evaluates false
        //        I guess, make sure it's not supposed to return the opposite show|hide
        //
        // confirmed!
        //  the 'action' only happens if the logic evaluates to true
        //  if logic evaluates to false - nothing happens
        //

        const falseValues = {
          ...valueJson,
          ...{ "147462595": "False" },
        };
        const tree = FsTreeLogic.fromFieldJson(TEST_JSON_FIELD);
        expect(tree.evaluateWithValues(falseValues)).toStrictEqual(false);
        expect(tree.evaluateShowHide(falseValues)).toStrictEqual(null);
      });
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
  describe("Typical Use-case", () => {
    it("Should create interdependencies.", () => {
      const fields =
        fifthDegreeBadCircuitFormJson.fields as unknown as TFsFieldAnyJson[];
      const logicTrees = fields
        .map((fieldJson) => {
          if (fieldJson.logic) {
            return {
              [fieldJson.id || "_FIELD_ID"]:
                FsTreeLogic.fromFieldJson(fieldJson),
            };
          }
        })
        .filter((field) => field); // removed the undefined
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
