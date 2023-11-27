import { transformers } from "../../../../../transformers";
import { TStatusRecord } from "../../../../Evaluator/type";
import { TFsFieldLogicCheckLeaf } from "../../../types";
import { FsCircularDependencyNode } from "./FsCircularDependencyNode";
import type { RuleConflictType } from "./type";
class FsCircularMutualExclusiveNode extends FsCircularDependencyNode {
  //  private _ruleConflict: RuleConflictType;
  constructor(
    sourceFieldId: string,
    sourceNodeId: string | null,
    targetFieldId: string,
    targetNodeId: string | null,
    dependentChainFieldIds: string[],
    ruleConflict: RuleConflictType
  ) {
    super(
      sourceFieldId,
      sourceNodeId,
      targetFieldId,
      targetNodeId,
      dependentChainFieldIds,
      ruleConflict
    );
    //    this._ruleConflict = ruleConflict;
  }

  getLastVisitedFieldId() {
    return this._targetFieldId;
  }

  toPojo(): object {
    const {
      // @ts-ignore
      conditionalB: { condition, option, fieldId },
    } = this.ruleConflict;

    return {
      nodeType: this.nodeType,
      ruleConflict: {
        // because there is some weird typing issue
        conditionalB: { condition, option, fieldId },
        // @ts-ignore
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
