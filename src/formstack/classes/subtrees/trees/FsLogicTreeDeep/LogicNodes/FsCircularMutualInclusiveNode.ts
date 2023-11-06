import { transformers } from "../../../../../transformers";
import { TStatusRecord } from "../../../../Evaluator/type";
import { TFsFieldLogicCheckLeaf } from "../../../types";
import { FsCircularDependencyNode } from "./FsCircularDependencyNode";

type RuleConflictType = {
  conditionalA: TFsFieldLogicCheckLeaf;
  conditionalB: TFsFieldLogicCheckLeaf;
};

class FsCircularMutualInclusiveNode extends FsCircularDependencyNode {
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
    // this._ruleConflict = ruleConflict;
  }

  getLastVisitedFieldId() {
    return this._targetFieldId;
  }

  toPojo(): object {
    // const {
    //   conditionalB: { condition, option, fieldId },
    // } = this.ruleConflict;

    const ruleConflict = this.ruleConflict
      ? {
          // because there is some weird typing issue
          conditionalB: this.ruleConflict.conditionalB, //{ condition, option, fieldId },
          conditionalA: this.ruleConflict.conditionalA,
        }
      : null;

    return {
      nodeType: this.nodeType,
      ruleConflict,
      // ruleConflict: {
      //   // because there is some weird typing issue
      //   conditionalB: { condition, option, fieldId },
      //   conditionalA: this.ruleConflict.conditionalA,
      // },
      ...super.toPojo(),
    };
  }

  getStatusMessage(
    rootFieldId: string,
    dependentChainFieldIds?: string[]
  ): TStatusRecord[] {
    const dependentsAsString = "'" + dependentChainFieldIds?.join("', '") + "'";
    const message =
      `Logic: Mutually Inclusive circular reference. root field: ${rootFieldId}, attempted fieldId: '${this.targetFieldId}', dependency chain: "${dependentsAsString}".` +
      "  Potentially resolvable. Rule Conflict:" +
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
export { FsCircularMutualInclusiveNode };

// (warn), Number of fields with Mutually Inclusive (resolvable) circular references: 3
// (warn), Number of fields with Mutually Exclusive circular references: 1
// (warn), Number of fields with circular references: 15

// Thoses numbers do not make sense
