import { FsTreeFieldCollection } from "./FsTreeFieldCollection";
import { TFsFieldAnyJson } from "../types";
import { FsTreeField } from "./trees/FsTreeField";
import circularAndInterdependentJson from "../../../test-dev-resources/form-json/5375703.json";
import formJson5375703 from "../../../test-dev-resources/form-json/5375703.json";
import formJson5469299 from "../../../test-dev-resources/form-json/5469299.json";

import {
  FsCircularDependencyNode,
  FsLogicLeafNode,
  FsTreeLogicDeep,
} from "./trees/FsTreeLogicDeep";
import formWithAllFieldsJson from "../../../test-dev-resources/form-json/5358471.json";
import submissionWithAllFieldsJson from "../../../test-dev-resources/submission-json/1129952515-form5358471.json";
import { TApiForm, TApiFormJson, TSubmissionJson } from "../../type.form";
import { transformers } from "../../transformers";
import { TSimpleDictionary } from "./types";
import { TStatusMessageSeverity, TStatusRecord } from "../Evaluator/type";
describe("FsTreeFieldCollection", () => {
  /// --------------------------------
  describe(".getFieldTreeByFieldId(...)", () => {
    it("Should be awesome", () => {
      const tree = FsTreeFieldCollection.fromApiFormJson({
        // @ts-ignore
        fields: TEST_JSON_FIELDS,
      });
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
      const tree = FsTreeFieldCollection.fromApiFormJson(
        transformers.formJson(
          circularAndInterdependentJson as unknown as TApiFormJson
        )
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
      const tree = FsTreeFieldCollection.fromApiFormJson(
        transformers.formJson(
          circularAndInterdependentJson as unknown as TApiFormJson
        )
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
        "151701616",
      ]);
    });
  });
  describe("aggregateLogicTree", () => {
    it("Should return tree with no nodes if there is no logic.", () => {
      const tree = FsTreeFieldCollection.fromApiFormJson(
        transformers.formJson(
          circularAndInterdependentJson as unknown as TApiFormJson
        )
      );
      const noLogicField = tree.aggregateLogicTree(
        "148456700"
      ) as FsTreeLogicDeep;
      expect(noLogicField.countTotalNodes()).toBe(1);
      expect(
        noLogicField.getChildContentAt(noLogicField.rootNodeId)
      ).toBeNull();
    });
    it.only("dev debug....", () => {
      const tree5469299 = FsTreeFieldCollection.fromApiFormJson(
        transformers.formJson(formJson5469299 as unknown as TApiFormJson)
      );
      const tree5375703 = FsTreeFieldCollection.fromApiFormJson(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );

      // need to verify the circular dep nodes are correct
      // Branching is correct but it's not adding leaves?
      // I think the 'append' is sending the wrong node stuff so its not look at 'next'
      // This doesn't seem to be adding leaves

      // It's adding more circular dependency nodes that I would expect
      // I think this descends to far with the ring (148456742) circular reference.
      // I wouldn't expect 5 circular reference nodes, this maybe because the way the fieldLogic and the panelLogic
      // are combined

      const agTree152297010 = tree5469299.aggregateLogicTree("152297010"); // Mutually Inclusive
      const agTree152293116 = tree5469299.aggregateLogicTree("152293116"); // Mutually Exclusive
      const agTree152290546 = tree5469299.aggregateLogicTree("152290546");

      const agTree152586428 = tree5469299.aggregateLogicTree("152586428");
      const agTree148456742 = tree5375703.aggregateLogicTree("148456742");
      const agTree148509477 = tree5375703.aggregateLogicTree("148509477");
      const agTree152290553 = tree5469299.aggregateLogicTree("152290553");
      const agTree152290554 = tree5469299.aggregateLogicTree("152290554");

      const agTree152139062 = tree5375703.aggregateLogicTree("152139062");
      //152290554

      const agTree152290560 = tree5469299.aggregateLogicTree("152290560");

      const agTree148509465 = tree5375703.aggregateLogicTree("148509465");

      const filterMessagesBy = (
        severity: TStatusMessageSeverity[] = ["debug", "logic"],
        s: TStatusRecord[]
      ) => {
        return s
          .filter((message) => severity.includes(message.severity))
          .reduce((p, c) => {
            if ("fieldId" in c && c.fieldId) {
              if (!Array.isArray(p[c.fieldId])) {
                p[c.fieldId] = [];
              }
              p[c.fieldId].push(c);
            }
            return p;
          }, {} as TSimpleDictionary<TStatusRecord[]>);
      };

      // const agTree152139062 = tree5375703.aggregateLogicTree("152139062");

      // const statusMessages148456742 = filterMessagesBy(
      //   ["logic", "error"],
      //   agTree148456742.getStatusMessage()
      // );

      const statusMessages152139062 = filterMessagesBy(
        ["logic"],
        agTree152139062.getStatusMessage()
      );

      const allStatusMessage = tree5375703.getAllLogicStatusMessages();
      const pojo = {
        allStatusMessage,
        statusMessages152139062,
        // agTree152290546: agTree152290546.toPojoAt(),
        // mutuallyExclusiveLogic: mutuallyExclusiveLogic.toPojoAt(),
        // mutuallyInclusiveLogic: mutuallyInclusiveLogic.toPojoAt(),
      };
      expect(pojo).toStrictEqual(dev_debug_expected_pojo);
    });
    it("dev debug.", () => {
      const tree5375703 = FsTreeFieldCollection.fromApiFormJson(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );

      const tree5469299 = FsTreeFieldCollection.fromApiFormJson(
        transformers.formJson(formJson5469299 as unknown as TApiFormJson)
      );

      const agTree152290546 = tree5469299.aggregateLogicTree("152290546");
      const agTree148456742 = tree5375703.aggregateLogicTree("148456742");

      const mutuallyExclusiveLogic =
        tree5469299.aggregateLogicTree("152293116");
      const mutuallyInclusiveLogic =
        tree5469299.aggregateLogicTree("152297010");

      const pojo = {
        agTree152290546: agTree152290546.toPojoAt(),
        agTree148456742: agTree148456742.toPojoAt(),
        mutuallyExclusiveLogic: mutuallyExclusiveLogic.toPojoAt(),
        mutuallyInclusiveLogic: mutuallyInclusiveLogic.toPojoAt(),
      };
      expect(pojo).toStrictEqual(dev_debug_expected_pojo);
    });
    it("Should return the full tree.", () => {
      // two leafs
      const tree = FsTreeFieldCollection.fromApiFormJson(
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
      expect(circularRefNodesA[0].dependentChainFieldIds.sort()).toStrictEqual(
        [
          "148456734",
          "148456742",
          "148456741",
          "148456740",
          "148456739",
          "148456734",
        ].sort()
      );
      const circularRefNodesB = agTreeCircularRefB.getCircularLogicNodes();
      expect(circularRefNodesB[0].dependentChainFieldIds.sort()).toStrictEqual(
        [
          "148456742",
          "148456741",
          "148456740",
          "148456739",
          "148456734",
          "148456742",
        ].sort()
      );

      const agBigDipperCircularRefNodes = agBigDipper.getCircularLogicNodes();
      expect(
        agBigDipperCircularRefNodes[0].dependentChainFieldIds.sort()
      ).toStrictEqual(
        [
          "148604161", // it's here in the list because big dipper's handle is 148604161
          "148604236",
          "148604235",
          "148604234",
          "148604236",
        ].sort()
      );

      const agLittleDipperCircularRefNodes =
        agLittleDipperCircular.getCircularLogicNodes();
      expect(
        agLittleDipperCircularRefNodes[0].dependentChainFieldIds.sort()
      ).toStrictEqual(
        [
          // "148604161", not in the list because chain starts after the handle
          "148604236",
          "148604235",
          "148604234",
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

    const fieldJsonNotRequired147738154 = getFieldJson("147738154");
    const fieldJsonRequired148008076 = getFieldJson("148008076");

    const expected147738154 = getExpected("147738154");
    const expected148008076 = getExpected("148008076"); // this is wrong __BAD_DATA__ ...

    const tree147738154 = FsTreeFieldCollection.fromApiFormJson(
      // @ts-ignore
      { fields: fieldJsonNotRequired147738154 }
      // fieldJsonNotRequired147738154 as unknown as TFsFieldAnyJson[]
    );

    const tree148008076 = FsTreeFieldCollection.fromApiFormJson(
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

const dev_debug_expected_pojo = {
  agTree152290546: {
    "152290546": {
      parentId: "152290546",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290546",
        action: "show",
        conditional: "all",
      },
    },
    "152290546:0": {
      parentId: "152290546",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290547",
        action: "show",
        conditional: "all",
      },
    },
    "152290546:0:6": {
      parentId: "152290546:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152293117",
        condition: "equals",
        option: "One",
      },
    },
    "152290546:0:7": {
      parentId: "152290546:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290548",
        condition: "equals",
        option: "OptionA",
      },
    },
    "152290546:0:8": {
      parentId: "152290546:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: 152293117,
        condition: "equals",
        option: "One",
      },
    },
    "152290546:1": {
      parentId: "152290546",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290548",
        action: "show",
        conditional: "all",
      },
    },
    "152290546:1:5": {
      parentId: "152290546:1",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: 152290549,
        condition: "equals",
        option: "OptionA",
      },
    },
    "152290546:2": {
      parentId: "152290546",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290549",
        action: "show",
        conditional: "all",
      },
    },
    "152290546:2:3": {
      parentId: "152290546:2",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290545",
        condition: "equals",
        option: "OptionA",
      },
    },
    "152290546:2:4": {
      parentId: "152290546:2",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: 152290545,
        condition: "equals",
        option: "OptionA",
      },
    },
    "152290546:9": {
      parentId: "152290546",
      nodeContent: {
        nodeType: "FsCircularMutualExclusiveNode",
        ruleConflict: {
          conditionalB: {
            condition: "equals",
            option: "One",
            fieldId: 152293117,
          },
          conditionalA: {
            fieldId: "152293117",
            fieldJson: {
              field: 152293117,
              condition: "equals",
              option: "Zero",
            },
            condition: "equals",
            option: "Zero",
          },
        },
        sourceFieldId: "152290546",
        targetSourceId: "152293117",
        dependentChainFieldIds: [
          "152290546",
          "152290545",
          "152290547",
          "152290548",
          "152290549",
          "152293117",
          "152293117",
        ],
      },
    },
    "152290546:10": {
      parentId: "152290546",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290547",
        condition: "equals",
        option: "OptionA",
      },
    },
    "152290546:11": {
      parentId: "152290546",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: 152293117,
        condition: "equals",
        option: "Zero",
      },
    },
  },
  agTree148456742: {
    "148456742": {
      parentId: "148456742",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148456742",
        action: "show",
        conditional: "all",
      },
    },
    "148456742:0": {
      parentId: "148456742",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148456741",
        action: "show",
        conditional: "all",
      },
    },
    "148456742:0:8": {
      parentId: "148456742:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: 148456740,
        condition: "equals",
        option: "OptionA",
      },
    },
    "148456742:1": {
      parentId: "148456742",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148456740",
        action: "show",
        conditional: "all",
      },
    },
    "148456742:1:7": {
      parentId: "148456742:1",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: 148456739,
        condition: "equals",
        option: "OptionA",
      },
    },
    "148456742:2": {
      parentId: "148456742",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148456739",
        action: "show",
        conditional: "all",
      },
    },
    "148456742:2:6": {
      parentId: "148456742:2",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148456734",
        condition: "equals",
        option: "OptionA",
      },
    },
    "148456742:3": {
      parentId: "148456742",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148456734",
        action: "show",
        conditional: "all",
      },
    },
    "148456742:3:4": {
      parentId: "148456742:3",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "148456742",
        targetSourceId: "148456742",
        dependentChainFieldIds: [
          "148456742",
          "148456734",
          "148456739",
          "148456740",
          "148456741",
          "148456742",
        ],
      },
    },
    "148456742:3:5": {
      parentId: "148456742:3",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: 148456742,
        condition: "equals",
        option: "OptionA",
      },
    },
    "148456742:9": {
      parentId: "148456742",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148456741",
        condition: "equals",
        option: "OptionA",
      },
    },
  },
  mutuallyExclusiveLogic: {
    "152293116": {
      parentId: "152293116",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152293116",
        action: "show",
        conditional: "all",
      },
    },
    "152293116:0": {
      parentId: "152293116",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152293117",
        condition: "equals",
        option: "Zero",
      },
    },
    "152293116:1": {
      parentId: "152293116",
      nodeContent: {
        nodeType: "FsCircularMutualExclusiveNode",
        ruleConflict: {
          conditionalB: {
            condition: "equals",
            option: "Zero",
            fieldId: "152293117",
          },
          conditionalA: {
            fieldId: "152293117",
            fieldJson: {
              field: "152293117",
              condition: "equals",
              option: "One",
            },
            condition: "equals",
            option: "One",
          },
        },
        sourceFieldId: "152293116",
        targetSourceId: "152293117",
        dependentChainFieldIds: ["152293116", "152293117", "152293117"],
      },
    },
    "152293116:2": {
      parentId: "152293116",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152293117",
        condition: "equals",
        option: "Zero",
      },
    },
    "152293116:3": {
      parentId: "152293116",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152293117",
        condition: "equals",
        option: "One",
      },
    },
  },
  mutuallyInclusiveLogic: {
    "152297010": {
      parentId: "152297010",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152297010",
        action: "show",
        conditional: "all",
      },
    },
    "152297010:0": {
      parentId: "152297010",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152293117",
        condition: "equals",
        option: "Zero",
      },
    },
    "152297010:1": {
      parentId: "152297010",
      nodeContent: {
        nodeType: "FsCircularMutualInclusiveNode",
        ruleConflict: {
          conditionalB: {
            condition: "equals",
            option: "Zero",
            fieldId: "152293117",
          },
          conditionalA: {
            fieldId: "152293117",
            fieldJson: {
              field: 152293117,
              condition: "equals",
              option: "Zero",
            },
            condition: "equals",
            option: "Zero",
          },
        },
        sourceFieldId: "152297010",
        targetSourceId: "152293117",
        dependentChainFieldIds: ["152297010", "152293117", "152293117"],
      },
    },
    "152297010:2": {
      parentId: "152297010",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: 152293117,
        condition: "equals",
        option: "Zero",
      },
    },
    "152297010:3": {
      parentId: "152297010",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: 152293117,
        condition: "equals",
        option: "Zero",
      },
    },
  },
};
