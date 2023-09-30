import { AbstractLogicNode } from "./AbstractLogicNode";

class FsCircularDependencyNode extends AbstractLogicNode {
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
  get dependentChainFieldIds() {
    return [
      this._sourceFieldId,
      ...this._dependentChainFieldIds.slice(),
      this._targetFieldId,
    ];
  }
}
export { FsCircularDependencyNode };
