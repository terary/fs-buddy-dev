import { FsTreeFieldCollection, TTreeFieldNode } from "../formstack";
import type { TFsFieldAnyJson } from "../formstack";
import { FsTreeField } from "../formstack/classes/subtrees/trees";
import { FsTreeLogicDeep } from "../formstack";
import { FsFormRootNode } from "../formstack/classes/subtrees/trees/nodes";
import { TApiForm } from "../formstack/type.form";

class FieldLogicService {
  private _fieldCollection: FsTreeFieldCollection;
  constructor(formJson: TApiForm) {
    this._fieldCollection = FsTreeFieldCollection.fromApiFormJson(formJson);
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

  getAllFieldSummary() {
    const fieldSummaries: any = {};
    const nodes = this.getAllFieldNodes();
    nodes.forEach((node) => {
      const fieldId = node.fieldId;
      fieldSummaries[fieldId] = {
        fieldId: fieldId,
        label: node.field.label,
        type: node.field.fieldType,
      };
    });

    return fieldSummaries;
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

  getFieldIdsWithCircularReferences() {
    return this._fieldCollection.getFieldIdsWithCircularLogic();
  }

  getCircularReferenceNodes(fieldId: string) {
    return this._fieldCollection
      .aggregateLogicTree(fieldId)
      .getCircularLogicNodes();
  }

  getCircularReferenceFieldIds(fieldId: string) {
    return this._fieldCollection
      .aggregateLogicTree(fieldId)
      .getCircularLogicNodes()
      .map((circularNode) => circularNode.dependentChainFieldIds.slice(-2))
      .reduce((prev, cur, i, a) => {
        return [...prev, ...cur];
      }, []);
  }

  getFieldIdsExtendedLogicOf(fieldId: string): string[] {
    return this._fieldCollection
      .aggregateLogicTree(fieldId)
      .getDependentFieldIds();
  }

  getStatusMessagesFieldId(fieldId: string) {
    const agTree = this._fieldCollection.aggregateLogicTree(fieldId);
    return agTree.getStatusMessage();
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
