class FsCircularDependencyNode {
  _sourceFieldId: string;
  _targetFieldId: string;
  _dependentChainFieldIds: string[];

  constructor(
    sourceFieldId: string,
    targetFieldId: string,
    dependentChainFieldIds: string[]
  ) {
    this._sourceFieldId = sourceFieldId;
    this._targetFieldId = targetFieldId;
    this._dependentChainFieldIds = dependentChainFieldIds;
  }
}
export { FsCircularDependencyNode };
