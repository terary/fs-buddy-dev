import {
  AbstractExpressionTree,
  IExpressionTree,
} from "predicate-tree-advanced-poc/dist/src";
import { TFsFieldAnyJson, TFsNode } from "./types";
import { TApiFormJson } from "../type.form";
import { FsTreeCalcString } from "./subtrees/FsTreeCalcString";
import { FsTreeLogic } from "./subtrees/FsTreeLogic";
import { FSExpressionTree } from "../FSExpressionTree";
import { FsTreeField } from "./FsTreeField";
const INCLUDE_SUBTREES = true;
// This tree would actually consist of node types:
//      Junction: '*', '+', '-', ...
//      Leaf: number | [fieldId]
class FsTreeFieldCollection extends AbstractExpressionTree<TFsNode> {
  private _dependantFieldIds: string[] = [];

  // --
  createSubtreeAt<FSExpressionTree>(
    targetNodeId: string
  ): IExpressionTree<TFsNode> {
    const subtree = new FsTreeFieldCollection("_subtree_");

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

  getFieldTreeByFieldId(fieldId: string): FsTreeField {
    return (
      this.getSubtreeIdsAt(this.rootNodeId)
        .map((nodeId) => this.getChildContentAt(nodeId))
        //@ts-ignore - tree type
        .filter((fieldTree) => fieldTree.fieldId === fieldId)
        .pop() as FsTreeField
    );

    // getChildrenNodeIdsOf(this.rootNodeId, INCLUDE_SUBTREES);

    // const fieldTrees = this.getChildrenNodeIdsOf(
    //   this.rootNodeId,
    //   INCLUDE_SUBTREES
    // )
    //   .map((nodeId) => {
    //     return this.getChildContentAt(nodeId) as FsTreeField;
    //   })
    //   .filter((node) => {
    //     return node?.fieldId === fieldId;
    //   });

    // return fieldTrees.pop() as FsTreeField;
  }

  evaluateWithValues<T>(values: { [fieldId: string]: any }): T {
    return {} as T;
  }

  getDependantFields(): string[] {
    return this._dependantFieldIds.slice();
  }

  static fromFieldJson(fieldsJson: TFsFieldAnyJson[]): FsTreeFieldCollection {
    const tree = new FsTreeFieldCollection("_FORM_ID_");

    (fieldsJson || []).forEach((fieldJson) => {
      // let field = new FsTreeField(fieldJson.id, {
      let field = new FsTreeField("_FIELD_ID_", {
        // @ts-ignore
        filedId: fieldJson.id,
        label: fieldJson.label,
        fieldJson: fieldJson,
      });
      // // @ts-ignore
      // field._fieldJson = fieldJson;

      // @ts-ignore
      field._fieldId = fieldJson.id;
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
          field.rootNodeId,
          fieldJson,
          subtreeConstructor
        ) as FsTreeField;
        console.log({ calcSubtree });
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
          field.rootNodeId,
          fieldJson,
          subtreeConstructor
        ) as FsTreeFieldCollection;

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

  static x_createSubtreeFromFieldJson<T>(
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
      : new FsTreeFieldCollection(targetRootId);

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
    (subtree as FsTreeFieldCollection)._rootNodeId = subtreeParentNodeId;
    (subtree as FsTreeFieldCollection)._incrementor = (
      rootTree as unknown as FsTreeFieldCollection
    )._incrementor; // 'unknown' should get fix with proper typing

    return subtree as T;
  }
}
export { FsTreeFieldCollection };
