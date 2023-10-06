import { TFsFieldAny } from "./type.field";
type TFsArithmeticOperator = { operator: "+" | "*" | "-" | "/" };
type TFsArithmeticLeaf = {
  operand: string | number | Date;
  isFieldReference: boolean;
};
type TFsArithmeticNode = TFsArithmeticLeaf | TFsArithmeticOperator;
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
  | "equals";
type TFsJunctionOperators = "any" | "all";

type TFsVisibilityModes = "Show" | "Hide" | null; // null are not allow, but it happens

type TFsFieldLogicCheckLeaf = {
  fieldId: string;
  condition: TFsLeafOperators;
  option: string; // TFsVisibilityModes;
};

// because - we refer to it as fieldId - not field (api uses "field", but we prefer "fieldId")
type TFsFieldLogicCheckLeafJson = Omit<
  Partial<TFsFieldLogicCheckLeaf>,
  "fieldId"
> & { field: string | undefined };

type TFsFieldLogicJunction<C> = {
  fieldJson: any;
  action: TFsVisibilityModes;
  conditional: C; // TLogicJunctionOperators;
  checks?: null | "" | TFsFieldLogicCheckLeaf[];
  ownerFieldId: string; // all logic is has a field it belongs to. This is a non-formstack construct.
  // Logic will be found within a field's logic, it's that fieldId referenced here.
};

type TFsFieldLogicJunctionJson = Partial<
  TFsFieldLogicJunction<TFsJunctionOperators>
> & {
  checks?: null | "" | TFsFieldLogicCheckLeafJson[];
};

type TFsLogicNode =
  | TFsFieldLogicJunction<TFsJunctionOperators>
  | TFsFieldLogicCheckLeaf;

type TFsLogicNodeJson = TFsFieldLogicJunctionJson | TFsFieldLogicCheckLeafJson;

type TSimpleDictionary<T> = {
  [key: string]: T;
};
type TFsFieldAnyJson = Omit<Partial<TFsFieldAny>, "logic"> & {
  logic: TFsLogicNode;
};

export type {
  TFsArithmeticNode,
  TFsFieldAnyJson,
  TFsFieldLogicCheckLeaf,
  TFsFieldLogicCheckLeafJson,
  TFsFieldLogicJunction,
  TFsFieldLogicJunctionJson,
  TFsJunctionOperators,
  TFsLeafOperators,
  TFsLogicNode,
  TFsLogicNodeJson,
  TFsVisibilityModes,
  TSimpleDictionary,
};
