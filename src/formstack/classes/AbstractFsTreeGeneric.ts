import {
  AbstractExpressionTree,
  IExpressionTree,
} from "predicate-tree-advanced-poc/dist/src";
import type { TFsFieldAny } from "../type.field";

import { TFsNode, TFsFieldAnyJson } from "./types";
const fieldJsonToNodeContent = (json: Partial<TFsFieldAny>): TFsNode => {
  return {
    fieldId: json.id || "__MISSING_ID__",
    fieldJson: json,
  } as TFsNode;
};

abstract class AbstractFsTreeGeneric<
  T extends TFsNode = TFsNode
> extends AbstractExpressionTree<TFsNode> {
  protected _fieldJson!: Partial<TFsFieldAny>;
  //  protected _fieldId!: string;
  //

  // get fieldId() {
  //   return this._fieldId;
  // }

  get fieldJson() {
    return this._fieldJson;
  }

  getDependantFields(): string[] {
    return [];
  }

  createSubtreeFromFieldJson<
    T extends AbstractFsTreeGeneric = AbstractFsTreeGeneric
  >(
    targetRootId: string,
    fieldJson: TFsFieldAnyJson,
    subtreeConstructor?: (
      rootIdSeed: string,
      //   rootNodeContent?: TFsNode,
      fieldJson: TFsFieldAnyJson
    ) => T
  ): T {
    const subtree = subtreeConstructor
      ? subtreeConstructor("_subtree_", fieldJson)
      : new GenericAbstractFsTreeGeneric(targetRootId);

    const subtreeParentNodeId = this.appendChildNodeWithContent(
      targetRootId,
      subtree
    );

    AbstractExpressionTree.reRootTreeAt<TFsNode>(
      subtree,
      subtree.rootNodeId,
      subtreeParentNodeId
    );
    subtree._rootNodeId = subtreeParentNodeId;
    subtree._incrementor = this._incrementor;

    return subtree as T; // IExpressionTree<TFsNode>;
  }

  static fromFieldJson(fieldJson: Partial<TFsFieldAny>): AbstractFsTreeGeneric {
    const tree = new GenericAbstractFsTreeGeneric(
      fieldJson.id,
      fieldJsonToNodeContent(fieldJson)
    );
    // tree._fieldId = fieldJson.id || "__MISSING__";
    tree._fieldJson = fieldJson;
    return tree;
  }

  static fromEmpty(rootNodeIdSeed?: string, nodeContent?: TFsFieldAny) {
    const node = {
      fieldId: "",
      sectionChildren: [],
      sectionParents: [],
      fieldJson: nodeContent || {},
    };
    return new GenericAbstractFsTreeGeneric(rootNodeIdSeed, node);
  }

  //   static createSubtree(
  //     tree: AbstractFsTreeGeneric,
  //     subtreeConstructor: (
  //       rootIdSeed?: string,
  //       rootNodeContent?: any
  //     ) => AbstractFsTreeGeneric
  //   ): AbstractFsTreeGeneric {
  //     return subtreeConstructor();
  //   }
}

class GenericAbstractFsTreeGeneric extends AbstractFsTreeGeneric {
  createSubtreeAt(targetNodeId: string): IExpressionTree<TFsNode> {
    return new GenericAbstractFsTreeGeneric(targetNodeId);
  }
}

export { AbstractFsTreeGeneric };
