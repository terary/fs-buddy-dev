import { TApiFormJson } from "../type.form";
import { FsTreeField } from "./subtrees/FsTreeField";
import { FsTreeFieldCollection } from "./FsTreeFieldCollection";

const INCLUDE_SUBTREES = true;

class FsFormTreeContainer {
  private _formId!: string;
  private _fieldCollection!: FsTreeFieldCollection;
  private _editUrl!: string;
  static fromJson(formJson: TApiFormJson) {
    const form = new FsFormTreeContainer();
    form._formId = formJson.id;
    form._editUrl = formJson.edit_url || "MISSING edit_url";
    // FsTreeFieldCollection
    form._fieldCollection = FsTreeFieldCollection.fromFieldJson(
      formJson.fields
    );

    return form;
  }

  getFieldTreeByFieldId(fieldId: string): FsTreeField {
    return this._fieldCollection.getFieldTreeByFieldId(fieldId);
  }

  getFieldCount() {
    return this._fieldCollection.getChildrenNodeIdsOf(
      this._fieldCollection.rootNodeId,
      INCLUDE_SUBTREES
    ).length;
  }
}

export { FsFormTreeContainer };
