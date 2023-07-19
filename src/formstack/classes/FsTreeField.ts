import {
  AbstractExpressionTree,
  IExpressionTree,
} from "predicate-tree-advanced-poc/dist/src";
import { TFsFieldAnyJson, TFsNode } from "./types";
import { TApiFormJson } from "../type.form";
import { FsTreeCalcString } from "./subtrees/FsTreeCalcString";
import { FsTreeLogic } from "./subtrees/FsTreeLogic";
import { FSExpressionTree } from "../FSExpressionTree";

// This tree would actually consist of node types:
//      Junction: '*', '+', '-', ...
//      Leaf: number | [fieldId]
class FsTreeField extends AbstractExpressionTree<TFsNode> {
  private _fieldId!: string;
  // private _fieldJson!: TFsFieldAnyJson;
  private _dependantFieldIds: string[] = [];
  createSubtreeAt<FSExpressionTree>(
    targetNodeId: string
  ): IExpressionTree<TFsNode> {
    const subtree = new FsTreeField("_subtree_");

    const subtreeParentNodeId = this.appendChildNodeWithContent(
      targetNodeId,
      subtree
    );

    AbstractExpressionTree.reRootTreeAt<TFsNode>(
      subtree,
      subtree.rootNodeId,
      subtreeParentNodeId
    );
    subtree._rootNodeId = subtreeParentNodeId;
    subtree._incrementor = this._incrementor;

    return subtree as IExpressionTree<TFsNode>;
  }

  evaluateWithValues<T>(values: { [fieldId: string]: any }): T {
    return {} as T;
  }

  getDependantFields(): string[] {
    return this._dependantFieldIds.slice();
  }

  get fieldId() {
    return this._fieldId;
  }

  // get fieldJson() {
  //   return this._fieldJson;
  // }

  static fromFieldJson(formJson: TApiFormJson): FsTreeField {
    const rootNode = {
      fieldId: null,
      fieldJson: formJson as TFsFieldAnyJson,
    } as unknown as TFsNode;
    const tree = new FsTreeField("_FORM_ID_");

    (formJson.fields || []).forEach((fieldJson) => {
      let field = new FsTreeField(fieldJson.id);
      field._fieldId = fieldJson.id;
      // field._fieldJson = fieldJson;
      /**
       *
       * I think this is all dead code. FsTreeFieldCollection creates the fields.
       *
       */
      // this should be subtree not tree as a node
      if (fieldJson.calculation) {
        const subtreeConstructor = (
          rootNodeSeed: string,
          // static fromFieldJson(fieldJson: TFsFieldAnyJson): FsTreeCalcString {
          fieldJson: TFsFieldAnyJson
        ) => {
          return FsTreeCalcString.fromFieldJson(
            fieldJson
          ) as unknown as FSExpressionTree;
        };

        const calcSubtree = FsTreeField.createSubtreeFromFieldJson(
          field,
          // tree,
          tree.rootNodeId,
          fieldJson,
          subtreeConstructor
        ) as FsTreeField;
      }
      if (fieldJson.logic) {
        // const f = FsTreeLogic.fromFieldJson(fieldJson);
        // tree.appendChildNodeWithContent(tree.rootNodeId, f);

        const subtreeConstructor = (
          rootNodeSeed: string,
          // static fromFieldJson(fieldJson: TFsFieldAnyJson): FsTreeCalcString {
          fieldJson: TFsFieldAnyJson
        ) => {
          return FsTreeLogic.fromFieldJson(
            fieldJson
          ) as unknown as FSExpressionTree;
        };
        const logicSubtree = FsTreeField.createSubtreeFromFieldJson(
          field,
          tree.rootNodeId,
          fieldJson,
          subtreeConstructor
        ) as FsTreeField;

        console.log({ logicSubtree });
      }

      tree.appendChildNodeWithContent(tree.rootNodeId, field);
    });

    // const tree = new FsTreeField(formJson.id, rootNode);
    // // tree._fieldId = fieldJson.id || "_MISSING_ID_";
    // // tree._fieldJson = fieldJson;
    // tree.replaceNodeContent(tree.rootNodeId, rootNode);

    return tree;
  }

  // static createSubtreeFromFieldJson();

  static createSubtreeFromFieldJson<T>(
    rootTree: FsTreeField,

    // rootTree: FsTreeFieldCollection,

    targetRootId: string,
    fieldJson: TFsFieldAnyJson,
    subtreeConstructor?:
      | ((rootIdSeed: string, fieldJson: TFsFieldAnyJson) => FSExpressionTree)
      | undefined
  ): T {
    const subtree = subtreeConstructor
      ? subtreeConstructor(targetRootId, fieldJson)
      : new FsTreeField(targetRootId);

    /// --------------------
    // const subtree = new FsTreeFieldCollection("_subtree_");

    const subtreeParentNodeId = rootTree.appendChildNodeWithContent(
      targetRootId,
      subtree
    );

    AbstractExpressionTree.reRootTreeAt<TFsNode>(
      subtree,
      subtree.rootNodeId,
      subtreeParentNodeId
    );
    (subtree as FsTreeField)._rootNodeId = subtreeParentNodeId;
    (subtree as FsTreeField)._incrementor = (
      rootTree as unknown as FsTreeField
    )._incrementor; // 'unknown' should get fix with proper typing

    return subtree as T;
  }

  static x_createSubtreeFromFieldJson<T>(
    rootTree: FsTreeField,
    targetRootId: string,
    fieldJson: TFsFieldAnyJson,
    subtreeConstructor?:
      | ((rootIdSeed: string, fieldJson: TFsFieldAnyJson) => FSExpressionTree)
      | undefined
  ): T {
    const subtree = subtreeConstructor
      ? subtreeConstructor(targetRootId, fieldJson)
      : new FsTreeField(targetRootId);

    /// --------------------
    // const subtree = new FsTreeField("_subtree_");

    const subtreeParentNodeId = rootTree.appendChildNodeWithContent(
      targetRootId,
      subtree
    );

    AbstractExpressionTree.reRootTreeAt<TFsNode>(
      subtree,
      subtree.rootNodeId,
      subtreeParentNodeId
    );
    (subtree as FsTreeField)._rootNodeId = subtreeParentNodeId;
    (subtree as FsTreeField)._incrementor = (
      rootTree as FsTreeField
    )._incrementor;

    return subtree as T;
  }
}
export { FsTreeField };
