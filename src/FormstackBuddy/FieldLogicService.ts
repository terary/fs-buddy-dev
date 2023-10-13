import { FsFormModel, TTreeFieldNode } from "../formstack";
import type { TFsFieldAnyJson } from "../formstack";
import { FsFieldModel } from "../formstack/classes/subtrees/trees";
import { FsLogicTreeDeep } from "../formstack";
import { FsFormRootNode } from "../formstack/classes/subtrees/trees/nodes";
import { TApiForm } from "../formstack/type.form";

class FieldLogicService {
  private _fieldCollection: FsFormModel;
  constructor(formJson: TApiForm) {
    this._fieldCollection = FsFormModel.fromApiFormJson(formJson);
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
        return (field as FsFieldModel).getLogicTree() !== null;
      })
      .map((fieldNode) => (fieldNode as TTreeFieldNode)?.fieldId);
  }

  getFieldIdsWithoutLogic(): string[] {
    return this.getAllFieldNodes()
      .filter((fieldNode) => {
        const { field } = fieldNode as TTreeFieldNode;
        return (field as FsFieldModel).getLogicTree() === null;
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
    const circularReferenceFieldIds = this.getFieldIdsWithCircularReferences();
    return fieldIds.map((fieldId) => {
      const field = this._fieldCollection.getFieldTreeByFieldId(fieldId);
      let label = circularReferenceFieldIds.includes(fieldId) ? "(cr) " : "";

      switch (field?.fieldType) {
        case "section":
          label += "(section) " + field?.section_heading;
          break;
        case "richtext":
          label += "(richtext)";
          break;
        default:
          label += field?.label || "";
          break; // <-- never stops being funny
      }
      // label +=
      //   field?.fieldType === "section"
      //     ? "(section) " + field?.section_heading
      //     : field?.label || "";

      return {
        value: fieldId,
        label: label,
      };
    });
  }
}

export { FieldLogicService };
