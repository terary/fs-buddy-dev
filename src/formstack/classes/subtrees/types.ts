import { FsTreeField } from "./trees";
import { FsCircularDependencyNode } from "./trees/nodes/FsCircularDependencyNode";
import { FsMaxDepthExceededNode } from "./trees/nodes/FsMaxDepthExceededNode";

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

type TFsVisibilityModes = "Show" | "Hide" | null; // null indicates the logic evaluated to false,
// therefore do not return the visibility, this is where default values need to get figured out.
//

type TFsFieldLogicCheckLeaf = {
  fieldId: string; // fieldId
  condition: "equals" | "greaterThan"; // not sure greaterThan is valid. Need to find all valid
  option: TFsVisibilityModes; // values of the target field (not the same as TFsFieldLogic.action)
};

// because - we refer to it as fieldId - not field
type TFsFieldLogicCheckLeafJson = Omit<
  Partial<TFsFieldLogicCheckLeaf>,
  "fieldId"
> & { field: string | undefined };

type TFsFieldLogicJunction = {
  fieldJson: any;
  action: TFsVisibilityModes;
  conditional: "all" | "any";
  ownerFieldId: string;
  // checks: null | TFsFieldLogicCheckLeaf[];
};
type TTreeFieldNode = {
  fieldId: string;
  field: FsTreeField;
};

type TFsFieldLogicJunctionJson = Partial<TFsFieldLogicJunction> & {
  checks: null | undefined | "" | TFsFieldLogicCheckLeafJson[];
};

type TFsLogicNode =
  | TFsFieldLogicJunction
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
  TFsLogicNode,
  TFsLogicNodeJson,
  TFsVisibilityModes,
  TSimpleDictionary,
  TTreeFieldNode,
  // TLogicNode,
  // TLogicNodeJson,
};
