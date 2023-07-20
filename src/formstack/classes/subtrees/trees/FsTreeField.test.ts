import { FsTreeField } from "./FsTreeField";
import { TFsFieldAnyJson } from "../../types";

describe("FsTreeField", () => {
  let field: FsTreeField;
  beforeEach(() => {
    field = FsTreeField.fromFieldJson(TEST_JSON_FIELD as TFsFieldAnyJson);
  });
  describe("Creation", () => {
    it("Should be awesome", () => {
      expect(field).toBeInstanceOf(FsTreeField);

      // fieldLogic can/should have fieldId, maybe modified? "fieldId-logic"?
      // expect(tree.fieldId).toEqual("147462596");
      expect(field.fieldJson).toStrictEqual(TEST_JSON_FIELD);
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
