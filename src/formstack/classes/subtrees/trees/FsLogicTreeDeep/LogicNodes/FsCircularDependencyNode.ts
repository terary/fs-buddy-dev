import { TNodePojo } from "predicate-tree-advanced-poc/dist/src";
import { AbstractLogicNode } from "./AbstractLogicNode";
import type { TStatusRecord } from "../../../../Evaluator/type";

class FsCircularDependencyNode extends AbstractLogicNode {
  _sourceFieldId: string;
  _sourceNodeId: string | null;
  _targetFieldId: string;
  _targetNodeId: string | null;
  private _dependentChainFieldIds: string[];

  constructor(
    sourceFieldId: string,
    sourceNodeId: string | null,
    targetFieldId: string,
    targetNodeId: string | null,
    dependentChainFieldIds: string[]
  ) {
    super();
    this._sourceFieldId = sourceFieldId;
    this._sourceNodeId = sourceNodeId;
    this._targetFieldId = targetFieldId;
    this._targetNodeId = targetNodeId;
    this._dependentChainFieldIds = dependentChainFieldIds;
  }

  getLastVisitedFieldId() {
    return this.dependentChainFieldIds.length >= 1
      ? this.dependentChainFieldIds[this.dependentChainFieldIds.length - 1]
      : -1; // a bit over kill, *should* always be 0 or more elements
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

  toPojo(): object {
    return {
      nodeType: this.nodeType,
      sourceFieldId: this.sourceFieldId,
      sourceNodeId: this.sourceNodeId,
      targetFieldId: this.targetFieldId,
      targetNodeId: this.targetNodeId,
      dependentChainFieldIds: this.dependentChainFieldIds,
    };
  }

  getStatusMessage(
    rootFieldId: string,
    dependentChainFieldIds?: string[]
  ): TStatusRecord[] {
    const dependentsAsString = "'" + dependentChainFieldIds?.join("', '") + "'";
    const message = `Logic: circular reference. root field: ${rootFieldId}, attempted fieldId: '${this.targetFieldId}', dependency chain: "${dependentsAsString}".`;
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
