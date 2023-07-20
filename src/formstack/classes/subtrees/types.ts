type TFsArithmeticOperator = { operator: "+" | "*" | "-" | "/" };
type TFsArithmeticLeaf = {
  operand: string | number | Date; // dates can be used?
  isFieldReference: boolean;
};
type TFsArithmeticNode = TFsArithmeticLeaf | TFsArithmeticOperator;

type TFsLogicOperators = "any" | "all";
type TLogicJunctionOperators = "$and" | "$or"; // maybe not?
type TLogicLeafOperators = "$eq" | "$gt" | "$lt"; // maybe not?,  I think *not* gets encoded? '$ne' not($gt) == $lte ?
type TLogicJunction = { operator: TLogicJunctionOperators };
type TLogicLeaf = {
  fieldId: string;
  operator: TLogicLeafOperators;
  value?: number | string | Date | null;
};

type TFsFieldLogicCheckLeaf = {
  fieldId: string; // fieldId
  condition: "equals" | "greaterThan"; // not sure greaterThan is valid. Need to find all valid
  option: "Show"; // values of the target field (not the same as TFsFieldLogic.action)
};

// because - we refer to it as fieldId - not field
type TFsFieldLogicCheckLeafJson = Omit<
  Partial<TFsFieldLogicCheckLeaf>,
  "fieldId"
> & { field: string | undefined };

type TFsFieldLogicJunction = {
  fieldJson: any;
  action: "show";
  conditional: "all" | "any";
  // checks: null | TFsFieldLogicCheckLeaf[];
};

type TFsFieldLogicJunctionJson = Partial<TFsFieldLogicJunction> & {
  checks: null | undefined | "" | TFsFieldLogicCheckLeafJson[];
};

type TFsLogicNode = TFsFieldLogicJunction | TFsFieldLogicCheckLeaf;
type TFsLogicNodeJson = TFsFieldLogicJunctionJson | TFsFieldLogicCheckLeafJson;

export type {
  TFsArithmeticNode,
  TFsFieldLogicCheckLeaf,
  TFsFieldLogicCheckLeafJson,
  TFsFieldLogicJunction,
  TFsFieldLogicJunctionJson,
  TFsLogicNode,
  TFsLogicNodeJson,
  // TLogicNode,
  // TLogicNodeJson,
};
