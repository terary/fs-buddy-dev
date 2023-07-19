import {
  AbstractExpressionTree,
  IExpressionTree,
} from "predicate-tree-advanced-poc/dist/src";
import { FsFormTreeContainer } from "./FsFormTreeContainer";
import { AbstractFsTreeGeneric } from "./AbstractFsTreeGeneric";
import { TFsFieldAnyJson } from "./types";
import { TApiFormJson } from "../type.form";

describe("FsFormTreeContainer", () => {
  describe("Creation", () => {
    it("Should be awesome", () => {
      const tree = FsFormTreeContainer.fromJson({
        id: "_form_id",
        // fields: [TEST_JSON_FIELD_CALC_STRING],
        // fields: [TEST_JSON_FIELD_LOGIC],
        fields: TEST_JSON_FIELDS,
      } as unknown as TApiFormJson);
      expect(tree).toBeInstanceOf(FsFormTreeContainer);

      expect(tree.getFieldCount()).toStrictEqual(2);
    });
  });
  describe('.getFieldTreeByFieldId(...)', ()=>{
    it("Should be awesome", () => {
      const tree = FsFormTreeContainer.fromJson({
        id: "_form_id",
        // fields: [TEST_JSON_FIELD_CALC_STRING],
        // fields: [TEST_JSON_FIELD_LOGIC],
        fields: TEST_JSON_FIELDS,
      } as unknown as TApiFormJson);

      tree.getFieldTreeByFieldId(TEST_JSON_FIELDS[0].id)

  })
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
  logic: null,
  calculation: "[148149774] + [148149776] * 5",
  workflow_access: "write",
  default: "",
  section_text: "<p>The check boxes prevent this from showing.</p>",
  text_editor: "wysiwyg",
} as unknown;

const TEST_JSON_FIELDS = [TEST_JSON_FIELD_CALC_STRING, TEST_JSON_FIELD_LOGIC] as TFsFieldAnyJson[];
