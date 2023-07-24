class MultipleLogicTreeError extends Error {
  private _debugObject?: any;
  constructor(message: string, debugObject?: any) {
    super(message);
    this._debugObject = debugObject;
    this.name = this.constructor.name; // I wonder if this is useful
  }

  get code() {
    return "ERR_MULTIPLE_LOGIC_TREE";
  }
  get debugObject() {
    return this._debugObject;
  }
}

export { MultipleLogicTreeError };
