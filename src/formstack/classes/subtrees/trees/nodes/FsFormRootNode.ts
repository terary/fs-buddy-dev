class FsFormRootNode {
  private _formId: string;
  constructor(formId = "_FORM_ID_") {
    this._formId = formId;
  }

  get formId() {
    return this._formId;
  }
}

export { FsFormRootNode };
