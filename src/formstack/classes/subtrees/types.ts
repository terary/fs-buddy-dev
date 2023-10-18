import { FsFieldModel } from "./trees";
import {
  FsCircularDependencyNode,
  FsMaxDepthExceededNode,
} from "./trees/FsLogicTreeDeep";

type TFsArithmeticOperator = { operator: "+" | "*" | "-" | "/" };
type TFsArithmeticLeaf = {
  operand: string | number | Date; // dates can be used?
  isFieldReference: boolean;
};
type TFsArithmeticNode = TFsArithmeticLeaf | TFsArithmeticOperator;
type xTLogicJunctionOperators = "$and" | "$or" | "$in"; // maybe not?
type xTLogicLeafOperators = "$eq" | "$ne" | "$gt" | "$lt"; // maybe not?,  I think *not* gets encoded? '$ne' not($gt) == $lte ?
type TFsLeafOperators =
  // these probably need to be confirmed
  | "lt" // numeric operators
  | "gt" // numeric operators
  | "==" // numeric operators
  | "!=" // numeric operators
  | "dateIsEqual"
  | "dateIsNotEqual"
  | "dateAfter"
  | "dateBefore"
  | "dateIsNotBetween" // (range)
  | "dateIsBetween" // (range);
  | "equals"
  | "notequals"
  | "lessthan"
  | "$gte"
  | "greaterthan"
  | "$lte";
type TFsJunctionOperators = "any" | "all" | "$not"; /// $not - extends FS junction operators

// type TLogicJunction = { operator: TLogicJunctionOperators };
// type TLogicLeaf = {
//   fieldId: string;
//   operator: TLogicLeafOperators;
//   value?: number | string | Date | null;
// };

type TFsVisibilityModes = "Show" | "Hide" | null; // null indicates the logic failed to evaluated (circular reference or similar error)

type TFsFieldLogicCheckLeaf = {
  // [fieldId] $eq [option] (condition -> $eq)
  fieldId: string; // fieldId
  condition: TFsLeafOperators;
  option: string; // TFsVisibilityModes;
};

// because - we refer to it as fieldId - not field
type TFsFieldLogicCheckLeafJson = Omit<
  Partial<TFsFieldLogicCheckLeaf>,
  "fieldId"
> & { field: string | undefined };

type TFsFieldLogicJunction<C> = {
  fieldJson: any;
  action: TFsVisibilityModes;
  conditional: C; // TLogicJunctionOperators;
  checks?: null | "" | TFsFieldLogicCheckLeaf[];
  // 'ownerFieldId', doesn't belong here, because the json version will not have it.
  ownerFieldId: string; // all logic is has a field it belongs to
};

type TTreeFieldNode = {
  fieldId: string;
  field: FsFieldModel;
};

// *tmc* does this actually override?
type TFsFieldLogicJunctionJson = Partial<
  TFsFieldLogicJunction<TFsJunctionOperators>
> & {
  checks?: null | "" | TFsFieldLogicCheckLeafJson[];
};
type TFsFieldLogicNode =
  | TFsFieldLogicJunction<TFsJunctionOperators>
  | TFsFieldLogicCheckLeaf;

type TFsLogicNode =
  | TFsFieldLogicJunction<TFsJunctionOperators>
  | TFsFieldLogicCheckLeaf
  | FsCircularDependencyNode
  | FsMaxDepthExceededNode;
type TFsLogicNodeJson = TFsFieldLogicJunctionJson | TFsFieldLogicCheckLeafJson;

type TSimpleDictionary<T> = {
  [key: string]: T;
};

export type {
  TFsArithmeticNode,
  TFsFieldLogicCheckLeaf,
  TFsFieldLogicCheckLeafJson,
  TFsFieldLogicJunction,
  TFsFieldLogicJunctionJson,
  TFsFieldLogicNode,
  TFsJunctionOperators,
  TFsLeafOperators,
  TFsLogicNode,
  TFsLogicNodeJson,
  TFsVisibilityModes,
  // TLogicJunctionOperators,
  TSimpleDictionary,
  TTreeFieldNode,
};
