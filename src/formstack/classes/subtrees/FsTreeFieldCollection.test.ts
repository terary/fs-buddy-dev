import { FsTreeFieldCollection } from "./FsTreeFieldCollection";
import { TFsFieldAnyJson } from "../types";
import { FsTreeField } from "./trees/FsTreeField";
import circularAndInterdependentJson from "../../../test-dev-resources/form-json/5375703.json";
import { TFsFieldAny } from "../../type.field";
import { FsTreeLogic } from "./trees/FsTreeLogic";
import { FsCircularDependencyNode } from "./trees/nodes/FsCircularDependencyNode";
import { FsLogicLeafNode } from "./trees/nodes/FsLogicLeafNode";

describe("FsTreeFieldCollection", () => {
  describe("Creation", () => {
    it("Should be awesome", () => {
      const tree = FsTreeFieldCollection.fromFieldJson(
        // fields: [TEST_JSON_FIELD_CALC_STRING],
        // fields: [TEST_JSON_FIELD_LOGIC],
        TEST_JSON_FIELDS as TFsFieldAnyJson[]
      );
      expect(tree).toBeInstanceOf(FsTreeFieldCollection);

      // tree has 3 child nodes, 2 calc and 1 logic;
      // It should have two nodes Fields 1 and 2
      //    Field should have tree(s) logic and/or calls
    });
  });

  // I *think*,  I think there is root node and plus 1?  Should root not be null??
  describe(".evaluateWithValues(...)", () => {
    it.only("Should return the value of the calculation given field values", () => {
      const tree = FsTreeFieldCollection.fromFieldJson([
        TEST_JSON_FIELD_SIMPLE,
      ] as TFsFieldAnyJson[]);
      const values = {
        // "147462596": "fieldLogic",
        // "147462597": "calc",
        "148136237": "Show",
      };
      expect(tree.evaluateWithValues(values)).toStrictEqual(38);
    });
  });

  /// --------------------------------
  describe(".getFieldTreeByFieldId(...)", () => {
    it("Should be awesome", () => {
      const tree = FsTreeFieldCollection.fromFieldJson(TEST_JSON_FIELDS);
      const field_0 = tree.getFieldTreeByFieldId(TEST_JSON_FIELDS[0].id || "");
      const field_1 = tree.getFieldTreeByFieldId(TEST_JSON_FIELDS[1].id || "");
      expect(field_0?.fieldId).toStrictEqual(TEST_JSON_FIELDS[0].id);
      expect(field_1?.fieldId).toStrictEqual(TEST_JSON_FIELDS[1].id);
      // expect(field.fieldJson["name"]).toStrictEqual(TEST_JSON_FIELDS[0].name);
      expect(field_0).toBeInstanceOf(FsTreeField);
      expect(field_1).toBeInstanceOf(FsTreeField);
    });
  });

  describe(".getFieldsBySection()", () => {
    it("Should be awesome", () => {
      const tree = FsTreeFieldCollection.fromFieldJson(
        circularAndInterdependentJson.fields as unknown as TFsFieldAnyJson[]
      );
      const sectionField = tree.getFieldTreeByFieldId(
        "148509465"
      ) as FsTreeField;
      const fieldsInSection = tree.getFieldsBySection(sectionField);
      const fieldIdsInSection = fieldsInSection.map((field) => field.fieldId);
      expect(fieldIdsInSection.sort()).toStrictEqual(
        [
          "148509470",
          "148509474",
          "148509475",
          "148509476",
          "148509477",
          "148509478",
          "148509721",
        ].sort()
      );
    });
  });

  describe(".getFieldIdsWithCircularLogic()", () => {
    it("Should return fieldIds that have circular logic", () => {
      const tree = FsTreeFieldCollection.fromFieldJson(
        circularAndInterdependentJson.fields as unknown as TFsFieldAnyJson[]
      );
      expect(tree.getFieldIdsWithCircularLogic()).toStrictEqual([
        "148456734",
        "148456739",
        "148456740",
        "148456741",
        "148456742",
        "148604161",
        "148604234",
        "148604235",
        "148604236",
      ]);
    });
  });
  describe("aggregateLogicTree", () => {
    it("Should return tree with one leaf node if there is no logic.", () => {
      const tree = FsTreeFieldCollection.fromFieldJson(
        circularAndInterdependentJson.fields as unknown as TFsFieldAnyJson[]
      );
      const noLogicField = tree.aggregateLogicTree("148456700");
      expect(noLogicField.getTreeContentAt().length).toBe(1);
      expect(
        noLogicField.getChildContentAt(noLogicField.rootNodeId)
      ).toBeInstanceOf(FsLogicLeafNode);
    });
    it("Should return the full tree.", () => {
      // two leafs
      const tree = FsTreeFieldCollection.fromFieldJson(
        circularAndInterdependentJson.fields as unknown as TFsFieldAnyJson[]
      );
      const agInterdependentSection = tree.aggregateLogicTree("148509465");
      const agTreeCircularRefA = tree.aggregateLogicTree("148456734");
      const agTreeCircularRefB = tree.aggregateLogicTree("148456742");

      const agBigDipper = tree.aggregateLogicTree("148604161");
      const agLittleDipperCircular = tree.aggregateLogicTree("148604236");

      // This matched the internal field dependencyIds
      // there is a null to be resolve
      // this *needs* to be subclassed maybe facade
      // this requires stricter typing to work properly (intensive use of instance of)
      const counts = {
        agInterdependentSection: agInterdependentSection.getDependantFieldIds(),
        agTreeCircularRefA: agTreeCircularRefA.getDependantFieldIds(),
        agTreeCircularRefB: agTreeCircularRefB.getDependantFieldIds(),
        agBigDipper: agBigDipper.getDependantFieldIds(),
      };

      // // These are not getting loaded in correctly.
      // // the logic . checks are never internalized, its always the same rootNodeContent

      const circularRefNodesA = agTreeCircularRefA.getCircularLogicNodes();
      expect(circularRefNodesA.length).toEqual(1);
      expect(circularRefNodesA[0]).toBeInstanceOf(FsCircularDependencyNode);
      expect(circularRefNodesA[0].dependentChainFieldIds).toStrictEqual([
        "148456734",
        "148456742",
        "148456741",
        "148456740",
        "148456739",
        "148456734",
      ]);
      const circularRefNodesB = agTreeCircularRefB.getCircularLogicNodes();
      expect(circularRefNodesB[0].dependentChainFieldIds).toStrictEqual([
        "148456742",
        "148456741",
        "148456740",
        "148456739",
        "148456734",
        "148456742",
      ]);

      const agBigDipperCircularRefNodes = agBigDipper.getCircularLogicNodes();
      expect(
        agBigDipperCircularRefNodes[0].dependentChainFieldIds
      ).toStrictEqual([
        "148604161", // it's here in the list because big dipper's handle is 148604161
        "148604236",
        "148604235",
        "148604234",
        "148604236",
      ]);

      const agLittleDipperCircularRefNodes =
        agLittleDipperCircular.getCircularLogicNodes();
      expect(
        agLittleDipperCircularRefNodes[0].dependentChainFieldIds
      ).toStrictEqual([
        // "148604161", not in the list because chain starts after the handle
        "148604236",
        "148604235",
        "148604234",
        "148604236",
      ]);
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

const TEST_JSON_FIELD_SIMPLE = {
  id: "148136237",
  label: "ShowHide",
  hide_label: "0",
  description: "",
  name: "showhide",
  type: "select",
  options: [
    { label: "Hide", value: "Hide", imageUrl: null },
    { label: "Show", value: "Show", imageUrl: null },
  ],
  required: "0",
  uniq: "0",
  hidden: "0",
  readonly: "0",
  colspan: "1",
  sort: "2",
  logic: null,
  calculation: "",
  workflow_access: "write",
  default: "",
  select_size: 1,
  option_layout: "vertical",
  option_other: 0,
  randomize_options: 0,
  option_store: "value",
  option_show_values: 0,
} as unknown;

const TEST_JSON_FIELDS = [
  TEST_JSON_FIELD_CALC_STRING,
  TEST_JSON_FIELD_LOGIC,
] as TFsFieldAnyJson[];
