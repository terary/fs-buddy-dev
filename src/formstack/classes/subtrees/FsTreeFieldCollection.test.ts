import { FsTreeFieldCollection } from "./FsTreeFieldCollection";
import { TFsFieldAnyJson } from "../types";
import { FsTreeField } from "./trees/FsTreeField";

import circularAndInterdependentJson from "../../../test-dev-resources/form-json/5375703.json";
// import circularAndInterdependentJson from "../../../test-dev-resources/form-json/5375703.20230922.json";
import submissionWithAllFieldsJson from "../../../test-dev-resources/submission-json/1129952515-form5358471.json";

import { TFsFieldAny } from "../../type.field";
import { FsTreeLogic } from "./trees/FsTreeLogic";
import { FsCircularDependencyNode } from "./trees/nodes/FsCircularDependencyNode";
import { FsLogicLeafNode } from "./trees/nodes/FsLogicLeafNode";
import formWithAllFieldsJson from "../../../test-dev-resources/form-json/5358471.json";
import { TApiForm, TSubmissionJson } from "../../type.form";
import { FsLogicBranchNode } from "./trees/nodes/FsLogicBranchNode";

describe("FsTreeFieldCollection", () => {
  describe("Creation", () => {
    it("Should be awesome", () => {
      const tree = FsTreeFieldCollection.fromFieldJson(
        // fields: [TEST_JSON_FIELD_CALC_STRING],
        // fields: [TEST_JSON_FIELD_LOGIC],
        TEST_JSON_FORM
      );
      expect(tree).toBeInstanceOf(FsTreeFieldCollection);

      // tree has 3 child nodes, 2 calc and 1 logic;
      // It should have two nodes Fields 1 and 2
      //    Field should have tree(s) logic and/or calls
    });
  });

  // I *think*,  I think there is root node and plus 1?  Should root not be null??

  /// --------------------------------
  describe(".getFieldTreeByFieldId(...)", () => {
    it("Should be awesome", () => {
      const tree = FsTreeFieldCollection.fromFieldJson(TEST_JSON_FORM);
      const field_0 = tree.getFieldTreeByFieldId(
        TEST_JSON_FORM.fields[0].id || ""
      );
      const field_1 = tree.getFieldTreeByFieldId(
        TEST_JSON_FORM.fields[1].id || ""
      );
      expect(field_0?.fieldId).toStrictEqual(TEST_JSON_FORM.fields[0].id);
      expect(field_1?.fieldId).toStrictEqual(TEST_JSON_FORM.fields[1].id);
      expect(field_0).toBeInstanceOf(FsTreeField);
      expect(field_1).toBeInstanceOf(FsTreeField);
    });
  });

  describe(".getFieldsBySection()", () => {
    it("Should be awesome", () => {
      const tree = FsTreeFieldCollection.fromFieldJson(
        circularAndInterdependentJson as unknown as TApiForm
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
          // "148509721",
        ].sort()
      );
    });
  });

  describe(".getFieldIdsWithCircularLogic()", () => {
    it("Should return fieldIds that have circular logic", () => {
      const tree = FsTreeFieldCollection.fromFieldJson(
        circularAndInterdependentJson as unknown as TApiForm
      );

      // this may also be a consequence of adding panel logic to fields

      //   I removed the dependencChain check when looping over children
      //   we may want to add that back

      expect(tree.getFieldIdsWithCircularLogic().sort()).toStrictEqual(
        [
          "148456734",
          "148456739",
          "148456740",
          "148456741",
          "148456742",
          "148509470",
          "148509474",
          "148509475",
          "148509476",
          "148509477",
          "148509478",
          "148604161",
          "148604234",
          "148604235",
          "148604236",
          "151701616",
        ].sort()
      );
    });
  });
  describe(".getFieldStatusMessages()", () => {
    it("Should produce status message for each logic element and applied fields.(b.0 ideal).", () => {
      const fieldId = "148509475";

      const tree = FsTreeFieldCollection.fromFieldJson(
        circularAndInterdependentJson as unknown as TApiForm
      );
      // `
      // this should only have one or two status message.
      //   fs buddy shows two but parent is undefined.

      //   this test show 17
      // `
      const actualStatusMessages = tree.getFieldStatusMessages(fieldId);
      expect(actualStatusMessages).toStrictEqual([
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'condition\' \'option\'","fieldId":"151678347","condition":"condition","option":"option"}',
          fieldId: "151678347",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'condition' is  'option' (parent: fieldId: undefined junction: 'undefined')",
          fieldId: "151678347",
        },
      ]);
    });
    it("Should produce status message for each logic element and applied fields.(Switzerland).", () => {
      const fieldId = "151678347";

      const tree = FsTreeFieldCollection.fromFieldJson(
        circularAndInterdependentJson as unknown as TApiForm
      );
      const actualStatusMessages = tree.getFieldStatusMessages(fieldId);
      expect(actualStatusMessages).toStrictEqual([
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'condition\' \'option\'","fieldId":"151678347","condition":"condition","option":"option"}',
          fieldId: "151678347",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'condition' is  'option' (parent: fieldId: undefined junction: 'undefined')",
          fieldId: "151678347",
        },
      ]);
    });
    it("Should produce status message for each logic element and applied fields.(non panel, simple, ideal).", () => {
      // const fieldId = "148509470";
      const fieldId = "152139062";

      const tree = FsTreeFieldCollection.fromFieldJson(
        circularAndInterdependentJson as unknown as TApiForm
      );
      const actualStatusMessages = tree.getFieldStatusMessages(fieldId);
      expect(actualStatusMessages).toStrictEqual([
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'equals\' \'True\'","fieldId":"152139063","rootFieldId":"152139062","condition":"equals","option":"True","junctionOperator":"all","json":{"field":152139063,"condition":"equals","option":"True"}}',
          fieldId: "152139063",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'equals' is  'True' (parent: fieldId: 152139062 junction: 'all')",
          fieldId: "152139063",
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'equals\' \'True\'","fieldId":"152139066","rootFieldId":"152139062","condition":"equals","option":"True","junctionOperator":"all","json":{"field":152139066,"condition":"equals","option":"True"}}',
          fieldId: "152139066",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'equals' is  'True' (parent: fieldId: 152139062 junction: 'all')",
          fieldId: "152139066",
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicBranchNode","ownerFieldId":"152139062","action":"show","conditional":"all","json":{"action":"show","conditional":"all","checks":[{"field":152139063,"condition":"equals","option":"True"},{"field":152139066,"condition":"equals","option":"True"}]}}',
          fieldId: "152139062",
        },
        {
          severity: "logic",
          message: "Logic: 'show' if 'all' are true.",
          fieldId: "152139062",
          relatedFieldIds: ["152139063", "152139066"],
        },
        // {
        //   severity: "debug",
        //   message:
        //     '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'condition\' \'option\'","fieldId":"152139061","condition":"condition","option":"option"}',
        //   fieldId: "152139061",
        // },
        // {
        //   severity: "logic",
        //   message:
        //     "logic: value of this field: 'condition' is  'option' (parent: fieldId: undefined junction: 'undefined')",
        //   fieldId: "152139061",
        // },
      ]);
    });
    it("Should produce status message for each logic element and applied fields.(panel, implied logic).", () => {
      const fieldId = "148509470";
      // const fieldId = "152139062";

      const tree = FsTreeFieldCollection.fromFieldJson(
        circularAndInterdependentJson as unknown as TApiForm
      );
      const actualStatusMessages = tree.getFieldStatusMessages(fieldId);
      expect(actualStatusMessages).toStrictEqual([
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'equals\' \'True\'","fieldId":"148509478","rootFieldId":"148509470","condition":"equals","option":"True","junctionOperator":"all","json":{"field":148509478,"condition":"equals","option":"True"}}',
          fieldId: "148509478",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'equals' is  'True' (parent: fieldId: 148509470 junction: 'all')",
          fieldId: "148509478",
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'equals\' \'True\'","fieldId":"148509475","rootFieldId":"148509470","condition":"equals","option":"True","junctionOperator":"all","json":{"field":148509475,"condition":"equals","option":"True"}}',
          fieldId: "148509475",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'equals' is  'True' (parent: fieldId: 148509470 junction: 'all')",
          fieldId: "148509475",
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicBranchNode","ownerFieldId":"148509470","action":"show","conditional":"all","json":{"action":"show","conditional":"all","checks":[{"field":148509478,"condition":"equals","option":"True"},{"field":148509475,"condition":"equals","option":"True"}]}}',
          fieldId: "148509470",
        },
        {
          severity: "logic",
          message: "Logic: 'show' if 'all' are true.",
          fieldId: "148509470",
          relatedFieldIds: [
            "148509470",
            "148509478",
            "148509475",
            "148509476",
            "148509477",
            "148509474",
            "151678347",
            "148509465",
          ],
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'equals\' \'True\'","fieldId":"148509477","rootFieldId":"148509476","condition":"equals","option":"True","junctionOperator":"all","json":{"field":148509477,"condition":"equals","option":"True"}}',
          fieldId: "148509477",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'equals' is  'True' (parent: fieldId: 148509476 junction: 'all')",
          fieldId: "148509477",
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'equals\' \'True\'","fieldId":"148509474","rootFieldId":"148509476","condition":"equals","option":"True","junctionOperator":"all","json":{"field":148509474,"condition":"equals","option":"True"}}',
          fieldId: "148509474",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'equals' is  'True' (parent: fieldId: 148509476 junction: 'all')",
          fieldId: "148509474",
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicBranchNode","ownerFieldId":"148509476","action":"show","conditional":"all","json":{"action":"show","conditional":"all","checks":[{"field":148509477,"condition":"equals","option":"True"},{"field":148509474,"condition":"equals","option":"True"}]}}',
          fieldId: "148509476",
        },
        {
          severity: "logic",
          message: "Logic: 'show' if 'all' are true.",
          fieldId: "148509476",
          relatedFieldIds: [
            "148509470",
            "148509478",
            "148509475",
            "148509476",
            "148509477",
            "148509474",
            "151678347",
            "148509465",
          ],
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'equals\' \'Neutral\'","fieldId":"151678347","rootFieldId":"148509465","condition":"equals","option":"Neutral","junctionOperator":"all","json":{"field":151678347,"condition":"equals","option":"Neutral"}}',
          fieldId: "151678347",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'equals' is  'Neutral' (parent: fieldId: 148509465 junction: 'all')",
          fieldId: "151678347",
        },
        {
          severity: "logic",
          message:
            'Logic: circular reference. source fieldId: \'148509465\', last visited fieldId: \'148509465\', dependency chain: "148509470", "148509470", "148509478", "148509475", "148509476", "148509477", "148509474", "151678347", "148509465".',
          fieldId: "148509465",
          relatedFieldIds: undefined,
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicBranchNode","ownerFieldId":"148509465","action":"show","conditional":"all","json":{"action":"show","conditional":"all","checks":[{"field":"148509470","condition":"equals","option":"True"},{"field":"148509476","condition":"equals","option":"True"},{"field":151678347,"condition":"equals","option":"Neutral"}]}}',
          fieldId: "148509465",
        },
        {
          severity: "logic",
          message: "Logic: 'show' if 'all' are true.",
          fieldId: "148509465",
          relatedFieldIds: [
            "148509470",
            "148509478",
            "148509475",
            "148509476",
            "148509477",
            "148509474",
            "151678347",
            "148509465",
          ],
        },
      ]);
    });
    it.skip("Should produce status message for each logic element and applied fields. (panel)", () => {
      const fieldId = "148509476";

      const tree = FsTreeFieldCollection.fromFieldJson(
        circularAndInterdependentJson as unknown as TApiForm
      );
      const actualStatusMessages = tree.getFieldStatusMessages(fieldId);
      expect(actualStatusMessages).toStrictEqual([
        {
          severity: "logic",
          message:
            '{"nodeType":"FsLogicBranchNode","ownerFieldId":"148509465","rootFieldId":"148509465","action":"show","conditional":"all","json":{"action":"show","conditional":"all","checks":[{"field":148509470,"condition":"equals","option":"True"},{"field":148509476,"condition":"equals","option":"True"}]}}',
          fieldId: "148509465",
        },
        {
          severity: "logic",
          message:
            '{"nodeType":"FsLogicBranchNode","ownerFieldId":"148509470","rootFieldId":"148509465","action":"show","conditional":"all","json":{"action":"show","conditional":"all","checks":[{"field":148509478,"condition":"equals","option":"True"},{"field":148509475,"condition":"equals","option":"True"}]}}',
          fieldId: "148509470",
        },
        {
          severity: "logic",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'equals\' \'True\'","fieldId":"148509478","rootFieldId":"148509465","condition":"equals","json":{"field":148509478,"condition":"equals","option":"True"}}',
          fieldId: "148509478",
        },
        {
          severity: "logic",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'equals\' \'True\'","fieldId":"148509475","rootFieldId":"148509465","condition":"equals","json":{"field":148509475,"condition":"equals","option":"True"}}',
          fieldId: "148509475",
        },
        {
          severity: "logic",
          message:
            '{"nodeType":"FsLogicBranchNode","ownerFieldId":"148509476","rootFieldId":"148509465","action":"show","conditional":"all","json":{"action":"show","conditional":"all","checks":[{"field":148509477,"condition":"equals","option":"True"},{"field":148509474,"condition":"equals","option":"True"}]}}',
          fieldId: "148509476",
        },
        {
          severity: "logic",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'equals\' \'True\'","fieldId":"148509477","rootFieldId":"148509465","condition":"equals","json":{"field":148509477,"condition":"equals","option":"True"}}',
          fieldId: "148509477",
        },
        {
          severity: "logic",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'equals\' \'True\'","fieldId":"148509474","rootFieldId":"148509465","condition":"equals","json":{"field":148509474,"condition":"equals","option":"True"}}',
          fieldId: "148509474",
        },
        {
          severity: "info",
          message:
            'CIRCULAR: rootFieldId: \'148509465\',  json: {"_sourceFieldId":"148509476","_targetFieldId":"148509465","_dependentChainFieldIds":["148509470","148509478","148509475","148509476","148509477","148509474"]}',
          fieldId: "148509465",
        },
      ]);
    });
  });
  describe(".toPojoAt()", () => {
    it("Should produce a serializable pojo object.", () => {
      const fieldId = "148509476";
      const tree = FsTreeFieldCollection.fromFieldJson(
        circularAndInterdependentJson as unknown as TApiForm
      );
      const actualAgTree = tree.aggregateLogicTree(fieldId);

      const actualTreeJson = actualAgTree.toPojoAt();
      expect(expectedTreeJson).toStrictEqual(actualTreeJson);
    });
  });
  describe("aggregateLogicTree", () => {
    it("Should return tree with one leaf node if there is no logic.", () => {
      const tree = FsTreeFieldCollection.fromFieldJson(
        circularAndInterdependentJson as unknown as TApiForm
      );
      const noLogicField = tree.aggregateLogicTree("148456700");
      expect(noLogicField.getTreeContentAt().length).toBe(1);
      expect(
        noLogicField.getChildContentAt(noLogicField.rootNodeId)
      ).toBeInstanceOf(FsLogicLeafNode);
    });
    it("Should include visibility panel (parent container) logic tree", () => {
      const fieldId = "148509476";

      const tree = FsTreeFieldCollection.fromFieldJson(
        circularAndInterdependentJson as unknown as TApiForm
      );
      const actualAgTree = tree.aggregateLogicTree(fieldId);
      const actualAgTreeContent = actualAgTree.getTreeContentAt() || [];

      const actualTreeJson = actualAgTree.toPojoAt();
      expect(expectedTreeJson).toStrictEqual(actualTreeJson);

      expect(actualAgTreeContent.length).toBe(9);
      expect(actualAgTreeContent[0]).toBeInstanceOf(FsLogicBranchNode);
      expect((actualAgTreeContent[0] as FsLogicBranchNode).ownerFieldId).toBe(
        "148509470"
      );
      expect(actualAgTreeContent[1]).toBeInstanceOf(FsLogicLeafNode);
      expect((actualAgTreeContent[1] as FsLogicLeafNode).fieldId).toBe(
        "148509478"
      );
      expect(actualAgTreeContent[2]).toBeInstanceOf(FsLogicLeafNode);
      expect((actualAgTreeContent[2] as FsLogicLeafNode).fieldId).toBe(
        "148509475"
      );
      expect(actualAgTreeContent[3]).toBeInstanceOf(FsLogicBranchNode);
      expect((actualAgTreeContent[3] as FsLogicBranchNode).ownerFieldId).toBe(
        "148509476"
      );
      expect(actualAgTreeContent[4]).toBeInstanceOf(FsLogicLeafNode);
      expect((actualAgTreeContent[4] as FsLogicLeafNode).fieldId).toBe(
        "148509477"
      );
      expect(actualAgTreeContent[5]).toBeInstanceOf(FsLogicLeafNode);
      expect((actualAgTreeContent[5] as FsLogicLeafNode).fieldId).toBe(
        "148509474"
      );
      expect(actualAgTreeContent[6]).toBeInstanceOf(FsLogicLeafNode);
      expect((actualAgTreeContent[6] as FsLogicLeafNode).fieldId).toBe(
        "151678347"
      );

      expect(actualAgTreeContent[7]).toBeInstanceOf(FsCircularDependencyNode);
      expect(
        (actualAgTreeContent[7] as FsCircularDependencyNode).targetFieldId
      ).toBe("148509465");

      expect(actualAgTreeContent[8]).toBeInstanceOf(FsLogicBranchNode);
      expect((actualAgTreeContent[8] as FsLogicBranchNode).ownerFieldId).toBe(
        "148509465"
      );

      expect(
        actualAgTree.getChildContentAt(actualAgTree.rootNodeId)
      ).toBeInstanceOf(FsLogicBranchNode);
    });

    it("Should return the full tree.", () => {
      // two leafs
      const tree = FsTreeFieldCollection.fromFieldJson(
        circularAndInterdependentJson as unknown as TApiForm
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
      expect(circularRefNodesA[0].dependentChainFieldIds.sort()).toStrictEqual(
        [
          "148456734",
          "148456734",
          // "148456739",
          "148456739",
          "148456740",
          "148456741",
          "148456742",
          // "148456742",
        ].sort()
      );
      const circularRefNodesB = agTreeCircularRefB.getCircularLogicNodes();
      expect(circularRefNodesB[0].dependentChainFieldIds.sort()).toStrictEqual(
        [
          "148456734",
          // "148456734",
          "148456739",
          "148456740",
          "148456741",
          // "148456741",
          "148456742",
          "148456742",
        ].sort()
      );

      const agBigDipperCircularRefNodes = agBigDipper.getCircularLogicNodes();
      expect(
        agBigDipperCircularRefNodes[0].dependentChainFieldIds.sort()
      ).toStrictEqual(
        [
          // "148604159",
          "148604161", // it's here in the list because big dipper's handle is 148604161
          "148604234",
          "148604235",
          "148604236",
          "148604236",
        ].sort()
      );

      const agLittleDipperCircularRefNodes =
        agLittleDipperCircular.getCircularLogicNodes();
      expect(
        agLittleDipperCircularRefNodes[0].dependentChainFieldIds.sort()
      ).toStrictEqual(
        [
          // "148604159",
          "148604234",
          "148604235",
          "148604236",
          "148604236",
        ].sort()
      );
    });
  });
  it("Should return the value of the calculation given field values", () => {
    // logic/not required 147738154
    // required 148008076
    const getFieldJson = (fieldId: string) => {
      return formWithAllFieldsJson.fields.filter(
        (field) => field.id === fieldId
      );
    };
    const getExpected = (fieldId: string) => {
      return uiComponentsExpected.filter((x) => x.fieldId === fieldId);
    };

    const fieldJsonNotRequired147738154 = {
      id: "_TEST_FORM_",
      fields: getFieldJson("147738154"),
    };
    const fieldJsonRequired148008076 = {
      id: "_TEST_FORM_",
      fields: getFieldJson("148008076"),
    };

    const expected147738154 = getExpected("147738154");
    const expected148008076 = getExpected("148008076"); // this is wrong __BAD_DATA__ ...

    const tree147738154 = FsTreeFieldCollection.fromFieldJson(
      fieldJsonNotRequired147738154 as unknown as TApiForm
    );

    const tree148008076 = FsTreeFieldCollection.fromFieldJson(
      fieldJsonRequired148008076 as unknown as TApiForm
    );

    const actual147738154 = tree147738154.getUiPopulateObject(
      submissionWithAllFieldsJson as unknown as TSubmissionJson
    );
    const actual148008076 = tree148008076.getUiPopulateObject(
      submissionWithAllFieldsJson as unknown as TSubmissionJson
    );

    expect(expected147738154).toStrictEqual(actual147738154);
    expect(expected148008076).toStrictEqual(actual148008076);
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

const TEST_JSON_FORM = {
  id: "_TEST_FORM_ID",
  fields: [
    TEST_JSON_FIELD_CALC_STRING,
    TEST_JSON_FIELD_LOGIC,
  ] as TFsFieldAnyJson[],
} as TApiForm;

const uiComponentsExpected = [
  {
    uiid: null,
    fieldId: "147738154",
    fieldType: "text",
    value: "",
    statusMessages: [
      {
        severity: "info",
        fieldId: "147738154",
        // message: "Stored value: '__EMPTY_SUBMISSION_DATA__'.",
        message: "Stored value: '__NO_SUBMISSION_DATA__'.",
        relatedFieldIds: [],
      },
    ],
  },
  {
    uiid: "field147738155",
    fieldId: "147738155",
    fieldType: "textarea",
    value: '__BAD_DATA_TYPE__ "string"',
    statusMessages: [
      {
        severity: "info",
        fieldId: "147738155",
        message: "Stored value: '__BAD_DATA_TYPE__ \"string\"'.",
        relatedFieldIds: [],
      },
    ],
  },
  {
    uiid: "field147738156-first",
    fieldId: "147738156",
    fieldType: "name",
    value: "First Name 89",
    statusMessages: [],
  },
  {
    uiid: "field147738156-last",
    fieldId: "147738156",
    fieldType: "name",
    value: "Last Name 137",
    statusMessages: [],
  },
  {
    uiid: "field147738156-initial",
    fieldId: "147738156",
    fieldType: "name",
    value: "Initial (optional) 173",
    statusMessages: [],
  },
  {
    uiid: "field147738156-prefix",
    fieldId: "147738156",
    fieldType: "name",
    value: "Prefix (optional) 962",
    statusMessages: [],
  },
  {
    uiid: "field147738156-suffix",
    fieldId: "147738156",
    fieldType: "name",
    value: "Suffix (optional) 650",
    statusMessages: [],
  },
  {
    uiid: "field147738156-middle",
    fieldId: "147738156",
    fieldType: "name",
    value: "Middle Name (optional) 784",
    statusMessages: [],
  },
  {
    uiid: null,
    fieldId: "147738156",
    fieldType: "name",
    value: "",
    statusMessages: [
      {
        severity: "info",
        fieldId: "147738156",
        message:
          "Stored value: 'prefix = Prefix (optional) 962\\nfirst = First Name 89\\nmiddle = Middle Name (optional) 784\\ninitial = Initial (optional) 173\\nlast = Last Name 137\\nsuffix = Suffix (optional) 650'.",
        relatedFieldIds: [],
      },
    ],
  },
  {
    uiid: "field147738157-address",
    fieldId: "147738157",
    fieldType: "address",
    value: "123 Walt Disney Way 8",
    statusMessages: [],
  },
  {
    uiid: "field147738157-address2",
    fieldId: "147738157",
    fieldType: "address",
    value: "Micky Mouse Hut #2, 5",
    statusMessages: [],
  },
  {
    uiid: "field147738157-city",
    fieldId: "147738157",
    fieldType: "address",
    value: "Disney World 6",
    statusMessages: [],
  },
  {
    uiid: "field147738157-state",
    fieldId: "147738157",
    fieldType: "address",
    value: "VA",
    statusMessages: [],
  },
  {
    uiid: "field147738157-zip",
    fieldId: "147738157",
    fieldType: "address",
    value: "04240",
    statusMessages: [],
  },
  {
    uiid: "field147738157-country",
    fieldId: "147738157",
    fieldType: "address",
    value: "Bulgaria",
    statusMessages: [],
  },
  {
    uiid: null,
    fieldId: "147738157",
    fieldType: "address",
    value: "",
    statusMessages: [
      {
        severity: "info",
        fieldId: "147738157",
        message:
          "Stored value: 'address = 123 Walt Disney Way 8\\naddress2 = Micky Mouse Hut #2, 5\\ncity = Disney World 6\\nstate = VA\\nzip = 04240\\ncountry = Bulgaria'.",
        relatedFieldIds: [],
      },
    ],
  },
  {
    uiid: "field147738158",
    fieldId: "147738158",
    fieldType: "email",
    value: '__BAD_DATA_TYPE__ "string"',
    statusMessages: [
      {
        severity: "info",
        fieldId: "147738158",
        message: "Stored value: '__BAD_DATA_TYPE__ \"string\"'.",
        relatedFieldIds: [],
      },
    ],
  },
  {
    uiid: "field147738159",
    fieldId: "147738159",
    fieldType: "phone",
    value: '__BAD_DATA_TYPE__ "string"',
    statusMessages: [
      {
        severity: "info",
        fieldId: "147738159",
        message: "Stored value: '__BAD_DATA_TYPE__ \"string\"'.",
        relatedFieldIds: [],
      },
    ],
  },
  {
    uiid: "field147738160",
    fieldId: "147738160",
    fieldType: "number",
    value: "1",
    statusMessages: [
      {
        severity: "info",
        fieldId: "147738160",
        message: "Stored value: '1'.",
        relatedFieldIds: [],
      },
    ],
  },
  {
    uiid: "field147738161",
    fieldId: "147738161",
    fieldType: "select",
    value: "Option1",
    statusMessages: [
      {
        severity: "info",
        fieldId: "147738161",
        message: "Stored value: 'Option1'.",
        relatedFieldIds: [],
      },
    ],
  },
  {
    uiid: "field147738162",
    fieldId: "147738162",
    fieldType: "select",
    value: "OPT03",
    statusMessages: [
      {
        severity: "info",
        fieldId: "147738162",
        message: "Stored value: 'OPT03'.",
        relatedFieldIds: [],
      },
    ],
  },
  {
    uiid: "field147738163_1",
    fieldId: "147738163",
    fieldType: "radio",
    value: "Option1",
    statusMessages: [],
  },
  {
    uiid: null,
    fieldId: "147738163",
    fieldType: "radio",
    value: "null",
    statusMessages: [
      {
        severity: "info",
        fieldId: "147738163",
        message: "Stored value: 'Option1'.",
        relatedFieldIds: [],
      },
    ],
  },
  {
    uiid: "field147738164_1",
    fieldId: "147738164",
    fieldType: "checkbox",
    value: "Option1",
    statusMessages: [],
  },
  {
    uiid: "field147738164_2",
    fieldId: "147738164",
    fieldType: "checkbox",
    value: "Option2",
    statusMessages: [],
  },
  {
    uiid: null,
    fieldId: "147738164",
    fieldType: "checkbox",
    value: "",
    statusMessages: [
      {
        severity: "info",
        fieldId: "147738164",
        message: "Stored value: 'Option1\\nOption2'.",
        relatedFieldIds: [],
      },
    ],
  },
  {
    uiid: null,
    fieldId: "147738165",
    fieldType: "creditcard",
    value: "",
    statusMessages: [
      {
        severity: "debug",
        fieldId: "147738165",
        message:
          'Sections may have statusMessages but they will never get "parsed".',
        relatedFieldIds: [],
      },
    ],
  },
  {
    uiid: "field147738166M",
    fieldId: "147738166",
    fieldType: "datetime",
    value: "Nov",
    statusMessages: [],
  },
  {
    uiid: "field147738166D",
    fieldId: "147738166",
    fieldType: "datetime",
    value: "13",
    statusMessages: [],
  },
  {
    uiid: "field147738166Y",
    fieldId: "147738166",
    fieldType: "datetime",
    value: "2022",
    statusMessages: [],
  },
  {
    uiid: "field147738166H",
    fieldId: "147738166",
    fieldType: "datetime",
    value: "02",
    statusMessages: [],
  },
  {
    uiid: "field147738166I",
    fieldId: "147738166",
    fieldType: "datetime",
    value: "39",
    statusMessages: [],
  },
  {
    uiid: "field147738166A",
    fieldId: "147738166",
    fieldType: "datetime",
    value: "AM",
    statusMessages: [],
  },
  {
    uiid: null,
    fieldId: "147738166",
    fieldType: "datetime",
    value: "",
    statusMessages: [
      {
        severity: "info",
        fieldId: "147738166",
        message: "Stored value: 'Nov 13, 2021 02:39 AM'.",
        relatedFieldIds: [],
      },
    ],
  },
  {
    uiid: "field147738167",
    fieldId: "147738167",
    fieldType: "file",
    value: '__BAD_DATA_TYPE__ "string"',
    statusMessages: [
      {
        severity: "info",
        fieldId: "147738167",
        message: "Stored value: '__BAD_DATA_TYPE__ \"string\"'.",
        relatedFieldIds: [],
      },
    ],
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
        message: "Stored value: '__BAD_DATA_TYPE__ \"string\"'.",
        relatedFieldIds: [],
      },
    ],
  },
  {
    uiid: null,
    fieldId: "147738169",
    fieldType: "richtext",
    value: "",
    statusMessages: [
      {
        severity: "debug",
        fieldId: "147738169",
        message:
          'Sections may have statusMessages but they will never get "parsed".',
        relatedFieldIds: [],
      },
    ],
  },
  {
    uiid: null,
    fieldId: "147738170",
    fieldType: "embed",
    value: "",
    statusMessages: [
      {
        severity: "debug",
        fieldId: "147738170",
        message:
          'Sections may have statusMessages but they will never get "parsed".',
        relatedFieldIds: [],
      },
    ],
  },
  {
    uiid: "field147738171",
    fieldId: "147738171",
    fieldType: "product",
    value: undefined,
    statusMessages: [
      {
        severity: "info",
        fieldId: "147738171",
        message:
          "Stored value: 'charge_type = fixed_amount\\nquantity = 7\\nunit_price = 3.99\\ntotal = 27.93'.",
        relatedFieldIds: [],
      },
    ],
  },
  {
    uiid: "field147738172",
    fieldId: "147738172",
    fieldType: "signature",
    value: '__BAD_DATA_TYPE__ "string"',
    statusMessages: [
      {
        severity: "info",
        fieldId: "147738172",
        message: "Stored value: '__BAD_DATA_TYPE__ \"string\"'.",
        relatedFieldIds: [],
      },
    ],
  },
  {
    uiid: "field147738173",
    fieldId: "147738173",
    fieldType: "rating",
    value: "2",
    statusMessages: [
      {
        severity: "info",
        fieldId: "147738173",
        message: "Stored value: '2'.",
        relatedFieldIds: [],
      },
    ],
  },
  {
    uiid: "field147887088",
    fieldId: "147887088",
    fieldType: "text",
    value: '__BAD_DATA_TYPE__ "string"',
    statusMessages: [
      {
        severity: "info",
        fieldId: "147887088",
        message: "Stored value: '__BAD_DATA_TYPE__ \"string\"'.",
        relatedFieldIds: [],
      },
    ],
  },
  {
    uiid: "field148008076",
    fieldId: "148008076",
    fieldType: "text",
    value: "Short Answer - Copy 689",
    statusMessages: [
      {
        severity: "info",
        fieldId: "148008076",
        message: "Stored value: 'Short Answer - Copy 689'.",
        relatedFieldIds: [],
      },
    ],
  },
  {
    uiid: "field148111228_1",
    fieldId: "148111228",
    fieldType: "checkbox",
    value: "Show",
    statusMessages: [],
  },
  {
    uiid: null,
    fieldId: "148111228",
    fieldType: "checkbox",
    value: "",
    statusMessages: [
      {
        severity: "info",
        fieldId: "148111228",
        message: "Stored value: 'Show'.",
        relatedFieldIds: [],
      },
    ],
  },
  {
    uiid: null,
    fieldId: "148113605",
    fieldType: "embed",
    value: "",
    statusMessages: [
      {
        severity: "debug",
        fieldId: "148113605",
        message:
          'Sections may have statusMessages but they will never get "parsed".',
        relatedFieldIds: [],
      },
    ],
  },
  {
    uiid: null,
    fieldId: "149279532",
    fieldType: "section",
    value: "",
    statusMessages: [
      {
        severity: "debug",
        fieldId: "149279532",
        message:
          'Sections may have statusMessages but they will never get "parsed".',
        relatedFieldIds: [],
      },
    ],
  },
];

const expectedTreeJson = {
  "148509465": {
    parentId: "148509465",
    nodeContent: {
      conditional: "all",
      action: "show",
      logicJson: {
        action: "show",
        conditional: "all",
        checks: [
          {
            field: "148509470",
            condition: "equals",
            option: "True",
          },
          {
            field: "148509476",
            condition: "equals",
            option: "True",
          },
          {
            field: 151678347,
            condition: "equals",
            option: "Neutral",
          },
        ],
      },
      ownerFieldId: "148509465",
    },
  },
  "148509465:0": {
    parentId: "148509465",
    nodeContent: {
      conditional: "all",
      action: "show",
      logicJson: {
        action: "show",
        conditional: "all",
        checks: [
          {
            field: 148509478,
            condition: "equals",
            option: "True",
          },
          {
            field: 148509475,
            condition: "equals",
            option: "True",
          },
        ],
      },
      ownerFieldId: "148509470",
    },
  },
  "148509465:0:1": {
    parentId: "148509465:0",
    nodeContent: {
      fieldId: "148509478",
      condition: "equals",
      option: "True",
      fieldJson: {
        field: 148509478,
        condition: "equals",
        option: "True",
      },
      predicateJson: {
        field: 148509478,
        condition: "equals",
        option: "True",
      },
    },
  },
  "148509465:0:2": {
    parentId: "148509465:0",
    nodeContent: {
      fieldId: "148509475",
      condition: "equals",
      option: "True",
      fieldJson: {
        field: 148509475,
        condition: "equals",
        option: "True",
      },
      predicateJson: {
        field: 148509475,
        condition: "equals",
        option: "True",
      },
    },
  },
  "148509465:3": {
    parentId: "148509465",
    nodeContent: {
      conditional: "all",
      action: "show",
      logicJson: {
        action: "show",
        conditional: "all",
        checks: [
          {
            field: 148509477,
            condition: "equals",
            option: "True",
          },
          {
            field: 148509474,
            condition: "equals",
            option: "True",
          },
        ],
      },
      ownerFieldId: "148509476",
    },
  },
  "148509465:3:4": {
    parentId: "148509465:3",
    nodeContent: {
      fieldId: "148509477",
      condition: "equals",
      option: "True",
      fieldJson: {
        field: 148509477,
        condition: "equals",
        option: "True",
      },
      predicateJson: {
        field: 148509477,
        condition: "equals",
        option: "True",
      },
    },
  },
  "148509465:3:5": {
    parentId: "148509465:3",
    nodeContent: {
      fieldId: "148509474",
      condition: "equals",
      option: "True",
      fieldJson: {
        field: 148509474,
        condition: "equals",
        option: "True",
      },
      predicateJson: {
        field: 148509474,
        condition: "equals",
        option: "True",
      },
    },
  },
  "148509465:6": {
    parentId: "148509465",
    nodeContent: {
      fieldId: "151678347",
      condition: "equals",
      option: "Neutral",
      fieldJson: {
        field: 151678347,
        condition: "equals",
        option: "Neutral",
      },
      predicateJson: {
        field: 151678347,
        condition: "equals",
        option: "Neutral",
      },
    },
  },
  "148509465:7": {
    parentId: "148509465",
    nodeContent: {
      asJson:
        '{"_sourceFieldId":"148509476","_targetFieldId":"148509465","_dependentChainFieldIds":["148509470","148509478","148509475","148509476","148509477","148509474","151678347"]}',
    },
  },
};
