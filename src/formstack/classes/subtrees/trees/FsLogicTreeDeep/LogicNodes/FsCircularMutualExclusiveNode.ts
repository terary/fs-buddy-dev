import { TNodePojo } from "predicate-tree-advanced-poc/dist/src";
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

  static fromPojo(
    nodePojo: TNodePojo<AbstractLogicNode>
  ): FsCircularMutualExclusiveNode;
  static fromPojo(nodePojo: TNodePojo<AbstractLogicNode>): AbstractLogicNode;
  static fromPojo(nodePojo: TNodePojo<AbstractLogicNode>): AbstractLogicNode {
    const { nodeContent } = nodePojo;
    const {
      sourceFieldId,
      targetFieldId,
      dependentChainFieldIds,
      ruleConflict,
    } = nodeContent as FsCircularMutualExclusiveNode; // using type information, this will never be an instance
    return new FsCircularMutualExclusiveNode(
      sourceFieldId,
      targetFieldId,
      dependentChainFieldIds,
      ruleConflict
    );
  }
}
export { FsCircularMutualExclusiveNode };
