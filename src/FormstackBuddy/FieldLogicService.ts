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

  getAggregateTree(fieldId: string): FsTreeLogicDeep {
    return this._fieldCollection.aggregateLogicTree(fieldId);
  }

  devDebug_getExtendedTree2(fieldId: string): FsTreeLogicDeep {
    return this._fieldCollection.devDebug_getExtendedTree2(fieldId);
  }

  getFieldIdsExtendedLogicOf(fieldId: string): string[] {
    const a = this._fieldCollection.aggregateLogicTree(fieldId);
    return a.getDependantFieldIds();
    // return this._fieldCollection
    //   .aggregateLogicTree(fieldId)
    //   .getDependantFieldIds();
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
