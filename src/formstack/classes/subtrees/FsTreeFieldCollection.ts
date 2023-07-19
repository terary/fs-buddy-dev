import { AbstractExpressionTree } from "predicate-tree-advanced-poc/dist/src";
import { TFsFieldAnyJson } from "../types";
import { FsTreeCalcString } from "./trees/FsTreeCalcString";
import { FsTreeLogic } from "./trees/FsTreeLogic";
import { FsTreeField } from "./trees/FsTreeField";
const INCLUDE_SUBTREES = true;
// This tree would actually consist of node types:
//      Junction: '*', '+', '-', ...
//      Leaf: number | [fieldId]
// FsTreeField
// const x:FsTreeField
class FsTreeFieldCollection extends AbstractExpressionTree<FsTreeField> {
  private _dependantFieldIds: string[] = [];

  // types should

  // --
  createSubtreeAt(targetNodeId: string): FsTreeFieldCollection {
    const subtree = new FsTreeFieldCollection("_subtree_");

    const subtreeParentNodeId = this.appendChildNodeWithContent(
      targetNodeId,
      subtree
    );

    AbstractExpressionTree.reRootTreeAt<FsTreeField>(
      subtree,
      subtree.rootNodeId,
      subtreeParentNodeId
    );
    subtree._rootNodeId = subtreeParentNodeId;
    subtree._incrementor = this._incrementor;

    return subtree;
  }

  getFieldTreeByFieldId(fieldId: string): FsTreeField | undefined {
    return this.getSubtreeIdsAt(this.rootNodeId)
      .map((nodeId) => this.getChildContentAt(nodeId) as FsTreeField)
      .filter((fieldTree) => fieldTree && fieldTree.fieldId === fieldId)
      .pop();
  }

  evaluateWithValues<T>(values: { [fieldId: string]: any }): T {
    return {} as T;
  }

  getDependantFields(): string[] {
    return this._dependantFieldIds.slice();
  }

  // This doesn't make sense here
  // This should create TreeField and TreeField should call the calc/logic subtree stuff
  static fromFieldJson(fieldsJson: TFsFieldAnyJson[]): FsTreeFieldCollection {
    const tree = new FsTreeFieldCollection("_FORM_ID_");

    (fieldsJson || []).forEach((fieldJson) => {
      let field = new FsTreeField("_FIELD_ID_", {
        filedId: fieldJson.id,
        label: fieldJson.label,
        fieldJson: fieldJson,
      });

      // @ts-ignore
      // is private and can only be access as FsTreeField
      field._fieldId = fieldJson.id || "_MISSING_ID_";

      if (fieldJson.calculation) {
        const subtreeConstructor = (
          rootNodeSeed: string,
          fieldJson: TFsFieldAnyJson
        ) => {
          return FsTreeCalcString.fromFieldJson(fieldJson) as FsTreeCalcString;
        };

        const calcSubtree = FsTreeField.createSubtreeFromFieldJson(
          field,
          field.rootNodeId,
          fieldJson,
          subtreeConstructor
        ) as FsTreeField;
        console.log({ calcSubtree });
      }
      if (fieldJson.logic) {
        const subtreeConstructor = (
          rootNodeSeed: string,
          fieldJson: TFsFieldAnyJson
        ) => {
          return FsTreeLogic.fromFieldJson(fieldJson);
        };
        const logicSubtree = FsTreeField.createSubtreeFromFieldJson(
          field,
          field.rootNodeId,
          fieldJson,
          subtreeConstructor
        );

        console.log({ logicSubtree });
      }

      tree.appendChildNodeWithContent(tree.rootNodeId, field);
    });

    // const tree = new FsTreeFieldCollection(formJson.id, rootNode);
    // // tree._fieldId = fieldJson.id || "_MISSING_ID_";
    // // tree._fieldJson = fieldJson;
    // tree.replaceNodeContent(tree.rootNodeId, rootNode);

    return tree;
  }

  // static createSubtreeFromFieldJson();
}
export { FsTreeFieldCollection };
