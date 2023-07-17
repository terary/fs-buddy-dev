import {
  AbstractExpressionTree,
  IExpressionTree,
} from "predicate-tree-advanced-poc/dist/src";
import { Incrementor } from "predicate-tree-advanced-poc/dist/src/DirectedGraph/Incrementor";
import { ResolvedTypeReferenceDirectiveWithFailedLookupLocations } from "typescript";
import { TFsFieldAny } from "./type.field";
import { TFsNode } from "./FSExpressionTree";

class FsStringCalculationTree extends AbstractExpressionTree<any> {
  private _dependancyFieldIds: string[] = [];
  attacheToParentTree(
    parentProvidedRootNodeId: string,
    incrementor: Incrementor
  ) {
    // this is a hack that needs to be fixed - specifically need to be able
    // to create appropriate tree type from calculation string
    this._rootNodeId = parentProvidedRootNodeId;
    this._incrementor = incrementor;
  }
  getDependancyList() {
    return this._dependancyFieldIds.slice();
  }
  createSubtreeAt<FSExpressionTree>(
    targetNodeId: string
  ): IExpressionTree<any> {
    const subtree = new FsStringCalculationTree("_subtree_");

    const subtreeParentNodeId = this.appendChildNodeWithContent(
      targetNodeId,
      subtree
    );
    FsStringCalculationTree;

    AbstractExpressionTree.reRootTreeAt<any>(
      subtree,
      subtree.rootNodeId,
      subtreeParentNodeId
    );
    subtree._rootNodeId = subtreeParentNodeId;
    subtree._incrementor = this._incrementor;

    return subtree as IExpressionTree<any>;
  }

  static fromEmpty(rootNodeIdSeed?: string, nodeContent?: any) {
    return new FsStringCalculationTree(rootNodeIdSeed, nodeContent);
  }

  static fromCalculationString(
    rootNodeId: string,
    fieldJson: Partial<TFsFieldAny>
    // calcString: string
  ): FsStringCalculationTree {
    /**
     * Stubbing functionality.  There must be smart way to convert
     *   calculation string in to an expression but I don't have the time to find it this moment.
     *
     * returns faked tree
     */
    const fieldIds: string[] = [];
    const operators: string[] = [];
    const regExOperands = /\[(\d+)\]/g;

    // const { calculation } = fieldJson.calculation;
    const calcString = "[148149774] + [148149776] * 5";

    let match;
    while ((match = regExOperands.exec(calcString))) {
      const fieldId = match[1];
      fieldIds.push(fieldId);
    }
    const regExOperators = /[-+*/]/g;
    while ((match = regExOperators.exec(calcString))) {
      const op = match[0];
      operators.push(op);
    }
    const node: TFsNode = {
      fieldId: fieldJson.id || "__MISSING_ID__",
      sectionChildren: [],
      sectionParents: [],
      fieldJson,
    };

    const tree = new FsStringCalculationTree(rootNodeId, node);
    operators.forEach((op) => {
      const opNodeId = tree.appendChildNodeWithContent(tree.rootNodeId, op);
      fieldIds.forEach((fieldId) => {
        tree.appendChildNodeWithContent(opNodeId, { fieldId });
      });
    });
    tree._dependancyFieldIds = fieldIds;
    return tree;
  }
}

export { FsStringCalculationTree };
