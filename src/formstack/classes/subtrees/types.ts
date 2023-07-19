type TFsArithmeticOperator = "+" | "*" | "-" | "/";
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

type TLogicNode = TLogicJunction | TLogicLeaf;

export type { TFsArithmeticNode, TLogicNode };
