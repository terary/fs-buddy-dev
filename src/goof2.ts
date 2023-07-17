import {
  AbstractExpressionTree,
  IExpressionTree,
} from "predicate-tree-advanced-poc/dist/src";

class FsStringCalculationTree extends AbstractExpressionTree<any> {
  createSubtreeAt<FSExpressionTree>(
    targetNodeId: string
  ): IExpressionTree<any> {
    const subtree = new FsStringCalculationTree("_subtree_");

    const subtreeParentNodeId = this.appendChildNodeWithContent(
      targetNodeId,
      subtree
    );

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
  static fromCalculationString(calcString: string): FsStringCalculationTree {
    /**
     * Stubbing functionality.  There must be smart way to convert
     *   calculation string in to an expression but I don't have the time to find it this moment.
     *
     * returns faked tree
     */
    const fieldIds: string[] = [];
    const operators: string[] = [];
    const regExOperands = /\[(\d+)\]/g;

    calcString = "[148149774] + [148149776] * 5";

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
    const tree = new FsStringCalculationTree();
    operators.forEach((op) => {
      const opNodeId = tree.appendChildNodeWithContent(tree.rootNodeId, op);
      fieldIds.forEach((fieldId) => {
        tree.appendChildNodeWithContent(opNodeId, { fieldId });
      });
    });
    return tree;
  }
}
const t = FsStringCalculationTree.fromCalculationString(
  "[148149774] + [148149776] * 5"
);
console.log({ t });
