import { FsTreeField } from "./FsTreeField";
import { TFsFieldAnyJson } from "../../types";
import { FsTreeLogic } from "./FsTreeLogic";
import { MultipleLogicTreeError } from "../../../errors/MultipleLogicTreeError";
import { FsTreeCalcString } from "./FsTreeCalcString";
import badCircuitFormJson from "../../../../test-dev-resources/form-json/5353031.json"; // 5353031
import fifthDegreeBadCircuitFormJson from "../../../../test-dev-resources/form-json/5375703.json"; // 5353031
import manyCalcLogicOperators from "../../../../test-dev-resources/form-json/5389250.json"; // 5353031
import { transform } from "typescript";
import { transformers } from "../../../transformers";
type RelationshipCategoryTypes =
  | "Dependency"
  | "mutualExclusive"
  | "Interdependent";
type RelationRecordType = {
  [Relation in RelationshipCategoryTypes]: string[];
};
type RelationAuditReport = {
  [fieldId: string]: RelationRecordType;
};

const getDependencyAudit = (fields: FsTreeField[]): RelationAuditReport => {
  const relations: RelationAuditReport = {};
  fields.forEach((fieldA) => {
    relations[fieldA.fieldId] = {
      Dependency: fieldA.getDependantFieldIds(),
      mutualExclusive: [],
      Interdependent: [],
    };

    Object.values(fields).forEach((fieldB) => {
      if (Object.is(fieldA, fieldB)) {
        return;
      }

      // const intersectFieldIds = fieldA.getInterdependentFieldIdsOf(fieldB);
      relations[fieldA.fieldId]["Interdependent"].push(
        ...fieldA.getInterdependentFieldIdsOf(fieldB)
      );
      // if (intersectFieldIds.length > 0) {
      //   interdependentRelations[`${fieldAId}:${fieldB.fieldId}`] =
      //     intersectFieldIds;
      // }
    });
  });

  return relations;
};

describe("FsTreeField", () => {
  let field: FsTreeField;
  beforeEach(() => {
    field = FsTreeField.fromFieldJson(
      transformers.fieldJson(TEST_JSON_FIELD as TFsFieldAnyJson)
    );
  });
  describe("Smoke Test", () => {
    it("Should be awesome", () => {
      expect(field).toBeInstanceOf(FsTreeField);

      // fieldLogic can/should have fieldId, maybe modified? "fieldId-logic"?
      // expect(tree.fieldId).toEqual("147462596");
      expect(field.fieldJson).toStrictEqual(TEST_JSON_FIELD);
    });
  });
  describe(".fieldJson", () => {
    let tree: FsTreeField;
    beforeEach(() => {
      tree = FsTreeField.fromFieldJson(
        transformers.fieldJson(TEST_JSON_FIELD as TFsFieldAnyJson)
        // TEST_JSON_FIELD as TFsFieldAnyJson
      );
    });

    it("Should be segment of the original json", () => {
      expect(tree.fieldJson).toStrictEqual(TEST_JSON_FIELD);
    });
    it.only("Should transform proper operators", () => {
      const complexTree = FsTreeField.fromFieldJson(
        transformers.fieldJson(
          manyCalcLogicOperators.fields[0] as unknown as TFsFieldAnyJson // this needs "transform", stringBoolean numericBoolean ,  etc
        )
      );

      //

      // should be awesome
    });
  });

  describe("evaluateWithValues({...values})", () => {
    it("Should return the value of the property matching fieldId (values.fieldId)", () => {
      expect(
        field.evaluateWithValues({ "147462596": "Hello World" })
      ).toStrictEqual("Hello World");
    });
    it("Should returned if no property matches.", () => {
      expect(field.evaluateWithValues({})).toBeUndefined();
    });
  });

  describe(".getDependantFields()", () => {
    it("should return all fieldIds of dependents (child)", () => {
      expect(field.getDependantFieldIds()).toStrictEqual([
        "147462595",
        "147462598",
        "147462600",
        "147462597",
        "148149774",
        "148149776",
      ]);
    });
  });
  describe(".isInterdependentOf(...)", () => {
    it("Should determine First Degree Interdependency.", () => {
      const fields = badCircuitFormJson.fields
        .map((fieldJson) => {
          const f = FsTreeField.fromFieldJson(
            transformers.fieldJson(fieldJson as unknown as TFsFieldAnyJson)
          );
          return f;
        })
        .reduce((prev, cur) => {
          prev[cur.fieldId] = cur;
          return prev;
        }, {} as { [fieldId: string]: FsTreeField });

      const badCircuit_A = fields["147462597"];
      const badCircuit_B = fields["147462595"];

      const x = badCircuit_A.isInterdependentOf(badCircuit_B);
      console.log({ badCircuit_A: badCircuit_A.getDependantFieldIds() });

      console.log({ badCircuit_A: badCircuit_A.getDependantFieldIds() });
      console.log({ badCircuit_B: badCircuit_B.getDependantFieldIds() });

      console.log({ fields });
    });

    //fifthDegreeBadCircuitFormJson
    it("Should Determine Fifth Degree Interdependency.", () => {
      const fields = fifthDegreeBadCircuitFormJson.fields
        .map((fieldJson) => {
          const f = FsTreeField.fromFieldJson(
            transformers.fieldJson(fieldJson as unknown as TFsFieldAnyJson)
          );
          return f;
        })
        .reduce((prev, cur) => {
          prev[cur.fieldId] = cur;
          return prev;
        }, {} as { [fieldId: string]: FsTreeField });

      const A = fields["148456734"].getDependantFieldIds();
      const B = fields["148456742"].getDependantFieldIds();

      const c = getDependencyAudit(Object.values(fields));

      // need to get an exhustive dependency tree (visitior?)
      //     what does the logicTree look like?  It should have children for each term
      // const interdependentRelations: { [relation: string]: string[] } = {};

      Object.entries(fields).forEach(([fieldAId, fieldA]) => {
        Object.values(fields).forEach((fieldB) => {
          if (Object.is(fieldA, fieldB)) {
            return;
          }

          const intersectFieldIds = fieldA.getInterdependentFieldIdsOf(fieldB);
        });
      });

      console.log({ fields });
    });
  });
  describe(".getLogicTree()", () => {
    class TestFsTreeField extends FsTreeField {
      getLogicTree(): FsTreeLogic | null {
        return super.getLogicTree();
      }
    }

    it("return null if there are no logic trees.", () => {
      const tree = new TestFsTreeField();
      expect(tree.getLogicTree()).toBeNull();
    });
    it("return null if there are no logic trees.", () => {
      const tree = TestFsTreeField.fromFieldJson(
        transformers.fieldJson(TEST_JSON_FIELD as TFsFieldAnyJson)
      ) as TestFsTreeField;

      expect(tree.getLogicTree()).toBeInstanceOf(FsTreeLogic);
    });
    it("Throw error if there is more than one logic tree.", () => {
      const extraLogicTree = TestFsTreeField.fromFieldJson(
        transformers.fieldJson(TEST_JSON_FIELD as TFsFieldAnyJson)
      );

      const subtreeConstructor = (fieldJson: TFsFieldAnyJson) =>
        FsTreeLogic.fromFieldJson(TEST_JSON_FIELD as TFsFieldAnyJson);

      FsTreeField.createSubtreeFromFieldJson(
        extraLogicTree,
        extraLogicTree.rootNodeId,
        transformers.fieldJson(TEST_JSON_FIELD as TFsFieldAnyJson),
        subtreeConstructor
      );
      FsTreeField.createSubtreeFromFieldJson(
        extraLogicTree,
        extraLogicTree.rootNodeId,
        transformers.fieldJson(TEST_JSON_FIELD as TFsFieldAnyJson),
        subtreeConstructor
      );

      const willThrow = () => {
        (extraLogicTree as TestFsTreeField).getLogicTree();
      };

      expect(willThrow).toThrow(MultipleLogicTreeError);
      expect(willThrow).toThrow(
        "field with id: '147462596' appears to have multiple logic tree(s) or multiple calc tree(s)."
      );
    });
  });
  describe(".getCalcStringTree()", () => {
    class TestFsTreeField extends FsTreeField {
      getCalcStringTree(): FsTreeCalcString | null {
        return super.getCalcStringTree();
      }
    }

    it("return null if there are no logic trees.", () => {
      const tree = new TestFsTreeField();
      expect(tree.getCalcStringTree()).toBeNull();
    });
    it("return null if there are no logic trees.", () => {
      const tree = TestFsTreeField.fromFieldJson(
        transformers.fieldJson(TEST_JSON_FIELD as TFsFieldAnyJson)
      ) as TestFsTreeField;

      expect(tree.getCalcStringTree()).toBeInstanceOf(FsTreeCalcString);
    });
    it("Throw error if there is more than one logic tree.", () => {
      const extraLogicTree = TestFsTreeField.fromFieldJson(
        transformers.fieldJson(TEST_JSON_FIELD as TFsFieldAnyJson)
      );

      const subtreeConstructor = (fieldJson: TFsFieldAnyJson) =>
        FsTreeCalcString.fromFieldJson(TEST_JSON_FIELD as TFsFieldAnyJson);

      FsTreeField.createSubtreeFromFieldJson(
        extraLogicTree,
        extraLogicTree.rootNodeId,
        transformers.fieldJson(TEST_JSON_FIELD as TFsFieldAnyJson),
        subtreeConstructor
      );
      FsTreeField.createSubtreeFromFieldJson(
        extraLogicTree,
        extraLogicTree.rootNodeId,
        transformers.fieldJson(TEST_JSON_FIELD as TFsFieldAnyJson),
        subtreeConstructor
      );

      const willThrow = () => {
        (extraLogicTree as TestFsTreeField).getCalcStringTree();
      };

      expect(willThrow).toThrow(MultipleLogicTreeError);
      expect(willThrow).toThrow(
        "field with id: '147462596' appears to have multiple logic tree(s) or multiple calc tree(s)."
      );
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
