// import { ITreeVisitor } from "../ITree";
// import { TGenericNodeContent } from "../types";

import {
  ITreeVisitor,
  TGenericNodeContent,
} from "predicate-tree-advanced-poc/dist/src";
import {
  TFsFieldLogicNode,
  TFsJunctionOperators,
  TFsLeafOperators,
} from "../types";
import { AbstractLogicNode } from "./FsLogicTreeDeep/LogicNodes/AbstractLogicNode";

// type TFsLeafOperators =
//   // these probably need to be confirmed
//   | "lt" // numeric operators
//   | "gt" // numeric operators
//   | "==" // numeric operators
//   | "!=" // numeric operators
//   | "dateIsEqual"
//   | "dateIsNotEqual"
//   | "dateAfter"
//   | "dateBefore"
//   | "dateIsNotBetween" // (range)
//   | "dateIsBetween" // (range);
//   | "equals"
//   | "notequals"
//   | "lessthan"
//   | "$gte"
//   | "greaterthan"
//   | "$lte";

const negatedOperators: { [operator in TFsLeafOperators]: TFsLeafOperators } = {
  lt: "$gte", // numeric operators
  gt: "$lte", // numeric operators
  "==": "!=", // numeric operators
  "!=": "==", // numeric operators
  dateIsEqual: "dateIsNotEqual",
  dateIsNotEqual: "dateIsEqual",
  dateAfter: "dateBefore",
  dateBefore: "dateAfter",
  dateIsNotBetween: "dateIsBetween", // (range)
  dateIsBetween: "dateIsNotBetween", // (range);
  equals: "notequals",
  notequals: "equals",
  lessthan: "$gte",
  $gte: "lessthan",
  greaterthan: "$lte",
  $lte: "greaterthan",
};

const negateLeafOperators = (operator: TFsLeafOperators): TFsLeafOperators => {
  return negatedOperators[operator];
};

const negateJunctionOperators = (
  operator: TFsJunctionOperators
): TFsJunctionOperators => (operator === "all" ? "any" : "all");

class NegateVisitor<T extends object>
  implements ITreeVisitor<AbstractLogicNode>
{
  public includeSubtrees = true;
  public contentItems: any[] = [];
  public contentItemsExt: any[] = [];
  public rootNodeIds: string[] = [];
  public uniqueVisits: any = {};
  visit(
    nodeId: string,
    nodeContent: TGenericNodeContent<AbstractLogicNode>,
    parentId: string
  ): void {
    if (nodeContent === null) {
      return;
    }
    if ("conditional" in nodeContent) {
      nodeContent.conditional = negateJunctionOperators(
        // @ts-ignore
        nodeContent.conditional
      );
    }
    if ("condition" in nodeContent) {
      // @ts-ignore
      nodeContent.condition = negateLeafOperators(nodeContent.condition);
    }
  }
}

export { NegateVisitor };
