import { TApiFormJson } from "../type.form";
import { FsTreeFieldCollection } from "./FsTreeFieldCollection";

const INCLUDE_SUBTREES = true;

class FsFormTreeContainer {
  private _formId!: string;
  private _fieldCollection!: FsTreeFieldCollection;
  static fromJson(formJson: TApiFormJson) {
    const form = new FsFormTreeContainer();
    form._formId = formJson.id;
    // FsTreeFieldCollection
    form._fieldCollection = FsTreeFieldCollection.fromFieldJson(
      formJson.fields
    );

    return form;
  }
  getFieldTreeByFieldId(fieldId: string): FsTreeField {
    const fieldTree = this._fieldCollection.getFieldTreeByFieldId(fieldId);
  }
  getFieldCount() {
    return this._fieldCollection.getChildrenNodeIdsOf(
      this._fieldCollection.rootNodeId,
      INCLUDE_SUBTREES
    ).length;
  }
}

export { FsFormTreeContainer };
