import {
  AbstractExpressionTree,
  IExpressionTree,
} from "predicate-tree-advanced-poc/dist/src";
import type { TFsFieldAny } from "../../../../type.field";

import { TFsNode, TFsFieldAnyJson } from "../../../types";
import {
  TFsFieldLogicCheckLeafJson,
  TFsFieldLogicJunctionJson,
} from "../../types";

abstract class AbstractLogicTree<
  T extends object
> extends AbstractExpressionTree<T> {
  protected _fieldJson!:
    | Partial<TFsFieldAny>
    | TFsFieldLogicJunctionJson
    | TFsFieldLogicCheckLeafJson
    | string
    | null; // because this is inherited by logic, and fieldJson.logic maybe null

  //    | null;  // *tmc* I don't think this should ever be null

  getDependantFieldIds(): string[] {
    return [];
  }

  get fieldJson() {
    return this._fieldJson;
  }

  protected findAllNodesOfType<T>(objectType: any): T[] {
    const nodeIds = this.getTreeNodeIdsAt(this.rootNodeId);
    const logicTrees = nodeIds
      .filter(
        (nodeId: any) => this.getChildContentAt(nodeId) instanceof objectType
      )
      .map((nodeId) => this.getChildContentAt(nodeId)) as T[];

    return logicTrees;
  }

  // is this being used?
  createSubtreeFromFieldJson(
    targetRootId: string,
    fieldJson: TFsFieldAnyJson,
    subtreeConstructor?: (
      rootIdSeed: string,
      //   rootNodeContent?: TFsNode,
      fieldJson: TFsFieldAnyJson
    ) => AbstractLogicTree<T>
  ): AbstractLogicTree<T> {
    const subtree = (
      subtreeConstructor
        ? subtreeConstructor("_subtree_", fieldJson)
        : new GenericAbstractFsTreeGeneric(targetRootId)
    ) as AbstractLogicTree<T>;
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

export { AbstractLogicTree };
