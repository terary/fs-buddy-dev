import { FsTreeFieldCollection, TTreeFieldNode } from "../formstack";
import type { TFsFieldAnyJson } from "../formstack";
import { FsTreeField } from "../formstack/classes/subtrees/trees";
import { FsTreeLogicDeep } from "../formstack";
import { FsFormRootNode } from "../formstack/classes/subtrees/trees/nodes";

class FieldLogicService {
  private _fieldCollection: FsTreeFieldCollection;
  constructor(fieldsJson: TFsFieldAnyJson[]) {
    this._fieldCollection = FsTreeFieldCollection.fromFieldJson(fieldsJson);
  }

  private getAllFieldNodes(): TTreeFieldNode[] {
    // as-in, everything except root (which is not a field)

    return this._fieldCollection.getTreeContentAt().filter((fieldNode) => {
      if (fieldNode === null || fieldNode instanceof FsFormRootNode) {
        return;
      }
      return true;
    }) as TTreeFieldNode[]; //ts is not smart enough to pick-up on the fact we're filtering-out non TTreeFieldNode(s)
  }

  getFieldIdsWithLogic(): string[] {
    return this.getAllFieldNodes()
      .filter((fieldNode) => {
        const { field } = fieldNode as TTreeFieldNode;
        return (field as FsTreeField).getLogicTree() !== null;
      })
      .map((fieldNode) => (fieldNode as TTreeFieldNode)?.fieldId);
  }

  getFieldIdsWithoutLogic(): string[] {
    return this.getAllFieldNodes()
      .filter((fieldNode) => {
        const { field } = fieldNode as TTreeFieldNode;
        return (field as FsTreeField).getLogicTree() === null;
      })
      .map((fieldNode) => (fieldNode as TTreeFieldNode)?.fieldId);
  }

  getFieldIdsAll(): string[] {
    return this.getAllFieldNodes().map(
      (fieldNode) => (fieldNode as TTreeFieldNode)?.fieldId
    );
  }

  getFieldIdsExtendedLogicOf(fieldId: string): string[] {
    return this._fieldCollection
      .aggregateLogicTree(fieldId)
      .getDependantFieldIds();
  }

  wrapFieldIdsIntoLabelOptionList(fieldIds: string[]) {
    return fieldIds.map((fieldId) => {
      const field = this._fieldCollection.getFieldTreeByFieldId(fieldId);
      const label =
        field?.fieldType === "section"
          ? "(section) " + field?.section_heading
          : field?.label || "";
      return {
        value: fieldId,
        label: label,
      };
    });
  }
}

export { FieldLogicService };
