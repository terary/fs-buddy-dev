import {
  AbstractExpressionTree,
  IExpressionTree,
} from "predicate-tree-advanced-poc/dist/src";
import { TFsFieldAnyJson, TFsNode } from "../../types";
import { FsTreeCalcString } from "./FsTreeCalcString";
import { FsTreeLogic } from "./FsTreeLogic";
import { FsFieldRootNode } from "./nodes/FsFieldRootNode";
import { FsFieldLinkNode } from "./nodes/FsFieldLinkNode";

// need to find the correct class for 'field'.  Define the tree in terms of
// FieldNode should have something in root leaf? {operator: $and}?
// LogicNode
// FieldNode ("field" is getting over used)
// CalclNode

// Does LogicNode, CalcNode, LinkNode have special rootNodetypes?
// {
//   value({submissionData})
//   evaluate({submissionData})
//   fieldId is ok but maybe not

//   The problem is with 'tree', the nodeContent can get moved and therefore
//   maybe  not always at root node.

//   However the 'tree' can have 'calculate' or 'evaluate';

//   LogicTree.evaluate({submissionData})
//   should return true| false
//   isHidden should be a function tree.evaluate && 'action' ? 'hide' : 'show'

//   Standard field Node without any modifier
//   .evaluate({submissionData}) should return the value of the submissionData

// }

// With the correct tree refine the Type Tree<Types> from "field" "logic" "calc"

// This tree would actually consist of node types:
//      Junction: '*', '+', '-', ...
//      Leaf: number | [fieldId]
type TSubtrees = FsTreeCalcString | FsTreeLogic;

type TFsFieldTreeNodeTypes =
  | FsFieldRootNode
  | FsTreeCalcString
  | FsTreeLogic
  | FsFieldLinkNode;
class FsTreeField extends AbstractExpressionTree<TFsFieldTreeNodeTypes> {
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

  evaluateWithValues<T>(values: { [fieldId: string]: any }): T {
    return {} as T;
  }

  getDependantFields(): string[] {
    return this._dependantFieldIds.slice();
  }

  get fieldId() {
    return this._fieldId;
  }

  static createSubtreeFromFieldJson<T>(
    rootTree: FsTreeField,

    // rootTree: FsTreeFieldCollection,

    targetRootId: string,
    fieldJson: TFsFieldAnyJson,
    subtreeConstructor?:
      | ((
          rootIdSeed: string,
          fieldJson: TFsFieldAnyJson
        ) => TFsFieldTreeNodeTypes)
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

    // need to work out these types
    AbstractExpressionTree.reRootTreeAt<TFsFieldTreeNodeTypes>(
      subtree as AbstractExpressionTree<any>,
      (subtree as AbstractExpressionTree<any>).rootNodeId,
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
