import {
  TFsFieldLogicCheckLeaf,
  TFsFieldLogicJunction,
  TFsJunctionOperators,
  TFsVisibilityModes,
} from "../../../types";

// action: TFsVisibilityModes;
// conditional: C; // TLogicJunctionOperators;
// TFsJunctionOperators
type BranchToBranchConflictRule = {
  action: TFsVisibilityModes;
  condition: TFsJunctionOperators;
};
type RuleConflictType = {
  conditionalA: BranchToBranchConflictRule;
  conditionalB: BranchToBranchConflictRule;
};

export type { RuleConflictType };
