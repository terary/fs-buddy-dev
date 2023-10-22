import { TNodePojo } from "predicate-tree-advanced-poc/dist/src";
import { transformers } from "../../../../../transformers";
import { TStatusRecord } from "../../../../Evaluator/type";
import { TFsFieldLogicCheckLeaf } from "../../../types";
import { FsCircularDependencyNode } from "./FsCircularDependencyNode";
import { AbstractLogicNode } from "./AbstractLogicNode";

type RuleConflictType = {
  conditionalA: TFsFieldLogicCheckLeaf;
  conditionalB: TFsFieldLogicCheckLeaf;
};

class FsCircularMutualExclusiveNode extends FsCircularDependencyNode {
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

  toPojo(): object {
    const {
      conditionalB: { condition, option, fieldId },
    } = this.ruleConflict;

    return {
      nodeType: this.nodeType,
      ruleConflict: {
        // because there is some weird typing issue
        conditionalB: { condition, option, fieldId },
        conditionalA: this.ruleConflict.conditionalA,
      },
      ...super.toPojo(),
    };
  }

  getStatusMessage(
    rootFieldId: string,
    dependentChainFieldIds?: string[]
  ): TStatusRecord[] {
    const dependentsAsString = "'" + dependentChainFieldIds?.join("', '") + "'";
    const message =
      `Logic: Mutually Exclusive circular reference. root field: ${rootFieldId}, attempted fieldId: '${this.targetFieldId}', dependency chain: "${dependentsAsString}".` +
      "Rule Conflict:" +
      transformers.Utility.jsObjectToHtmlFriendlyString(this.ruleConflict);
    return [
      {
        severity: "logic",
        fieldId: this.targetFieldId,
        message,
        relatedFieldIds: dependentChainFieldIds,
      },
      {
        severity: "warn", // duplicate message is intentional
        fieldId: this.targetFieldId,
        message,
        relatedFieldIds: dependentChainFieldIds,
      },
    ];
  }
}
export { FsCircularMutualExclusiveNode };
