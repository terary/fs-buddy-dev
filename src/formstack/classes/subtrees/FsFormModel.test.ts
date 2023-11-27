import { FsFormModel } from "./FsFormModel";
import { TFsFieldAnyJson } from "../types";
import { FsFieldModel } from "./trees/FsFieldModel";
import circularAndInterdependentJson from "../../../test-dev-resources/form-json/5375703.json";
import formJson5375703 from "../../../test-dev-resources/form-json/5375703.json";
import formJson5469299 from "../../../test-dev-resources/form-json/5469299.json";

import {
  FsCircularDependencyNode,
  FsLogicLeafNode,
  FsLogicTreeDeep,
} from "./trees/FsLogicTreeDeep";
import formWithAllFieldsJson from "../../../test-dev-resources/form-json/5358471.json";
import submissionWithAllFieldsJson from "../../../test-dev-resources/submission-json/1129952515-form5358471.json";
import { TApiForm, TApiFormJson, TSubmissionJson } from "../../type.form";
import { transformers } from "../../transformers";
import { TSimpleDictionary } from "./types";
import { TStatusMessageSeverity, TStatusRecord } from "../Evaluator/type";
describe("FsFormModel", () => {
  /// --------------------------------
  describe(".getFieldModel(...)", () => {
    it("Should be awesome", () => {
      const tree = FsFormModel.fromApiFormJson({
        // @ts-ignore
        fields: TEST_JSON_FIELDS,
      });
      const field_0 = tree.getFieldModel(TEST_JSON_FIELDS[0].id || "");
      const field_1 = tree.getFieldModel(TEST_JSON_FIELDS[1].id || "");
      expect(field_0?.fieldId).toStrictEqual(TEST_JSON_FIELDS[0].id);
      expect(field_1?.fieldId).toStrictEqual(TEST_JSON_FIELDS[1].id);
      // expect(field.fieldJson["name"]).toStrictEqual(TEST_JSON_FIELDS[0].name);
      expect(field_0).toBeInstanceOf(FsFieldModel);
      expect(field_1).toBeInstanceOf(FsFieldModel);
    });
  });

  describe(".getFieldsBySection()", () => {
    it("Should be awesome", () => {
      const tree = FsFormModel.fromApiFormJson(
        transformers.formJson(
          circularAndInterdependentJson as unknown as TApiFormJson
        )
      );
      const sectionField = tree.getFieldModel("148509465") as FsFieldModel;
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
      const tree = FsFormModel.fromApiFormJson(
        transformers.formJson(
          circularAndInterdependentJson as unknown as TApiFormJson
        )
      );
      const x = tree.getFieldIdsWithCircularLogic().sort();
      expect(tree.getFieldIdsWithCircularLogic().sort()).toStrictEqual(
        [
          "148456734",
          "148456739",
          "148456740",
          "148456741",
          "148456742",
          "148509465",
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
          "154328256",
          "154328257",
          "154328258",
          "154328259",
          "154328260",
          "154328261",
          "154328262",
        ].sort()
      );
    });
  });
  describe("aggregateLogicTree", () => {
    it("Should return null  if there is no logic.", () => {
      const tree = FsFormModel.fromApiFormJson(
        transformers.formJson(
          circularAndInterdependentJson as unknown as TApiFormJson
        )
      );
      const noLogicField = tree.aggregateLogicTree(
        "148456700"
      ) as FsLogicTreeDeep;
      expect(noLogicField).toBeNull();
    });
    it.only("dev debug....", () => {
      const tree5469299 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5469299 as unknown as TApiFormJson)
      );
      const tree5375703 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );

      const agTree148604161 = tree5375703.aggregateLogicTree("148604161"); // (A) Big Dipper A->B->C->D->(B ^ E)
      const agTree152290546 = tree5469299.aggregateLogicTree("152290546"); // (B) A->B->C-D->E->A (logic)
      const agTree148456742 = tree5375703.aggregateLogicTree("148456742"); // (B) A->B->C-D->E->A (logic)
      const agTree148509470 = tree5375703.aggregateLogicTree("148509470"); // A (within panel)
      const pojo148509470 = tree5375703
        .aggregateLogicTree("148509470")
        .toPojoAt(undefined, false); // A (within panel)

      const pojo = {
        pojo152293116: tree5469299
          .aggregateLogicTree("152293116")
          .toPojoAt(undefined, false), // Mutually Exclusive
        pojo152297010: tree5469299
          .aggregateLogicTree("152297010")
          .toPojoAt(undefined, false), // Mutually Inclusive
        pojo152290546: tree5469299
          .aggregateLogicTree("152290546")
          .toPojoAt(undefined, false), // (B) A->B->C-D->E->A (logic)
        pojo148456742: tree5375703
          .aggregateLogicTree("148456742")
          .toPojoAt(undefined, false), // (B) A->B->C-D->E->A (logic)
        pojo148509470: tree5375703
          .aggregateLogicTree("148509470")
          .toPojoAt(undefined, false), // A (within panel)
        pojo148604161: tree5375703
          .aggregateLogicTree("148604161")
          .toPojoAt(undefined, false), // (A) Big Dipper A->B->C->D->(B ^ E)
      };
      expect(pojo).toStrictEqual(dev_debug_logicTreePojo);
    });

    it("Should return the full tree.", () => {
      // two leafs
      const tree = FsFormModel.fromApiFormJson(
        transformers.formJson(
          circularAndInterdependentJson as unknown as TApiFormJson
        )
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
        agInterdependentSection: agInterdependentSection.getDependentFieldIds(),
        agTreeCircularRefA: agTreeCircularRefA.getDependentFieldIds(),
        agTreeCircularRefB: agTreeCircularRefB.getDependentFieldIds(),
        agBigDipper: agBigDipper.getDependentFieldIds(),
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
      ]);
      const circularRefNodesB = agTreeCircularRefB.getCircularLogicNodes();
      expect(circularRefNodesB[0].dependentChainFieldIds).toStrictEqual([
        "148456742",
        "148456741",
        "148456740",
        "148456739",
        "148456734",
      ]);

      const agBigDipperCircularRefNodes = agBigDipper.getCircularLogicNodes();
      expect(
        agBigDipperCircularRefNodes[0].dependentChainFieldIds.sort()
      ).toStrictEqual(
        [
          "148604161", // it's here in the list because big dipper's handle is 148604161
          "148604236",
          "148604235",
          "148604234",
        ].sort()
      );

      const agLittleDipperCircularRefNodes =
        agLittleDipperCircular.getCircularLogicNodes();
      expect(
        agLittleDipperCircularRefNodes[0].dependentChainFieldIds
      ).toStrictEqual([
        // "148604161", not in the list because chain starts after the handle
        "148604236",
        "148604235",
        "148604234",
      ]);
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

    const fieldJsonNotRequired147738154 = getFieldJson("147738154");
    const fieldJsonRequired148008076 = getFieldJson("148008076");

    const expected147738154 = getExpected("147738154");
    const expected148008076 = getExpected("148008076"); // this is wrong __BAD_DATA__ ...

    const tree147738154 = FsFormModel.fromApiFormJson(
      // @ts-ignore
      { fields: fieldJsonNotRequired147738154 }
      // fieldJsonNotRequired147738154 as unknown as TFsFieldAnyJson[]
    );

    const tree148008076 = FsFormModel.fromApiFormJson(
      //@ts-ignore
      { fields: fieldJsonRequired148008076 }
      // fieldJsonRequired148008076 as unknown as TFsFieldAnyJson[]
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

const TEST_JSON_FIELDS = [
  TEST_JSON_FIELD_CALC_STRING,
  TEST_JSON_FIELD_LOGIC,
] as TFsFieldAnyJson[];

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

const dev_debug_logicTreePojo = {
  pojo152293116: {
    "152293116": {
      parentId: "152293116",
      nodeContent: {
        nodeType: "FsVirtualRootNode",
        fieldId: "152293116",
        conditional: "all",
      },
    },
    "152293116:0": {
      parentId: "152293116",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152293116",
        action: "show",
        conditional: "all",
      },
    },
    "152293116:0:1": {
      parentId: "152293116:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152293117",
        condition: "equals",
        option: "Zero",
      },
    },
    "152293116:0:2": {
      parentId: "152293116:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152293117",
        condition: "equals",
        option: "One",
      },
    },
  },
  pojo152297010: {
    "152297010": {
      parentId: "152297010",
      nodeContent: {
        nodeType: "FsVirtualRootNode",
        fieldId: "152297010",
        conditional: "all",
      },
    },
    "152297010:0": {
      parentId: "152297010",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152297010",
        action: "show",
        conditional: "all",
      },
    },
    "152297010:0:1": {
      parentId: "152297010:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152293117",
        condition: "equals",
        option: "Zero",
      },
    },
    "152297010:0:2": {
      parentId: "152297010:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152293117",
        condition: "equals",
        option: "Zero",
      },
    },
  },
  pojo152290546: {
    "152290546": {
      parentId: "152290546",
      nodeContent: {
        nodeType: "FsVirtualRootNode",
        fieldId: "152290546",
        conditional: "all",
      },
    },
    "152290546:0": {
      parentId: "152290546",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290546",
        action: "show",
        conditional: "all",
      },
    },
    "152290546:0:1": {
      parentId: "152290546:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290547",
        condition: "equals",
        option: "OptionA",
      },
    },
    "152290546:0:2": {
      parentId: "152290546:0",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290547",
        action: "show",
        conditional: "all",
      },
    },
    "152290546:0:2:3": {
      parentId: "152290546:0:2",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290548",
        condition: "equals",
        option: "OptionA",
      },
    },
    "152290546:0:2:4": {
      parentId: "152290546:0:2",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290548",
        action: "show",
        conditional: "all",
      },
    },
    "152290546:0:2:4:5": {
      parentId: "152290546:0:2:4",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290549",
        condition: "equals",
        option: "OptionA",
      },
    },
    "152290546:0:2:4:6": {
      parentId: "152290546:0:2:4",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290549",
        action: "show",
        conditional: "all",
      },
    },
    "152290546:0:2:4:6:7": {
      parentId: "152290546:0:2:4:6",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290545",
        condition: "equals",
        option: "OptionA",
      },
    },
  },
  pojo148456742: {
    "148456742": {
      parentId: "148456742",
      nodeContent: {
        nodeType: "FsVirtualRootNode",
        fieldId: "148456742",
        conditional: "all",
      },
    },
    "148456742:0": {
      parentId: "148456742",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148456742",
        action: "show",
        conditional: "all",
      },
    },
    "148456742:0:1": {
      parentId: "148456742:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148456741",
        condition: "equals",
        option: "OptionA",
      },
    },
    "148456742:0:2": {
      parentId: "148456742:0",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148456741",
        action: "show",
        conditional: "all",
      },
    },
    "148456742:0:2:3": {
      parentId: "148456742:0:2",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148456740",
        condition: "equals",
        option: "OptionA",
      },
    },
    "148456742:0:2:4": {
      parentId: "148456742:0:2",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148456740",
        action: "show",
        conditional: "all",
      },
    },
    "148456742:0:2:4:5": {
      parentId: "148456742:0:2:4",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148456739",
        condition: "equals",
        option: "OptionA",
      },
    },
    "148456742:0:2:4:6": {
      parentId: "148456742:0:2:4",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148456739",
        action: "show",
        conditional: "all",
      },
    },
    "148456742:0:2:4:6:7": {
      parentId: "148456742:0:2:4:6",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148456734",
        condition: "equals",
        option: "OptionA",
      },
    },
    "148456742:0:2:4:6:8": {
      parentId: "148456742:0:2:4:6",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148456734",
        action: "show",
        conditional: "all",
      },
    },
    "148456742:0:2:4:6:8:9": {
      parentId: "148456742:0:2:4:6:8",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148456742",
        condition: "equals",
        option: "OptionA",
      },
    },
    "148456742:0:2:4:6:8:10": {
      parentId: "148456742:0:2:4:6:8",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "148456734",
        sourceNodeId: "148456742:0",
        targetFieldId: "148456742",
        targetNodeId: "148456742:0:2:4:6:8:10",
        ruleConflict: {
          conditionalA: {
            condition: "all",
            action: "show",
          },
          conditionalB: {
            condition: "all",
            action: "show",
          },
        },
        dependentChainFieldIds: [
          "148456742",
          "148456741",
          "148456740",
          "148456739",
          "148456734",
        ],
      },
    },
  },
  pojo148509470: {
    "148509470": {
      parentId: "148509470",
      nodeContent: {
        nodeType: "FsVirtualRootNode",
        fieldId: "148509470",
        conditional: "all",
      },
    },
    "148509470:0": {
      parentId: "148509470",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148509470",
        action: "show",
        conditional: "all",
      },
    },
    "148509470:0:1": {
      parentId: "148509470:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148509478",
        condition: "equals",
        option: "True",
      },
    },
    "148509470:0:2": {
      parentId: "148509470:0",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148509465",
        action: "show",
        conditional: "all",
      },
    },
    "148509470:0:2:3": {
      parentId: "148509470:0:2",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148509470",
        condition: "equals",
        option: "True",
      },
    },
    "148509470:0:2:4": {
      parentId: "148509470:0:2",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "148509465",
        sourceNodeId: "148509470:0",
        targetFieldId: "148509470",
        targetNodeId: "148509470:0:2:4",
        ruleConflict: {
          conditionalA: {
            condition: "all",
            action: "show",
          },
          conditionalB: {
            condition: "all",
            action: "show",
          },
        },
        dependentChainFieldIds: ["148509470", "148509465"],
      },
    },
    "148509470:0:2:5": {
      parentId: "148509470:0:2",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "148509465",
        sourceNodeId: "148509470:0:2",
        targetFieldId: "148509465",
        targetNodeId: "148509470:0:2:5",
        ruleConflict: {
          conditionalA: {
            condition: "all",
            action: "show",
          },
          conditionalB: {
            condition: "all",
            action: "show",
          },
        },
        dependentChainFieldIds: ["148509470", "148509465"],
      },
    },
    "148509470:0:2:6": {
      parentId: "148509470:0:2",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148509476",
        condition: "equals",
        option: "True",
      },
    },
    "148509470:0:2:7": {
      parentId: "148509470:0:2",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148509476",
        action: "show",
        conditional: "all",
      },
    },
    "148509470:0:2:7:8": {
      parentId: "148509470:0:2:7",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148509477",
        condition: "equals",
        option: "True",
      },
    },
    "148509470:0:2:7:9": {
      parentId: "148509470:0:2:7",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "148509476",
        sourceNodeId: "148509470:0:2",
        targetFieldId: "148509465",
        targetNodeId: "148509470:0:2:7:9",
        ruleConflict: {
          conditionalA: {
            condition: "all",
            action: "show",
          },
          conditionalB: {
            condition: "all",
            action: "show",
          },
        },
        dependentChainFieldIds: ["148509470", "148509465", "148509476"],
      },
    },
    "148509470:0:2:7:10": {
      parentId: "148509470:0:2:7",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148509474",
        condition: "equals",
        option: "True",
      },
    },
    "148509470:0:2:7:11": {
      parentId: "148509470:0:2:7",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "148509476",
        sourceNodeId: "148509470:0:2",
        targetFieldId: "148509465",
        targetNodeId: "148509470:0:2:7:11",
        ruleConflict: {
          conditionalA: {
            condition: "all",
            action: "show",
          },
          conditionalB: {
            condition: "all",
            action: "show",
          },
        },
        dependentChainFieldIds: ["148509470", "148509465", "148509476"],
      },
    },
    "148509470:0:2:12": {
      parentId: "148509470:0:2",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "148509476",
        sourceNodeId: "148509470:0:2",
        targetFieldId: "148509465",
        targetNodeId: "148509470:0:2:12",
        ruleConflict: {
          conditionalA: {
            condition: "all",
            action: "show",
          },
          conditionalB: {
            condition: "all",
            action: "show",
          },
        },
        dependentChainFieldIds: ["148509470", "148509465", "148509476"],
      },
    },
    "148509470:0:2:13": {
      parentId: "148509470:0:2",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "151678347",
        condition: "equals",
        option: "Neutral",
      },
    },
    "148509470:0:14": {
      parentId: "148509470:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148509475",
        condition: "equals",
        option: "True",
      },
    },
    "148509470:0:15": {
      parentId: "148509470:0",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "148509476",
        sourceNodeId: "148509470:0:2",
        targetFieldId: "148509465",
        targetNodeId: "148509470:0:15",
        ruleConflict: {
          conditionalA: {
            condition: "all",
            action: "show",
          },
          conditionalB: {
            condition: "all",
            action: "show",
          },
        },
        dependentChainFieldIds: ["148509470", "148509465", "148509476"],
      },
    },
    "148509470:16": {
      parentId: "148509470",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "148509476",
        sourceNodeId: "148509470:0:2",
        targetFieldId: "148509465",
        targetNodeId: "148509470:16",
        ruleConflict: {
          conditionalA: {
            condition: "all",
            action: "show",
          },
          conditionalB: {
            condition: "all",
            action: "show",
          },
        },
        dependentChainFieldIds: ["148509470", "148509465", "148509476"],
      },
    },
  },
  pojo148604161: {
    "148604161": {
      parentId: "148604161",
      nodeContent: {
        nodeType: "FsVirtualRootNode",
        fieldId: "148604161",
        conditional: "all",
      },
    },
    "148604161:0": {
      parentId: "148604161",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148604161",
        action: "show",
        conditional: "any",
      },
    },
    "148604161:0:1": {
      parentId: "148604161:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148604236",
        condition: "equals",
        option: "True",
      },
    },
    "148604161:0:2": {
      parentId: "148604161:0",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148604236",
        action: "show",
        conditional: "all",
      },
    },
    "148604161:0:2:3": {
      parentId: "148604161:0:2",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148604235",
        condition: "equals",
        option: "True",
      },
    },
    "148604161:0:2:4": {
      parentId: "148604161:0:2",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148604235",
        action: "show",
        conditional: "any",
      },
    },
    "148604161:0:2:4:5": {
      parentId: "148604161:0:2:4",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148604234",
        condition: "equals",
        option: "True",
      },
    },
    "148604161:0:2:4:6": {
      parentId: "148604161:0:2:4",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148604234",
        action: "show",
        conditional: "any",
      },
    },
    "148604161:0:2:4:6:7": {
      parentId: "148604161:0:2:4:6",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148604236",
        condition: "equals",
        option: "True",
      },
    },
    "148604161:0:2:4:6:8": {
      parentId: "148604161:0:2:4:6",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "148604234",
        sourceNodeId: "148604161:0:2",
        targetFieldId: "148604236",
        targetNodeId: "148604161:0:2:4:6:8",
        ruleConflict: {
          conditionalA: {
            condition: "all",
            action: "show",
          },
          conditionalB: {
            condition: "all",
            action: "show",
          },
        },
        dependentChainFieldIds: [
          "148604161",
          "148604236",
          "148604235",
          "148604234",
        ],
      },
    },
    "148604161:0:2:4:6:9": {
      parentId: "148604161:0:2:4:6",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148604239",
        condition: "greaterthan",
        option: 10,
      },
    },
  },
};
