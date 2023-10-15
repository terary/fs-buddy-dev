/* cspell:ignore unnegated */

import { FsTreeLogic } from "./FsTreeLogic";
import { AbstractFsTreeGeneric } from "./AbstractFsTreeGeneric";
import { TFsFieldAnyJson } from "../../types";
import fifthDegreeBadCircuitFormJson from "../../../../test-dev-resources/form-json/5375703.json";
import { TTreePojo } from "predicate-tree-advanced-poc/dist/src";
import {
  TFsFieldLogicCheckLeaf,
  TFsFieldLogicJunction,
  TFsFieldLogicNode,
  TFsJunctionOperators,
} from "../types";
import { NegateVisitor } from "./NegateVisitor";

describe("FsTreeLogic", () => {
  describe(".toPojoAt()", () => {
    let tree: FsTreeLogic;
    beforeEach(() => {
      tree = FsTreeLogic.fromFieldJson(TEST_JSON_FIELD as TFsFieldAnyJson);
    });
    it("Should produce Pojo to sufficient to serial tree.", () => {
      const pojo = tree.toPojoAt(undefined, false);
      expect(JSON.stringify(pojo)).toStrictEqual(
        JSON.stringify(test_field_pojo)
      );
    });
  });
  describe(".fromPojo()<FsTreeLogic, TFsFieldLogicNode>", () => {
    it("Should inflate a tree from Pojo.", () => {
      const tree = FsTreeLogic.fromPojo<FsTreeLogic, TFsFieldLogicNode>(
        test_field_pojo as unknown as TTreePojo<TFsFieldLogicNode>
      );
      const rootBranch = tree.getChildContentAt(
        tree.rootNodeId
      ) as TFsFieldLogicJunction<TFsJunctionOperators>;
      expect(tree).toBeInstanceOf(FsTreeLogic);
      expect(rootBranch.action).toStrictEqual("show");
      expect(rootBranch.conditional).toStrictEqual("all");
      const children = tree.getChildrenContentOf(tree.rootNodeId);
      expect(children.length).toEqual(4);
    });
  });
  describe(".clone()", () => {
    it("Should create carbon copy.  The contents are not references to original content.", () => {
      const tree = FsTreeLogic.fromPojo<FsTreeLogic, TFsFieldLogicNode>(
        test_field_pojo as unknown as TTreePojo<TFsFieldLogicNode>
      ) as FsTreeLogic;

      const clone = tree.cloneAt();
      const clone2 = clone.cloneAt();

      expect(clone.toPojoAt(undefined, false)).toStrictEqual(
        tree.toPojoAt(undefined, false)
      );
      expect(clone2.toPojoAt(undefined, false)).toStrictEqual(
        tree.toPojoAt(undefined, false)
      );

      expect(
        JSON.stringify(clone.getChildContentAt(clone.rootNodeId))
      ).toStrictEqual(JSON.stringify(tree.getChildContentAt(tree.rootNodeId)));

      expect(clone).not.toBe(tree);
      expect(clone.getChildContentAt(clone.rootNodeId)).not.toBe(
        tree.getChildContentAt(tree.rootNodeId)
      );
      expect(tree.getChildContentAt(tree.rootNodeId)).toBe(
        tree.getChildContentAt(tree.rootNodeId)
      );
      expect(clone).toBeInstanceOf(FsTreeLogic);
      expect(
        JSON.stringify(tree.getChildrenContentOf(tree.rootNodeId))
      ).toStrictEqual(
        JSON.stringify(clone.getChildrenContentOf(clone.rootNodeId))
      );
    });
  });
  describe(".negate()", () => {
    it("Should negate a tree", () => {
      const tree = FsTreeLogic.fromFieldJson(
        TEST_JSON_FIELD as TFsFieldAnyJson
      );
      const negatedClone = tree.getNegatedClone();
      const unnegatedClone = negatedClone.getNegatedClone();
      expect(unnegatedClone.toPojoAt(undefined, false)).toStrictEqual(
        tree.toPojoAt(undefined, false)
      );

      const parentNodeContent = negatedClone.getChildContentAtOrThrow(
        negatedClone.rootNodeId
      ) as TFsFieldLogicJunction<TFsJunctionOperators>;

      expect(parentNodeContent.conditional).toEqual("any");
      const children = negatedClone.getChildrenContentOf(
        negatedClone.rootNodeId
      ) as TFsFieldLogicCheckLeaf[];

      const childrenOperators = children.map((child) => child.condition);
      expect(childrenOperators).toStrictEqual([
        "notequals",
        "notequals",
        "notequals",
        "notequals",
      ]);
    });
    it("Should be symmetric operation", () => {
      const tree = FsTreeLogic.fromPojo(
        test_field_pojo as unknown as TTreePojo<TFsFieldLogicNode>
      ) as FsTreeLogic;

      const negatedClone = tree.getNegatedClone();
      const unnegatedClone = negatedClone.getNegatedClone();

      expect(unnegatedClone.toPojoAt(undefined, false)).toStrictEqual(
        tree.toPojoAt(undefined, false)
      );

      const parentNodeContent = negatedClone.getChildContentAtOrThrow(
        negatedClone.rootNodeId
      ) as TFsFieldLogicJunction<TFsJunctionOperators>;

      expect(parentNodeContent.conditional).toEqual("any");
      const children = negatedClone.getChildrenContentOf(
        negatedClone.rootNodeId
      ) as TFsFieldLogicCheckLeaf[];

      const childrenOperators = children.map((child) => child.condition);
      expect(childrenOperators).toStrictEqual([
        "notequals",
        "notequals",
        "notequals",
        "notequals",
      ]);
    });
  });
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

const test_field_pojo = {
  "147462596": {
    parentId: "147462596",
    nodeContent: {
      fieldId: "147462596",
      conditional: "all",
      action: "show",
      logicJson: {
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
  },
  "147462596:0": {
    parentId: "147462596",
    nodeContent: {
      fieldId: "147462595",
      fieldJson: {
        field: "147462595",
        condition: "equals",
        option: "True",
      },
      condition: "equals",
      option: "True",
    },
  },
  "147462596:1": {
    parentId: "147462596",
    nodeContent: {
      fieldId: "147462598",
      fieldJson: {
        field: 147462598,
        condition: "equals",
        option: "True",
      },
      condition: "equals",
      option: "True",
    },
  },
  "147462596:2": {
    parentId: "147462596",
    nodeContent: {
      fieldId: "147462600",
      fieldJson: {
        field: 147462600,
        condition: "equals",
        option: "True",
      },
      condition: "equals",
      option: "True",
    },
  },
  "147462596:3": {
    parentId: "147462596",
    nodeContent: {
      fieldId: "147462597",
      fieldJson: {
        field: 147462597,
        condition: "equals",
        option: "True",
      },
      condition: "equals",
      option: "True",
    },
  },
};
