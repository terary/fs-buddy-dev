import {
  AbstractExpressionTree,
  IExpressionTree,
} from "predicate-tree-advanced-poc/dist/src";
import { TFsFieldAnyJson, TFsNode } from "../../types";
import { FsTreeCalcString } from "./FsTreeCalcString";
import { FsTreeLogic } from "./FsTreeLogic";
import { FsFieldRootNode } from "./nodes/FsFieldRootNode";
import { FsFieldLinkNode } from "./nodes/FsFieldLinkNode";
import { AbstractFsTreeGeneric } from "./AbstractFsTreeGeneric";

type TSubtrees = FsTreeCalcString | FsTreeLogic;

type TFsFieldTreeNodeTypes =
  | FsFieldRootNode
  | FsTreeCalcString
  | FsTreeLogic
  | FsFieldLinkNode;
class FsTreeField extends AbstractFsTreeGeneric<TFsFieldTreeNodeTypes> {
  private _fieldId!: string;
  private _dependantFieldIds: string[] = [];

  // ---
  createSubtreeAt(
    targetNodeId: string
  ): IExpressionTree<TFsFieldTreeNodeTypes> {
    const subtree = new FsTreeField("_subtree_");

    const subtreeParentNodeId = this.appendChildNodeWithContent(
      targetNodeId,
      subtree
    );

    AbstractExpressionTree.reRootTreeAt<TFsFieldTreeNodeTypes>(
      subtree,
      subtree.rootNodeId,
      subtreeParentNodeId
    );
    subtree._rootNodeId = subtreeParentNodeId;
    subtree._incrementor = this._incrementor;

    return subtree; // as IExpressionTree<TFsFieldTreeNodeTypes>;
  }

  get fieldJson() {
    return this._fieldJson;
  }

  get fieldId() {
    return this._fieldId;
  }

  evaluateWithValues<T>(values: { [fieldId: string]: any }): T {
    // maybe in real life this would do a little more formatting.
    return values[this.fieldId];
  }

  getDependantFields(): string[] {
    return this._dependantFieldIds.slice();
  }

  static fromFieldJson(fieldJson: TFsFieldAnyJson): FsTreeField {
    const field = new FsTreeField("_FIELD_ID_", {
      filedId: fieldJson.id,
      label: fieldJson.label,
      fieldJson: fieldJson,
    });

    field._fieldId = fieldJson.id || "_MISSING_ID_";
    field._fieldJson = fieldJson;

    if (fieldJson.calculation) {
      const subtreeConstructor = (fieldJson: TFsFieldAnyJson) =>
        FsTreeCalcString.fromFieldJson(fieldJson);

      FsTreeField.createSubtreeFromFieldJson(
        field,
        field.rootNodeId,
        fieldJson,
        subtreeConstructor
      );
    }

    if (fieldJson.logic) {
      const subtreeConstructor = (fieldJson: TFsFieldAnyJson) =>
        FsTreeLogic.fromFieldJson(fieldJson);

      FsTreeField.createSubtreeFromFieldJson(
        field,
        field.rootNodeId,
        fieldJson,
        subtreeConstructor
      );
    }
    return field;
  }

  static createSubtreeFromFieldJson<T>(
    rootTree: FsTreeField,

    // rootTree: FsTreeFieldCollection,

    targetRootId: string,
    fieldJson: TFsFieldAnyJson,
    subtreeConstructor?:
      | ((fieldJson: TFsFieldAnyJson) => TFsFieldTreeNodeTypes)
      | undefined
  ): T {
    const subtree = subtreeConstructor
      ? subtreeConstructor(fieldJson)
      : new FsTreeField(targetRootId);

    /// --------------------
    // const subtree = new FsTreeFieldCollection("_subtree_");

    const subtreeParentNodeId = rootTree.appendChildNodeWithContent(
      targetRootId,
      subtree
    );

    AbstractExpressionTree.reRootTreeAt<TSubtrees>(
      subtree as AbstractExpressionTree<TSubtrees>,
      (subtree as AbstractExpressionTree<TSubtrees>).rootNodeId,
      subtreeParentNodeId
    );
    (subtree as FsTreeField)._rootNodeId = subtreeParentNodeId;
    (subtree as FsTreeField)._incrementor = (
      rootTree as unknown as FsTreeField
    )._incrementor; // 'unknown' should get fix with proper typing

    return subtree as T;
  }
}
export { FsTreeField };
