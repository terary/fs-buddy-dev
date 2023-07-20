import {
  AbstractExpressionTree,
  IExpressionTree,
} from "predicate-tree-advanced-poc/dist/src";
import type { TFsFieldAny } from "../../../type.field";

import { TFsNode, TFsFieldAnyJson } from "../../types";
const fieldJsonToNodeContent = (json: Partial<TFsFieldAny>): TFsNode => {
  return {
    fieldId: json.id || "__MISSING_ID__",
    fieldJson: json,
  } as TFsNode;
};

abstract class AbstractFsTreeGeneric<
  T extends object
> extends AbstractExpressionTree<T> {
  protected _fieldJson!: Partial<TFsFieldAny> | string | null;
  getDependantFields(): string[] {
    return [];
  }

  get fieldJson() {
    return this._fieldJson;
  }

  // is this being used?
  createSubtreeFromFieldJson(
    targetRootId: string,
    fieldJson: TFsFieldAnyJson,
    subtreeConstructor?: (
      rootIdSeed: string,
      //   rootNodeContent?: TFsNode,
      fieldJson: TFsFieldAnyJson
    ) => AbstractFsTreeGeneric<T>
  ): AbstractFsTreeGeneric<T> {
    const subtree = (
      subtreeConstructor
        ? subtreeConstructor("_subtree_", fieldJson)
        : new GenericAbstractFsTreeGeneric(targetRootId)
    ) as AbstractFsTreeGeneric<T>;
    const subtreeParentNodeId = this.appendChildNodeWithContent(
      targetRootId,
      subtree
    );

    AbstractExpressionTree.reRootTreeAt<T>(
      subtree as AbstractExpressionTree<T>,
      subtree.rootNodeId,
      subtreeParentNodeId
    );
    subtree._rootNodeId = subtreeParentNodeId;
    subtree._incrementor = this._incrementor;

    return subtree; // IExpressionTree<TFsNode>;
  }

  // static abstract fromFieldJson<U extends object>();
  // static fromFieldJson<U extends object>(
  //   fieldJson: Partial<TFsFieldAny>
  // ): AbstractFsTreeGeneric<U> {
  //   const tree = new GenericAbstractFsTreeGeneric(
  //     fieldJson.id,
  //     fieldJsonToNodeContent(fieldJson)
  //   );
  //   return tree as U;
  // }

  static fromEmpty(rootNodeIdSeed?: string, nodeContent?: TFsFieldAny) {
    return new GenericAbstractFsTreeGeneric(rootNodeIdSeed, nodeContent);
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
class GenericAbstractFsTreeGeneric extends AbstractExpressionTree<any> {
  createSubtreeAt(targetNodeId: string): IExpressionTree<TFsNode> {
    return new GenericAbstractFsTreeGeneric(targetNodeId);
  }
}

// class GenericAbstractFsTreeGeneric extends AbstractFsTreeGeneric<any> {
//   createSubtreeAt(targetNodeId: string): IExpressionTree<TFsNode> {
//     return new GenericAbstractFsTreeGeneric(targetNodeId);
//   }
// }

export { AbstractFsTreeGeneric };
