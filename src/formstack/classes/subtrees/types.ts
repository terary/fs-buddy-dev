import { FsTreeField } from "./trees";
import { FsCircularDependencyNode } from "./trees/nodes/FsCircularDependencyNode";
import { FsMaxDepthExceededNode } from "./trees/nodes/FsMaxDepthExceededNode";

type TFsArithmeticOperator = { operator: "+" | "*" | "-" | "/" };
type TFsArithmeticLeaf = {
  operand: string | number | Date; // dates can be used?
  isFieldReference: boolean;
};
type TFsArithmeticNode = TFsArithmeticLeaf | TFsArithmeticOperator;
type TLogicJunctionOperators = "$and" | "$or" | "$in"; // maybe not?
type TLogicLeafOperators = "$eq" | "$ne" | "$gt" | "$lt"; // maybe not?,  I think *not* gets encoded? '$ne' not($gt) == $lte ?
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
  | "dateIsBetween"; // (range);

type TFsJunctionOperators = "any" | "all"; /// these may actually be any/or

type TLogicJunction = { operator: TLogicJunctionOperators };
type TLogicLeaf = {
  fieldId: string;
  operator: TLogicLeafOperators;
  value?: number | string | Date | null;
};

type TFsVisibilityModes = "Show" | "Hide" | null; // null indicates the logic failed to evaluated (circular reference or similar error)

type TFsFieldLogicCheckLeaf = {
  fieldId: string; // fieldId
  condition: TFsLeafOperators;
  option: TFsVisibilityModes;
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
  // 'ownerFieldId', doesn't belong here, because the json version will not have it.
  ownerFieldId: string; // all logic is has a field it belongs to
};

type TTreeFieldNode = {
  fieldId: string;
  field: FsTreeField;
};

// *tmc* does this actually override?
type TFsFieldLogicJunctionJson = Partial<
  TFsFieldLogicJunction<TFsJunctionOperators>
> & {
  checks?: null | "" | TFsFieldLogicCheckLeafJson[];
};

type TFsLogicNode =
  | TFsFieldLogicJunction<TLogicJunctionOperators>
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
  TFsJunctionOperators,
  TFsLeafOperators,
  TFsLogicNode,
  TFsLogicNodeJson,
  TFsVisibilityModes,
  TLogicJunctionOperators,
  TSimpleDictionary,
  TTreeFieldNode,
};
