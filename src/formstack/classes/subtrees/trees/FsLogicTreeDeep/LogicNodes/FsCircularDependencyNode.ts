import { TNodePojo } from "predicate-tree-advanced-poc/dist/src";
import { AbstractLogicNode } from "./AbstractLogicNode";
import type { TStatusRecord } from "../../../../Evaluator/type";
import { RuleConflictType } from "./type";

class FsCircularDependencyNode extends AbstractLogicNode {
  _sourceFieldId: string;
  _sourceNodeId: string | null;
  _targetFieldId: string;
  _targetNodeId: string | null;
  protected _nodeType = "FsCircularDependencyNode";

  private _ruleConflict: RuleConflictType | null = null;
  private _dependentChainFieldIds: string[];

  constructor(
    sourceFieldId: string,
    sourceNodeId: string | null,
    targetFieldId: string,
    targetNodeId: string | null,
    dependentChainFieldIds: string[],
    ruleConflict?: RuleConflictType
  ) {
    super();
    this._sourceFieldId = sourceFieldId;
    this._sourceNodeId = sourceNodeId;
    this._targetFieldId = targetFieldId;
    this._targetNodeId = targetNodeId;
    this._dependentChainFieldIds = dependentChainFieldIds;
    this._ruleConflict = ruleConflict || null;
  }

  getLastVisitedFieldId() {
    return this.dependentChainFieldIds.length >= 1
      ? this.dependentChainFieldIds[this.dependentChainFieldIds.length - 1]
      : -1; // a bit over kill, *should* always be 0 or more elements
  }
  get ruleConflict(): RuleConflictType | null {
    return this._ruleConflict;
    // const ruleConflict: RuleConflictType = {
    //   ...this._ruleConflict,
    // } as RuleConflictType;
    // // @ts-ignore - dev/debug
    // if (ruleConflict.conditionalA.option === undefined) {
    //   // @ts-ignore - dev/debug
    //   ruleConflict.conditionalA.option = "undefined";
    // }
    // // @ts-ignore - dev/debug
    // if (ruleConflict.conditionalB.option === undefined) {
    //   // @ts-ignore - dev/debug
    //   ruleConflict.conditionalB.option = "undefined";
    // }
    // return ruleConflict;
  }

  get dependentChainFieldIds() {
    return this._dependentChainFieldIds;
    // return [
    //   this._sourceFieldId,
    //   ...this._dependentChainFieldIds.slice(),
    //   this._targetFieldId,
    // ];
  }

  get sourceFieldId() {
    return this._sourceFieldId;
  }

  get sourceNodeId(): string | null {
    return this._sourceNodeId;
  }

  get targetFieldId() {
    return this._targetFieldId;
  }

  get targetNodeId(): string | null {
    return this._targetNodeId;
  }

  set targetNodeId(nodeId: string) {
    this._targetNodeId = nodeId;
  }

  toPojo(): object {
    return {
      nodeType: this.nodeType,
      sourceFieldId: this.sourceFieldId,
      sourceNodeId: this.sourceNodeId,
      targetFieldId: this.targetFieldId,
      targetNodeId: this.targetNodeId,
      ruleConflict: this.ruleConflict,
      dependentChainFieldIds: this.dependentChainFieldIds,
    };
  }

  getStatusMessage(
    rootFieldId: string,
    dependentChainFieldIds?: string[]
  ): TStatusRecord[] {
    const dependentsAsString = "'" + dependentChainFieldIds?.join("', '") + "'";
    const message = `circular reference. root field: '${rootFieldId}', logic of source field '${this.targetFieldId}' attempted to add logic for fieldId: '${this.targetFieldId}' which is already in the dependency chain. dependency chain: "${dependentsAsString}".`;
    return [
      {
        severity: "logic",
        fieldId: this.targetFieldId,
        message,
        relatedFieldIds: dependentChainFieldIds,
      },
      {
        severity: "error", // duplicate message is intentional
        fieldId: this.targetFieldId,
        message,
        relatedFieldIds: dependentChainFieldIds,
      },
    ];
  }
}
export { FsCircularDependencyNode };
