import { TFsFieldLogicCheckLeaf } from "../../types";
import { FsCircularDependencyNode } from "./FsCircularDependencyNode";

type RuleConflictType = {
  conditionalA: TFsFieldLogicCheckLeaf;
  conditionalB: TFsFieldLogicCheckLeaf;
};

class FsCircularMutualInclusiveNode extends FsCircularDependencyNode {
  private _ruleConflict: RuleConflictType;
  constructor(
    sourceFieldId: string,
    targetFieldId: string,
    dependentChainFieldIds: string[],
    ruleConflict: RuleConflictType
  ) {
    super(sourceFieldId, targetFieldId, dependentChainFieldIds);
    this._ruleConflict = ruleConflict;
  }

  get ruleConflict(): RuleConflictType {
    return this._ruleConflict;
  }

  getLastVisitedFieldId() {
    return this._targetFieldId;
  }
}
export { FsCircularMutualInclusiveNode };
