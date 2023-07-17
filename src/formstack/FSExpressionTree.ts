import {
  AbstractExpressionTree,
  GenericExpressionTree,
  IExpressionTree,
  ITree,
  TGenericNodeContent,
  TNodePojo,
  TTreePojo,
} from "predicate-tree-advanced-poc/dist/src";
import type {
  TFsFieldLogicCheck,
  TFsFieldLogic,
  TFsFieldAny,
} from "./type.field";
import { FsStringCalculationTree } from "./FsStringCalculationTree";
import { TFieldLogic } from "../fs-goof/types";
export type TFsNode = {
  fieldId: string;
  sectionChildren: string[];
  sectionParents: string[];
  fieldJson: Partial<TFsFieldAny>;
};
class FSExpressionTree extends AbstractExpressionTree<TFsNode> {
  //
  createSubtreeFromCalcStringAt(
    targetNodeId: string,
    fieldJson: Partial<TFsFieldAny>
  ): IExpressionTree<TFsNode> {
    const subtree = FsStringCalculationTree.fromCalculationString(
      "_subtree_",
      fieldJson
    );
    const subtreeParentNodeId = this.appendChildNodeWithContent(
      targetNodeId,
      subtree
    );

    AbstractExpressionTree.reRootTreeAt<TFsNode>(
      subtree,
      subtree.rootNodeId,
      subtreeParentNodeId
    );
    subtree.attacheToParentTree(subtreeParentNodeId, this._incrementor);

    return subtree as IExpressionTree<TFsNode>;
  }

  createSubtreeAt<FSExpressionTree>(
    targetNodeId: string
  ): IExpressionTree<TFsNode> {
    const subtree = new FSExpressionTree("_subtree_");

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

  static fromEmpty(rootNodeIdSeed?: string, nodeContent?: TFsFieldAny) {
    const node = {
      fieldId: "",
      sectionChildren: [],
      sectionParents: [],
      fieldJson: nodeContent || {},
    };
    return new FSExpressionTree(rootNodeIdSeed, node);
  }
}

export { FSExpressionTree };
