class FieldTypeUnknownError extends Error {
  private _debugObject?: any;
  constructor(message: string, debugObject?: any) {
    super(message);
    this._debugObject = debugObject;
    this.name = this.constructor.name; // I wonder if this is useful
  }

  get code() {
    return "ERR_UNKNOWN_FIELD_TYPE";
  }
  get debugObject() {
    return this._debugObject;
  }
}
export { FieldTypeUnknownError };
