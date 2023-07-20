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

  static fromFieldJson(fieldsJson: TFsFieldAnyJson[]): FsTreeFieldCollection {
    const tree = new FsTreeFieldCollection("_FORM_ID_");

    (fieldsJson || []).forEach((fieldJson) => {
      const field = FsTreeField.fromFieldJson(fieldJson);
      tree.appendChildNodeWithContent(tree.rootNodeId, field);
    });

    return tree;
  }

  // static createSubtreeFromFieldJson();
}
export { FsTreeFieldCollection };
