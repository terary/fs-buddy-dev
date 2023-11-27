import { transformers } from "../../../../transformers";
import { TFsFieldAnyJson } from "../../../types";
import { FsFieldModel } from "../FsFieldModel";
import { FsFieldLogicModel } from "../FsFieldLogicModel";
import { FsFieldVisibilityLinkNode } from "./FsFieldVisibilityLinkNode";

describe("FsFieldVisibilityLinkNode", () => {
  let field: FsFieldModel;
  beforeEach(() => {
    field = FsFieldModel.fromFieldJson(
      transformers.fieldJson(TEST_JSON_FIELD as TFsFieldAnyJson)
    );
  });
  it.skip("Should return true when link-target 'evaluate' function returns true. (echos whatever parent provides)", () => {
    const valueJson = {
      "147462595": "True",
      "147462598": "True",
      "147462600": "True",
      "147462597": "True",
    };

    const tree = FsFieldLogicModel.fromFieldJson(TEST_JSON_FIELD as TFsFieldAnyJson);
    const isUltimatelyVisible = (values: {
      [fieldId: string]: any;
    }): boolean => {
      return tree.evaluateWithValues(values) || false;
    };
    const linkNode = new FsFieldVisibilityLinkNode(isUltimatelyVisible);
    field.appendChildNodeWithContent(field.rootNodeId, linkNode);

    expect(tree.evaluateWithValues(valueJson)).toStrictEqual(true);
    expect(tree.evaluateShowHide(valueJson)).toStrictEqual("show");

    expect(linkNode.isUltimately(valueJson)).toStrictEqual(true);
  });
  it.skip("Should return false when link-target 'evaluate' function returns true. (echos whatever parent provides)", () => {
    const valueJson = {
      "147462595": "True",
      "147462598": "FALSE",
      "147462600": "True",
      "147462597": "True",
    };

    const tree = FsFieldLogicModel.fromFieldJson(TEST_JSON_FIELD as TFsFieldAnyJson);
    const isUltimatelyVisible = (values: {
      [fieldId: string]: any;
    }): boolean => {
      return tree.evaluateWithValues(values) || false;
    };
    const linkNode = new FsFieldVisibilityLinkNode(isUltimatelyVisible);
    field.appendChildNodeWithContent(field.rootNodeId, linkNode);

    expect(tree.evaluateWithValues(valueJson)).toStrictEqual(false);
    expect(tree.evaluateShowHide(valueJson)).toStrictEqual(null);

    expect(linkNode.isUltimately(valueJson)).toStrictEqual(false);
  });
});

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
