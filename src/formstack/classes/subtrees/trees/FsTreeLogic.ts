import {
  AbstractExpressionTree,
  IExpressionTree,
} from "predicate-tree-advanced-poc/dist/src";
import { TFsFieldAnyJson } from "../../types";
import type {
  TFsFieldLogicCheckLeaf,
  TFsFieldLogicCheckLeafJson,
  TFsFieldLogicJunction,
  TFsFieldLogicJunctionJson,
  TFsLogicNode,
  TFsLogicNodeJson,
  TFsVisibilityModes,
  TFsJunctionOperators,
} from "../types";
import { AbstractFsTreeLogic } from "./AbstractFsTreeLogic";

const andReducer = (prev: boolean | null, cur: boolean | null) => {
  return prev && cur;
};

const orReducer = (prev: boolean | null, cur: boolean | null) => {
  return prev || cur;
};

class FsTreeLogic extends AbstractFsTreeLogic<TFsLogicNode> {
  public _debug_visitedFieldIds: string[] = []; // this maybe better as getChildren(filter)

  createSubtreeAt(nodeId: string): IExpressionTree<TFsLogicNode> {
    // *tmc* needs to make this a real thing, I guess: or add it to the abstract?
    return new FsTreeLogic();
  }

  protected defaultJunction(nodeId: string): TFsLogicNode {
    // @ts-ignore - doesn't match shape of proper junction (no fieldJson or fieldId).  But this is
    // only used for creating 'virtual' trees with field and panel logic, hence no nodeContent or then 'all'
    return { conditional: "all", fieldJson: {} };
  }

  getDependantFieldIds() {
    return this.getShallowDependantFieldIds();
  }

  getShallowDependantFieldIds(): string[] {
    const children = this.getChildrenContentOf(
      this.rootNodeId
    ) as TFsLogicNode[]; // shallow = only the children
    return children.map((child) =>
      // @ts-ignore - fieldId, ownerId not on type TFsLogic...
      child.fieldId ? child.fieldId : child.ownerFieldId
    );
    return [];
  }

  evaluateWithValues<T>(values: { [fieldId: string]: any }): T | undefined {
    const parent = this.getChildContentAt(
      this.rootNodeId
    ) as unknown as TFsFieldLogicJunction<TFsJunctionOperators>;
    const { conditional } = parent;
    const children = this.getChildrenContentOf(
      this.rootNodeId
    ) as TFsFieldLogicCheckLeaf[];

    const evaluatedChildren = children.map((child) => {
      switch (child.condition) {
        case "==":
          return values[child.fieldId] === child.option;
        case "gt":
          // guard against null/undefined
          return child.option && values[child.fieldId] > child.option;
      }
    });

    if (conditional === "all") {
      // @ts-ignore - not happy about typing of 'andReducer'
      return evaluatedChildren.reduce(andReducer, true) as T;
    }
    if (conditional === "any") {
      // @ts-ignore - not happy about typing of 'orReducer'
      return evaluatedChildren.reduce(orReducer, false) as T;
    }

    // we'll return undefined if something goes wrong
  }

  evaluateShowHide(values: { [fieldId: string]: any }): TFsVisibilityModes {
    return this.evaluateWithValues<boolean>(values) ? this.action : null;
  }

  static fromFieldJson(fieldJson: TFsFieldAnyJson): FsTreeLogic {
    // we should be receiving fieldJson.logic, but the Abstract._fieldJson is not typed properly
    // const logicJson: TFsLogicNodeJson = fieldJson.logic;
    // or maybe always get the whole json?

    const logicJson: TFsLogicNodeJson =
      fieldJson.logic as TFsFieldLogicJunctionJson;
    const { action, conditional, checks } = logicJson;
    const rootNode = {
      fieldId: fieldJson.id || "__MISSING_ID__",
      conditional,
      action: action || "Show", // *tmc* shouldn't be implementing business logic here
      logicJson,
      checks,
    };

    const tree = new FsTreeLogic(
      fieldJson.id || "_calc_tree_",
      // @ts-ignore - there is a little confuse about a tree node and a logic node
      rootNode as TFsLogicNode
    );
    tree._action = action || null;
    tree._fieldJson = logicJson;
    tree._ownerFieldId = fieldJson.id || "_calc_tree_";

    const { leafExpressions } = transformLogicLeafJsonToLogicLeafs(
      tree.fieldJson as TFsFieldLogicJunctionJson
    );

    // @ts-ignore - there is a little confuse about a tree node and a logic node
    leafExpressions.forEach((childNode: TFsLogicNode) => {
      // const { condition, fieldId, option } =
      //   childNode as TFsFieldLogicCheckLeaf;
      // const leafNode = { fieldId, condition, option };
      // tree.appendChildNodeWithContent(tree.rootNodeId, leafNode);
      tree.appendChildNodeWithContent(tree.rootNodeId, childNode);
    });

    return tree;
  }

  static createSubtreeFromFieldJson<T>(
    rootTree: FsTreeLogic,
    targetRootId: string,
    fieldJson: TFsFieldAnyJson,
    subtreeConstructor?:
      | ((fieldJson: TFsFieldAnyJson) => AbstractExpressionTree<FsTreeLogic>)
      | undefined
  ): T {
    const subtree = subtreeConstructor
      ? subtreeConstructor(fieldJson)
      : new FsTreeLogic(targetRootId);
    const logicJson: TFsLogicNodeJson =
      fieldJson.logic as TFsFieldLogicJunctionJson;

    const { action, conditional } = logicJson;

    (subtree as FsTreeLogic)._action = action || null;
    (subtree as FsTreeLogic)._fieldJson = logicJson;

    const rootNode: TFsFieldLogicJunctionJson = {
      action,
      conditional,
      fieldJson: logicJson,
      checks: undefined, // we won't use this,  this becomes children
    };

    subtree.replaceNodeContent(
      subtree.rootNodeId,
      // @ts-ignore Junction not a node type
      rootNode as TFsFieldLogicJunction
    );

    const subtreeParentNodeId = rootTree.appendChildNodeWithContent(
      targetRootId,
      subtree as FsTreeLogic
    );

    AbstractExpressionTree.reRootTreeAt<FsTreeLogic>(
      subtree as AbstractExpressionTree<FsTreeLogic>,
      (subtree as AbstractExpressionTree<FsTreeLogic>).rootNodeId,
      subtreeParentNodeId
    );
    (subtree as FsTreeLogic)._rootNodeId = subtreeParentNodeId;
    (subtree as FsTreeLogic)._incrementor = (
      rootTree as FsTreeLogic
    )._incrementor;

    const { leafExpressions } = transformLogicLeafJsonToLogicLeafs(
      (subtree as FsTreeLogic).fieldJson as TFsFieldLogicJunctionJson
    );

    leafExpressions.forEach((childNode: any) => {
      subtree.appendChildNodeWithContent(subtree.rootNodeId, childNode);
    });

    return subtree as T;
  }
}

const transformLogicLeafJsonToLogicLeafs = (
  logicJson: TFsFieldLogicJunctionJson
) => {
  const { action, conditional, checks } = logicJson || {};
  const op = conditional === "all" ? "$and" : "$or";

  const leafExpressions = (checks || []).map((check) => {
    const { condition, field, option } =
      check as unknown as TFsFieldLogicCheckLeafJson;
    return {
      fieldId: field + "" || "__MISSING_ID__",
      fieldJson: check,
      condition: convertFsOperatorToOp(
        check as unknown as TFsFieldLogicCheckLeafJson
      ),
      option,
    };
  });
  return { leafExpressions };
};

export { FsTreeLogic };

const convertFsOperatorToOp = (check: TFsFieldLogicCheckLeafJson) => {
  // if (check.condition === "equals") {
  //   return "$eq";
  // }
  // if (check.condition === "greaterThan") {
  //   return "$gt";
  // }

  return check.condition;
};
