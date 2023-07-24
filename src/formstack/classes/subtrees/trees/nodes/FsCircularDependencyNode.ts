class FsCircularDependencyNode {
  _sourceFieldId: string;
  _targetFieldId: string;
  constructor(sourceFieldId: string, targetFieldId: string) {
    this._sourceFieldId = sourceFieldId;
    this._targetFieldId = targetFieldId;
  }
}
export { FsCircularDependencyNode };
