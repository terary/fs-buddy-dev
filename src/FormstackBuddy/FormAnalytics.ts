import { FsFormModel, TTreeFieldNode } from "../formstack";
import { FsFieldModel } from "../formstack/classes/subtrees/trees";
import { FsFormRootNode } from "../formstack/classes/subtrees/trees/nodes";
import {
  TSimpleDictionary,
  TStatusMessageSeverity,
  TStatusRecord,
} from "../formstack/classes/Evaluator/type";
import { TApiForm } from "../formstack/type.form";
import { Evaluator } from "../formstack/classes/Evaluator";
import { TFsFieldAny } from "../formstack/type.field";

class FormAnalytics {
  private _fieldJson: TApiForm;
  private _fieldCollection: FsFormModel;

  //TApiForm
  constructor(formJson: TApiForm) {
    this._fieldCollection = FsFormModel.fromApiFormJson(formJson);
    this._fieldJson = formJson;
  }

  get formId() {
    return this._fieldJson.id;
  }

  get isActive() {
    return this._fieldJson.inactive !== false;
  }

  get isWorkflow() {
    return this._fieldJson.is_workflow_form;
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

  getLabelsWithAssociatedFieldIds(): TSimpleDictionary<string[]> {
    const labelsWithFieldIds: TSimpleDictionary<string[]> = {};
    const fieldSummaries: any = {};
    const nodes = this.getAllFieldNodes();

    nodes.forEach((node) => {
      const { fieldId, field } = node;
      const { fieldJson } = field;
      let label =
        field.fieldType === "section"
          ? field.section_heading
          : field.label.trim();

      !label && (label = "_NO_LABEL_FOUND_" + (fieldJson as TFsFieldAny).type);

      // const label =
      //   (fieldJson as TFsFieldAnyJson).label ||
      //   "_NO_LABEL_FOUND_" + (fieldJson as TFsFieldAnyJson).type;

      if (!(label in labelsWithFieldIds)) {
        labelsWithFieldIds[label] = [];
      }

      labelsWithFieldIds[label].push(fieldId);
    });

    return labelsWithFieldIds;
  }

  /**
   * attempts to find any issues with form/field setup
   */
  findKnownSetupIssues(): TStatusRecord[] {
    const messages: TStatusRecord[] = [];
    messages.push(
      this.isWorkflow
        ? this.wrapAsStatusMessage("info", 'Form/Workflow type: "workflow".')
        : this.wrapAsStatusMessage("info", 'Form/Workflow type: "form".')
    );

    messages.push(
      this.wrapAsStatusMessage(
        "info",
        `Total Fields: ${this._fieldJson.fields.length}.`
      )
    );

    this._fieldJson.fields.forEach((fieldJson) => {
      const evaluator = Evaluator.getEvaluatorWithFieldJson(fieldJson);
      messages.push(...evaluator.findKnownSetupIssues());
    });

    const labelUsageFrequency = this.getLabelsWithAssociatedFieldIds();
    Object.entries(labelUsageFrequency).forEach(([label, fieldIds]) => {
      if (fieldIds.length > 1) {
        messages.push(
          this.wrapAsStatusMessage(
            "warn",
            `label: "${label}" is used ${fieldIds.length} times.`,
            fieldIds
          )
        );
      }
    });

    // messages.push(...this._fieldCollection.getAllLogicStatusMessages());
    // FsFormModel
    return messages;
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

  private wrapAsStatusMessage(
    severity: TStatusMessageSeverity,
    message: string,
    relatedFieldIds: string[] = [],
    fieldId?: string
  ): TStatusRecord {
    return {
      severity,
      //   fieldId: null,
      fieldId: fieldId || null,
      message,
      relatedFieldIds,
    };
  }
}

export { FormAnalytics };
