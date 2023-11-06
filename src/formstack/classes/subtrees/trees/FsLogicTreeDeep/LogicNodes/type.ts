import {
  TFsFieldLogicCheckLeaf,
  TFsFieldLogicJunction,
  TFsJunctionOperators,
} from "../../../types";

type RuleConflictType = {
  conditionalA:
    | TFsFieldLogicCheckLeaf
    | TFsFieldLogicJunction<TFsJunctionOperators>;
  conditionalB:
    | TFsFieldLogicCheckLeaf
    | TFsFieldLogicJunction<TFsJunctionOperators>;
};

export type { RuleConflictType };
