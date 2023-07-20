import { IExpressionTree } from "predicate-tree-advanced-poc/dist/src";
import { TFsFieldAnyJson } from "../../types";
import { AbstractFsTreeGeneric } from "./AbstractFsTreeGeneric";
import type {
  TFsFieldLogicCheckLeaf,
  TFsFieldLogicCheckLeafJson,
  TFsFieldLogicJunction,
  TFsFieldLogicJunctionJson,
  TFsLogicNode,
  TFsLogicNodeJson,
} from "../types";

const andReducer = (prev: boolean, cur: boolean) => {
  return prev && cur;
};

const orReducer = (prev: boolean, cur: boolean) => {
  return prev || cur;
};

class FsTreeLogic extends AbstractFsTreeGeneric<TFsLogicNode> {
  private _dependantFieldIds: string[] = [];

  createSubtreeAt(nodeId: string): IExpressionTree<TFsLogicNode> {
    // *tmc* needs to make this a real thing, I guess: or add it to the abstract?
    return new FsTreeLogic();
  }

  evaluateWithValues<T>(values: { [fieldId: string]: any }): T | undefined {
    // We can get away with not doing a full descend because FS doesn't
    // branch at this point (though a full branch would be good)
    // -------
    // We *should* be doing getField('...').evaluate({}) === inputValue  -- this may spawn into bunches of stuff.  Maybe best not use getField().evaluate
    //     or evaluateNoSpawn() ? getField().evaluate spawn because it's 'fieldTree' we need another thing that getFieldNode(...) which should not spawn
    //     the evaluate is important because the field maybe produce and or dropdown, the fields - knows the rules to evaluate itself
    const parent = this.getChildContentAt(
      this.rootNodeId
    ) as TFsFieldLogicJunction;
    const { conditional } = parent;

    const children = this.getChildrenContentOf(
      this.rootNodeId
    ) as TFsFieldLogicCheckLeaf[];

    const evaluatedChildren = children.map((child) => {
      switch (child.condition) {
        case "equals":
          return values[child.fieldId] === child.option;
        case "greaterThan":
          // guard against null/undefined
          return child.option && values[child.fieldId] > child.option;
      }
    });

    if (conditional === "all") {
      return evaluatedChildren.reduce(andReducer, true) as T;
    }
    if (conditional === "any") {
      return evaluatedChildren.reduce(orReducer, false) as T;
    }

    // we'll return undefined if something goes wrong
  }

  getDependantFields(): string[] {
    return this._dependantFieldIds.slice();
  }
  static fromFieldJson(fieldJson: TFsFieldAnyJson): FsTreeLogic {
    // we should be receiving fieldJson.logic, but the Abstract._fieldJson is not typed properly
    // const logicJson: TFsLogicNodeJson = fieldJson.logic;
    // or maybe always get the whole json?

    const logicJson: TFsLogicNodeJson =
      fieldJson.logic as TFsFieldLogicJunctionJson;
    const { action, conditional } = logicJson;
    const rootNode: TFsFieldLogicJunctionJson = {
      action,
      conditional,
      fieldJson: logicJson,
      checks: undefined, // we won't use this,  this becomes children
    };

    const tree = new FsTreeLogic(
      fieldJson.id || "_calc_tree_",
      rootNode as TFsLogicNode
    );
    // @ts-ignore - this needs to get fixed in the Abstract
    tree._fieldJson = logicJson;
    const { leafExpressions } = transformLogicLeafJsonToLogicLeafs(
      tree.fieldJson as TFsFieldLogicJunctionJson
    );

    leafExpressions.forEach((childNode: any) => {
      tree.appendChildNodeWithContent(tree.rootNodeId, childNode);
      // should this be done at a different level. I mean calculated?
      tree._dependantFieldIds.push(childNode.fieldId);
    });

    return tree;
  }

  static createSubtreeFromFieldJson<FsTreeCalcString>(
    targetRootId: string,
    fieldJson: TFsFieldAnyJson,
    subtreeConstructor?:
      | ((rootIdSeed: string, fieldJson: TFsFieldAnyJson) => FsTreeCalcString)
      | undefined
  ): FsTreeLogic {
    // before you fix this....
    // I *think* this should be in a super class and shared with 'calcString' subtree
    const tree = FsTreeLogic.fromFieldJson(fieldJson);

    // this isn't a subtree

    return tree;
  }
}

const transformLogicLeafJsonToLogicLeafs = (
  logicJson: TFsFieldLogicJunctionJson
) => {
  const { action, conditional, checks } = logicJson || {};
  const op = conditional === "all" ? "$and" : "$or";

  const leafExpressions = (checks || []).map((check) => {
    const { condition, field, option } = check;
    return {
      fieldId: field + "" || "__MISSING_ID__",
      fieldJson: check,
      //   condition: convertFsOperatorToOp(check),
      // operator: convertFsOperatorToOp(check),
      condition: convertFsOperatorToOp(check),
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
