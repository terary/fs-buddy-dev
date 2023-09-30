import { IExpressionTree } from "predicate-tree-advanced-poc/dist/src";
import { AbstractFsTreeGeneric } from "./AbstractFsTreeGeneric";
import { TFsFieldAny } from "../../../type.field";
import { TFsNode, TFsFieldAnyJson } from "../../types";

// import { FsTreeGeneric } from "./FsTreeGeneric";
const fieldJsonToNodeContent = (json: Partial<TFsFieldAny>): TFsFieldAny => {
  return {
    // @ts-ignore - this isn't part of TFsFieldAny - but we're testing only *tmc*
    fieldId: json.id || "__MISSING_ID__",
    fieldJson: json,
  };
};
class TestAbstractFsTreeGeneric extends AbstractFsTreeGeneric<TFsFieldAnyJson> {
  // fieldId?: string;
  // fieldJson?: any;
  constructor(rootNodeSeed?: string, fieldJson?: TFsFieldAnyJson) {
    super();
  }
  createSubtreeAt(nodeId: string): IExpressionTree<TFsFieldAnyJson> {
    return new TestAbstractFsTreeGeneric();
  }

  static fromFieldJson(
    fieldJson: Partial<TFsFieldAny>
  ): TestAbstractFsTreeGeneric {
    const tree = new TestAbstractFsTreeGeneric(
      fieldJson.id,
      // @ts-ignore - bad typing
      fieldJsonToNodeContent(fieldJson)
    );
    return tree;
  }
}

describe("AbstractFsTreeGeneric", () => {
  let fieldJson: TFsFieldAny;
  beforeEach(() => {
    fieldJson = { ...TEST_JSON_FIELD } as unknown as TFsFieldAny;
  });

  it("Should be awesome", () => {
    const tree = new TestAbstractFsTreeGeneric("_root_seed_");
    expect(tree).toBeInstanceOf(AbstractFsTreeGeneric);
  });
  describe("createSubtreeFromFieldJson", () => {
    it("Should create subtree", () => {
      const tree = new TestAbstractFsTreeGeneric("_root_seed_");
      const subtreeConstructor = (
        rootNodeId: string,
        fieldJson: TFsFieldAnyJson
      ) => {
        return new TestAbstractFsTreeGeneric(
          rootNodeId,
          fieldJson
        ) as AbstractFsTreeGeneric<TFsFieldAnyJson>;
      };
      const subtree = tree.createSubtreeFromFieldJson(
        tree.rootNodeId,
        // @ts-ignore - bad typing
        fieldJson,
        subtreeConstructor
      );
      // ((rootIdSeed: string, fieldJson: Partial<TFsFieldAny>) => AbstractFsTreeGeneric)
      expect(tree.getChildContentAt(subtree.rootNodeId)).toBe(subtree);
      expect(subtree).toBeInstanceOf(TestAbstractFsTreeGeneric);
    });
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
  calculation: "",
  workflow_access: "write",
  default: "",
  section_text: "<p>The check boxes prevent this from showing.</p>",
  text_editor: "wysiwyg",
};
