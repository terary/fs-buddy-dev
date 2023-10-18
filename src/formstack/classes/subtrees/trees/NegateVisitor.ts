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
  implements ITreeVisitor<TFsFieldLogicNode>
{
  public includeSubtrees = true;
  public contentItems: any[] = [];
  public contentItemsExt: any[] = [];
  public rootNodeIds: string[] = [];
  public uniqueVisits: any = {};
  visit(
    nodeId: string,
    nodeContent: TGenericNodeContent<TFsFieldLogicNode>,
    parentId: string
  ): void {
    if (nodeContent === null) {
      return;
    }
    if ("conditional" in nodeContent) {
      nodeContent.conditional = negateJunctionOperators(
        nodeContent.conditional
      );
    }
    if ("condition" in nodeContent) {
      nodeContent.condition = negateLeafOperators(nodeContent.condition);
    }
    // this.contentItems.push({ ...nodeContent }); // probably not do this, need to fix tests
    // this.contentItemsExt.push({ ...nodeContent, nodeId, parentId });
    // if (nodeId === parentId) {
    //   this.rootNodeIds.push(parentId);
    // }
    // const uniqueKey = [nodeId, parentId].sort().join(":");
    // if (uniqueKey in this.uniqueVisits) {
    //   this.uniqueVisits[uniqueKey] += 1;
    // } else {
    //   this.uniqueVisits[uniqueKey] = 1;
    // }
  }
}

export { NegateVisitor };
