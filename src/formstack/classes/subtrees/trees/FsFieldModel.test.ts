import { FsFieldModel } from "./FsFieldModel";
import { TFsFieldAnyJson } from "../../types";
import { FsFieldLogicModel } from "./FsFieldLogicModel";
import type { TFsFieldAny, TFsFieldType } from "../../../type.field";
// TFsFieldType
import { MultipleLogicTreeError } from "../../../errors/MultipleLogicTreeError";
import { FsTreeCalcString } from "./FsTreeCalcString";
import badCircuitFormJson from "../../../../test-dev-resources/form-json/5353031.json";
import allFieldTypesFormJson from "../../../../test-dev-resources/form-json/allFields.json";

import fifthDegreeBadCircuitFormJson from "../../../../test-dev-resources/form-json/5375703.json"; // 5353031
import manyCalcLogicOperators from "../../../../test-dev-resources/form-json/5389250.json"; // 5353031
import { transform } from "typescript";
import { transformers } from "../../../transformers";
// import { InvalidEvaluation } from "../../InvalidEvaluation";
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
const fieldIdByType: { [dataType in TFsFieldType]: string } = {
  text: "147738154",
  textarea: "147738155",
  name: "147738156",
  address: "147738157",
  email: "147738158",
  phone: "147738159",
  number: "147738160",
  select: "147738162",
  radio: "147738163",
  checkbox: "147738164",
  creditcard: "147738165",
  datetime: "147738166",
  file: "147738167",
  matrix: "147738168",
  richtext: "147738169",
  embed: "147738170",
  product: "147738171",
  signature: "147738172",
  rating: "147738173",
  section: "149279532",
  ///
  // "select": "147738161",
  // "147887088": "text", (done)
  // "148008076": "text", (done)
  // "148111228": "checkbox", (done)
  // "148113605": "embed",
};

const getDependencyAudit = (fields: FsFieldModel[]): RelationAuditReport => {
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

describe("FsFieldModel", () => {
  let field: FsFieldModel;
  beforeEach(() => {
    field = FsFieldModel.fromFieldJson(
      transformers.fieldJson(TEST_JSON_FIELD as TFsFieldAnyJson)
    );
  });
  describe("Smoke Test", () => {
    it("Should be awesome", () => {
      expect(field).toBeInstanceOf(FsFieldModel);
      expect(field.fieldJson).toStrictEqual(TEST_JSON_FIELD);
    });
  });
  describe(".fieldJson", () => {
    let tree: FsFieldModel;
    beforeEach(() => {
      tree = FsFieldModel.fromFieldJson(
        transformers.fieldJson(TEST_JSON_FIELD as TFsFieldAnyJson)
        // TEST_JSON_FIELD as TFsFieldAnyJson
      );
    });

    it("Should be segment of the original json", () => {
      expect(tree.fieldJson).toStrictEqual(TEST_JSON_FIELD);
    });
    it.skip("Should transform proper operators", () => {
      const complexTree = FsFieldModel.fromFieldJson(
        transformers.fieldJson(
          manyCalcLogicOperators.fields[0] as unknown as TFsFieldAnyJson // this needs "transform", stringBoolean numericBoolean ,  etc
        )
      );
    });
  });

  describe("evaluateWithValues({...values})", () => {
    it("Should return the value of the property matching fieldId (values.fieldId)", () => {
      const checkboxField = FsFieldModel.fromFieldJson(
        transformers.fieldJson(getFieldJsonByIdFromAllFields("148111228"))
      );

      expect(
        field.evaluateWithValues({ "147462596": "Hello World" })
      ).toStrictEqual("Hello World");
    });
    it("Should returned if no property matches.", () => {
      expect(field.evaluateWithValues({})).toBeUndefined();
    });

    describe("multi-select field types (checkbox, radio, select)", () => {
      const checkboxFieldId = "147738164";
      const radioFieldId = "147738163";
      const selectFieldId = "147738161";
      [checkboxFieldId, radioFieldId, selectFieldId].forEach((fieldId) => {
        it("Should return the selected option", () => {
          const checkboxField = FsFieldModel.fromFieldJson(
            transformers.fieldJson(getFieldJsonByIdFromAllFields(fieldId))
          );
          expect(
            checkboxField.evaluateWithValues({ [fieldId]: "Option2" })
          ).toStrictEqual({ [fieldId]: "Option2" });
        });

        // it("Should return instance of InvalidEvaluation for invalid option.", () => {
        //   const multiselectField = FsFieldModel.fromFieldJson(
        //     transformers.fieldJson(getFieldJsonByIdFromAllFields(fieldId))
        //   );
        //   const valuation = multiselectField.evaluateWithValues<
        //     string
        //   >({
        //     [fieldId]: "_NOT_A_VALID_OPTION_",
        //   });

        //   expect(valuation[fieldId]).toBeInstanceOf(InvalidEvaluation);
        //   expect(
        //     (valuation[fieldId] as InvalidEvaluation).message
        //   ).toStrictEqual("Selected option not found.");
        // });
      });

      it("Should return the selected value when using value/label options", () => {
        const multiselectField = FsFieldModel.fromFieldJson(
          transformers.fieldJson(getFieldJsonByIdFromAllFields("147738162"))
        );
        expect(
          multiselectField.evaluateWithValues({ ["147738162"]: "OPT02" })
        ).toStrictEqual({ ["147738162"]: "OPT02" });
      });
    });
    describe("rating, number", () => {
      [
        fieldIdByType["rating"],
        // fieldIdByType["number"],
      ].forEach((fieldId) => {
        it("Should return a number given a number.", () => {
          // setup
          const textField = FsFieldModel.fromFieldJson(
            transformers.fieldJson(getFieldJsonByIdFromAllFields(fieldId))
          );

          // exercise
          const evaluationResult = textField.evaluateWithValues({
            [fieldId]: 3,
          });

          // result
          expect(evaluationResult).toStrictEqual({
            [fieldId]: 3,
          });
        });
        it("Should be tolerant of string/number.", () => {
          // setup
          const textField = FsFieldModel.fromFieldJson(
            transformers.fieldJson(getFieldJsonByIdFromAllFields(fieldId))
          );

          // exercise
          const evaluationResult = textField.evaluateWithValues({
            [fieldId]: "3",
          });

          // result
          expect(evaluationResult).toStrictEqual({
            [fieldId]: 3,
          });
        });
      });
    });
    describe("text", () => {
      const shortAnswerFieldId = "148008076";
      const dateTimeFieldId = "147738166";
      const numberFieldId = "147738160";
      const emailFieldId = "147738158";
      const rattingFieldId = "147738173";

      // case "text":
      // case "number":
      // case "email":
      // case "datetime": // ?
      // case "rating": // ?

      [
        shortAnswerFieldId,
        // dateTimeFieldId,
        // numberFieldId,
        emailFieldId,
        // rattingFieldId,
      ].forEach((fieldId) => {
        it("Should return the given value", () => {
          // setup
          const textField = FsFieldModel.fromFieldJson(
            transformers.fieldJson(getFieldJsonByIdFromAllFields(fieldId))
          );

          // exercise
          const evaluationResult = textField.evaluateWithValues({
            [fieldId]: "Some ordinary text",
          });

          // result
          expect(evaluationResult).toStrictEqual({
            [fieldId]: "Some ordinary text",
          });
        });
      });

      it("Should return the selected value when using value/label options", () => {
        const checkboxField = FsFieldModel.fromFieldJson(
          transformers.fieldJson(getFieldJsonByIdFromAllFields("147738162"))
        );
        expect(
          checkboxField.evaluateWithValues({ ["147738162"]: "OPT02" })
        ).toStrictEqual({ ["147738162"]: "OPT02" });
      });
    });

    describe("Address", () => {
      const fieldId = fieldIdByType["address"];
      it("Should return parsed Address field Record", () => {
        const fieldJson = getFieldJsonByIdFromAllFields(fieldId);
        // setup
        const textField = FsFieldModel.fromFieldJson(
          transformers.fieldJson(getFieldJsonByIdFromAllFields(fieldId))
        );

        // exercise
        const evaluationResult = textField.evaluateWithValues({
          [fieldId]:
            "address = 123 Walt Disney Way 0\naddress2 = Micky Mouse Hut #2, 4\ncity = Disney World 7\nstate = DE\nzip = 04240",
        });

        // result
        expect(evaluationResult).toStrictEqual({
          [fieldId]: {
            address: "123 Walt Disney Way 0",
            address2: "Micky Mouse Hut #2, 4",
            city: "Disney World 7",
            state: "DE",
            zip: "04240",
          },
        });
      });
      it("Should return empty object if there are no subfields", () => {
        const fieldJson = getFieldJsonByIdFromAllFields(fieldId);
        // setup
        const textField = FsFieldModel.fromFieldJson(
          transformers.fieldJson(getFieldJsonByIdFromAllFields(fieldId))
        );

        // exercise
        const evaluationResult = textField.evaluateWithValues({
          [fieldId]: "Some ordinary text",
        });

        // result
        expect(evaluationResult).toStrictEqual({
          [fieldId]: {},
        });
      });
    });

    // Abstract away commonality between Name and Address
    // then work on Matrix, see if that would benefit here
    describe("Name", () => {
      const fieldId = fieldIdByType["name"];
      it("Should return parsed Name field Record", () => {
        const fieldJson = getFieldJsonByIdFromAllFields(fieldId);
        // setup
        const textField = FsFieldModel.fromFieldJson(
          transformers.fieldJson(getFieldJsonByIdFromAllFields(fieldId))
        );

        // exercise
        const evaluationResult = textField.evaluateWithValues({
          [fieldId]: "first = First Name 439\nlast = Last Name 925",
        });

        // result
        expect(evaluationResult).toStrictEqual({
          [fieldId]: {
            first: "First Name 439",
            last: "Last Name 925",
          },
        });
      });
      it("Should return empty object if there are no subfields", () => {
        const fieldJson = getFieldJsonByIdFromAllFields(fieldId);
        // setup
        const textField = FsFieldModel.fromFieldJson(
          transformers.fieldJson(getFieldJsonByIdFromAllFields(fieldId))
        );

        // exercise
        const evaluationResult = textField.evaluateWithValues({
          [fieldId]: "Some ordinary text",
        });

        // result
        expect(evaluationResult).toStrictEqual({
          [fieldId]: {},
        });
      });
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
    //fifthDegreeBadCircuitFormJson
    it("Should Determine Fifth Degree Interdependency.", () => {
      const fields = fifthDegreeBadCircuitFormJson.fields
        .map((fieldJson) => {
          const f = FsFieldModel.fromFieldJson(
            transformers.fieldJson(fieldJson as unknown as TFsFieldAnyJson)
          );
          return f;
        })
        .reduce((prev, cur) => {
          prev[cur.fieldId] = cur;
          return prev;
        }, {} as { [fieldId: string]: FsFieldModel });

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
    });
  });
  describe(".getLogicTree()", () => {
    class TestFsFieldModel extends FsFieldModel {
      getLogicTree(): FsFieldLogicModel | null {
        return super.getLogicTree();
      }
    }

    it("return null if there are no logic trees.", () => {
      const tree = new TestFsFieldModel();
      expect(tree.getLogicTree()).toBeNull();
    });
    it("return null if there are no logic trees.", () => {
      const tree = TestFsFieldModel.fromFieldJson(
        transformers.fieldJson(TEST_JSON_FIELD as TFsFieldAnyJson)
      ) as TestFsFieldModel;

      expect(tree.getLogicTree()).toBeInstanceOf(FsFieldLogicModel);
    });
    it('Should return negated tree if action is "Hide".', () => {
      const tree = TestFsFieldModel.fromFieldJson(
        transformers.fieldJson(TEST_JSON_FIELD as TFsFieldAnyJson)
      ) as TestFsFieldModel;

      expect(tree.getLogicTree()).toBeInstanceOf(FsFieldLogicModel);
    });
    it("Throw error if there is more than one logic tree.", () => {
      const extraLogicTree = TestFsFieldModel.fromFieldJson(
        transformers.fieldJson(TEST_JSON_FIELD as TFsFieldAnyJson)
      );

      const subtreeConstructor = (fieldJson: TFsFieldAny) =>
        FsFieldLogicModel.fromFieldJson(TEST_JSON_FIELD as TFsFieldAnyJson);

      FsFieldModel.createSubtreeFromFieldJson(
        extraLogicTree,
        extraLogicTree.rootNodeId,
        transformers.fieldJson(TEST_JSON_FIELD as TFsFieldAnyJson),
        subtreeConstructor
      );
      FsFieldModel.createSubtreeFromFieldJson(
        extraLogicTree,
        extraLogicTree.rootNodeId,
        transformers.fieldJson(TEST_JSON_FIELD as TFsFieldAnyJson),
        subtreeConstructor
      );

      const willThrow = () => {
        (extraLogicTree as TestFsFieldModel).getLogicTree();
      };

      expect(willThrow).toThrow(MultipleLogicTreeError);
      expect(willThrow).toThrow(
        "field with id: '147462596' appears to have multiple logic tree(s) or multiple calc tree(s)."
      );
    });
  });
  describe(".getCalcStringTree()", () => {
    class TestFsFieldModel extends FsFieldModel {
      getCalcStringTree(): FsTreeCalcString | null {
        return super.getCalcStringTree();
      }
    }

    it("return null if there are no logic trees.", () => {
      const tree = new TestFsFieldModel();
      expect(tree.getCalcStringTree()).toBeNull();
    });
    it("return null if there are no logic trees.", () => {
      const tree = TestFsFieldModel.fromFieldJson(
        transformers.fieldJson(TEST_JSON_FIELD as TFsFieldAnyJson)
      ) as TestFsFieldModel;

      expect(tree.getCalcStringTree()).toBeInstanceOf(FsTreeCalcString);
    });
    it("Throw error if there is more than one logic tree.", () => {
      const extraLogicTree = TestFsFieldModel.fromFieldJson(
        transformers.fieldJson(TEST_JSON_FIELD as TFsFieldAnyJson)
      );

      const subtreeConstructor = (fieldJson: TFsFieldAny) =>
        FsTreeCalcString.fromFieldJson(TEST_JSON_FIELD as TFsFieldAnyJson);

      FsFieldModel.createSubtreeFromFieldJson(
        extraLogicTree,
        extraLogicTree.rootNodeId,
        transformers.fieldJson(TEST_JSON_FIELD as TFsFieldAnyJson),
        subtreeConstructor
      );
      FsFieldModel.createSubtreeFromFieldJson(
        extraLogicTree,
        extraLogicTree.rootNodeId,
        transformers.fieldJson(TEST_JSON_FIELD as TFsFieldAnyJson),
        subtreeConstructor
      );

      const willThrow = () => {
        (extraLogicTree as TestFsFieldModel).getCalcStringTree();
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

const getFieldJsonByIdFromAllFields = (fieldId: string) => {
  const fieldJson = allFieldTypesFormJson.fields.find(
    (fieldJson) => fieldJson.id === fieldId
  );

  if (fieldJson === undefined) {
    throw Error(`Could not find field with id: '${fieldId}'`);
  }

  return fieldJson as unknown as TFsFieldAnyJson;
};
