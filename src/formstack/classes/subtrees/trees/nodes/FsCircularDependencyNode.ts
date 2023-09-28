import { TStatusRecord } from "../../../../../chrome-extension/type";
import { AbstractNode } from "./AbstractNode";

class FsCircularDependencyNode extends AbstractNode {
  _sourceFieldId: string;
  _targetFieldId: string;
  private _dependentChainFieldIds: string[];

  constructor(
    sourceFieldId: string,
    targetFieldId: string,
    dependentChainFieldIds: string[]
  ) {
    super();
    this._sourceFieldId = sourceFieldId;
    this._targetFieldId = targetFieldId;
    this._dependentChainFieldIds = dependentChainFieldIds;
  }

  getLastVisitedFieldId() {
    return this._targetFieldId;
  }

  get targetFieldId() {
    return this._targetFieldId;
  }

  get dependentChainFieldIds() {
    return [
      this._sourceFieldId,
      ...this._dependentChainFieldIds.slice(),
      this._targetFieldId,
    ];
  }

  getStatusMessage(dependentChainFieldIds?: string[]): TStatusRecord[] {
    const message = `Logic: circular reference. source fieldId: '${
      this.targetFieldId
    }', last visited fieldId: '${this.getLastVisitedFieldId()}', dependency chain: "${this.dependentChainFieldIds.join(
      '", "'
    )}".`;
    return [
      {
        severity: "logic",
        message,
        fieldId: this.targetFieldId,
        relatedFieldIds: dependentChainFieldIds,
      },
    ];
  }
}
export { FsCircularDependencyNode };
