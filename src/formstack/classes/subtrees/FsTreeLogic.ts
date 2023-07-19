import {
  AbstractExpressionTree,
  IExpressionTree,
  TGenericNodeContent,
} from "predicate-tree-advanced-poc/dist/src";
import { TFsFieldAnyJson, TFsNode } from "../types";
import { AbstractFsTreeGeneric } from "../AbstractFsTreeGeneric";
import { TFsFieldLogic, TFsFieldLogicCheck } from "../../type.field";
import type { TLogicNode } from "./types";
class FsTreeLogic extends AbstractFsTreeGeneric<TLogicNode> {
  private _dependantFieldIds: string[] = [];

  // not sure this is appropriate.  Should not be able to create
  // logic subtree in given context.  Eg: Formstack does not have a
  // user for this currently. (they're max depth is 1)
  createSubtreeAt(targetNodeId: string): IExpressionTree<TFsNode> {
    return new FsTreeLogic();
  }

  evaluateWithValues<T>(values: { [fieldId: string]: any }): T {
    let calcString = this._fieldJson.calculation || "";
    this._dependantFieldIds.forEach((fieldId) => {
      calcString = calcString.replace(`[${fieldId}]`, `${values[fieldId]}`);
    });
    return eval(calcString);
  }

  getDependantFields(): string[] {
    return this._dependantFieldIds.slice();
  }
  static fromFieldJson(fieldJson: TFsFieldAnyJson): FsTreeLogic {
    const rootNode = {
      fieldId: fieldJson.id || "_MISSING_ID_",
      fieldJson: fieldJson.logic as TFsFieldLogic, // not sure TFsLogic or TFsLogicCheck
    };

    const tree = new FsTreeLogic(fieldJson.id || "_calc_tree_", rootNode);
    // tree._fieldId = fieldJson.id || "_MISSING_ID_";
    tree._fieldJson = fieldJson;
    tree.replaceNodeContent(tree.rootNodeId, rootNode);

    const { nodeContent, childrenLeafExpressions } =
      transformLogicExpressionJsonToNodeAndLeafs(fieldJson);
    tree.replaceNodeContent(tree.rootNodeId, nodeContent as TFsNode);
    childrenLeafExpressions.forEach((childNode: any) => {
      tree.appendChildNodeWithContent(tree.rootNodeId, childNode);
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

const transformLogicExpressionJsonToNodeAndLeafs = (
  fieldJson: Partial<TFsFieldAnyJson>
) => {
  const { action, conditional, checks } = fieldJson.logic || {};
  const op = conditional === "all" ? "$and" : "$or";

  const leafExpressions = (checks || []).map((check) => {
    const { condition, field, option } = check;
    return {
      fieldId: field + "" || "__MISSING_ID__",
      fieldJson: check,
      //   condition: convertFsOperatorToOp(check),
      operator: convertFsOperatorToOp(check),
      option,
    };
  });
  return {
    // *tmc* down and dirty, it would be better to use some sort of filter (joi or similar)
    nodeContent: {
      fieldJson: { action, conditional, ...fieldJson },
      fieldId: fieldJson.id || "__MISSING_ID__",
      operator: op,
      //   const op = conditional === "all" ? "$and" : "$or";
    },
    childrenLeafExpressions: leafExpressions,
  };
};
export { FsTreeLogic };

const convertFsOperatorToOp = (check: TFsFieldLogicCheck) => {
  if (check.condition === "equals") {
    return "$eq";
  }
  if (check.condition === "greaterThan") {
    return "$gt";
  }

  return check.condition;
};
