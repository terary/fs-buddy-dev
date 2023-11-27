import { FsFormModel, TTreeFieldNode } from "../formstack";
import type { TFsFieldAnyJson } from "../formstack";
import { FsFieldModel } from "../formstack/classes/subtrees/trees";
import { FsLogicTreeDeep } from "../formstack";
import { FsFormRootNode } from "../formstack/classes/subtrees/trees/nodes";
import { TApiForm } from "../formstack/type.form";
// import { Utility } from "../formstack/transformers/Utility";
import { transformers } from "../formstack/transformers";
import {
  TSimpleDictionary,
  TStatusMessageSeverity,
  TStatusRecord,
} from "../formstack/classes/Evaluator/type";
import {
  TLogicTreeDeepStatisticCountRecord,
  TLogicTreeDeepStatisticCountField,
} from "../formstack/classes/subtrees/trees/FsLogicTreeDeep";
import { TGraphNode } from "../formstack/transformers/pojoToD3TableData";

class FieldLogicService {
  // FsLogicTreeDeep
  private _formModel: FsFormModel;
  constructor(formJson: TApiForm) {
    this._formModel = FsFormModel.fromApiFormJson(formJson);
  }

  private getAllFieldNodes(): TTreeFieldNode[] {
    // as-in, everything except root (which is not a field)

    return this._formModel.getTreeContentAt().filter((fieldNode) => {
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

  getExtendTreeForFieldId(fieldId: string) {
    return this._formModel.getDeepLogicTreeByFieldId(fieldId);
  }

  getFormLogicStatusMessages(): TStatusRecord[] {
    const statusMessages: TStatusRecord[] = [];
    const allFormFieldIds = this._formModel.getAllFieldIds();
    const fieldUsageCounts: TSimpleDictionary<number> = {};
    const logicCounts: TLogicTreeDeepStatisticCountRecord = {
      totalNodes: 0,
      totalCircularLogicNodes: 0,
      totalCircularExclusiveLogicNodes: 0,
      totalCircularInclusiveLogicNodes: 0,
      totalUnclassifiedNodes: 0,
      totalLeafNodes: 0,
      totalBranchNodes: 0,
      totalRootNodes: 0,
    };

    allFormFieldIds.forEach((fieldId) => {
      const logicTree = this._formModel.getDeepLogicTreeByFieldId(fieldId);
      if (logicTree === null) {
        return;
      }

      // const x = logicTree.getAllFieldIdsLeafTermReference();
      logicTree.getAllFieldIdsLeafTermReference().forEach((fieldId) => {
        if (!fieldUsageCounts[fieldId]) {
          fieldUsageCounts[fieldId] = 0;
        }
        fieldUsageCounts[fieldId]++;
      });

      const fieldCounts = logicTree.getStatisticCounts();
      (Object.keys(fieldCounts) as TLogicTreeDeepStatisticCountField[]).forEach(
        (statName) => {
          logicCounts[statName] += fieldCounts[statName];
        }
      );
    });

    const extendedCounts = {
      leafToNodeRatio: (
        logicCounts.totalLeafNodes / logicCounts.totalNodes
      ).toFixed(4),
      branchToNodeRatio: (
        logicCounts.totalBranchNodes / logicCounts.totalNodes
      ).toFixed(4),
      leafToBranchRatio: (
        logicCounts.totalLeafNodes / logicCounts.totalBranchNodes
      ).toFixed(4),
    };

    const countHtmlLegend = `
      <ul>
        <li>totalNodes - Each time a field involved in a logic expression. If a field is used twice this will be reflected in this number</li>
        <li>totalCircularLogicNodes - Logic conflict at the branch level.</li>
        <li>totalCircularExclusiveLogicNodes - Logic conflict at the leaf level, non-resolvable.</li>
        <li>totalCircularInclusiveLogicNodes - Logic conflict at the leaf level, resolvable.</li>
        <li>totalLeafNodes - Logic terms (the actual "x equal _SOMETHING_").</li>
        <li>totalBranchNodes - Logic branch (something like: "Show" if _ANY_...).</li>
        <li>totalRootNodes - The field that owns the logic expression.</li>
        <li>Note: Circular nodes indicates invalid logic expression. If an expression is invalid these counts may not be accurate.</li>
        <li>branchToNodeRatio - higher number indicates need to break into multiple forms.</li>
        <li>leafToBranchRatio - higher number indicates good usage of logic .</li>
      </ul>
    `;

    Object.keys(fieldUsageCounts).forEach((fieldId) => {
      if (!this._formModel.getAllFieldIds().includes(fieldId)) {
        statusMessages.push(
          this.wrapAsStatusMessage(
            "error",
            `Found fieldId used in logic but not in form. fieldId: "${fieldId}". `
          )
        );
      }
    });
    statusMessages.push(
      // fieldUsageCounts
      this.wrapAsStatusMessage(
        "info",
        "Checked all fieldIds in logic expression are contained in this form (don't laugh, it happens).<br />"
      )
    );

    statusMessages.push(
      // fieldUsageCounts
      this.wrapAsStatusMessage(
        "info",
        `Field Leaf Usage (field actual in leaf expression): ` +
          transformers.Utility.jsObjectToHtmlFriendlyString(fieldUsageCounts)
      ),
      this.wrapAsStatusMessage(
        "info",
        `Logic composition: ` +
          transformers.Utility.jsObjectToHtmlFriendlyString({
            ...logicCounts,
            ...extendedCounts,
          }) +
          countHtmlLegend
      ),
      this.wrapAsStatusMessage(
        "info",
        `Number of fields with root logic:  ${
          this.getFieldIdsWithLogic().length
        }`,
        this.getFieldIdsWithLogic()
      ),
      this.wrapAsStatusMessage(
        "info",
        `Number of fields without root logic:  ${
          this.getFieldIdsWithoutLogic().length
        }`
      ),
      this.wrapAsStatusMessage(
        this.getFieldIdsWithCircularReferences().length === 0 ? "info" : "warn",
        `Number of fields with circular references:  ${
          this.getFieldIdsWithCircularReferences().length
        }`,
        this.getFieldIdsWithCircularReferences()
      ),
      this.wrapAsStatusMessage(
        this.getFieldIdsWithLogicError().length === 0 ? "info" : "error",
        `Number of fields with general logic errors:  ${
          this.getFieldIdsWithLogicError().length
        }`,
        this.getFieldIdsWithLogicError()
      )
    );
    return statusMessages;
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
    return this._formModel.getFieldIdsWithCircularLogic();
  }

  getFieldIdsWithLogicError() {
    return this._formModel.getFieldIdsWithLogicError();
  }

  getCircularReferenceNodes(fieldId: string) {
    return this._formModel.aggregateLogicTree(fieldId).getCircularLogicNodes();
  }

  getCircularReferenceFieldIds(fieldId: string) {
    return this._formModel
      .aggregateLogicTree(fieldId)
      .getCircularLogicNodes()
      .map((circularNode) => circularNode.dependentChainFieldIds.slice(-2))
      .reduce((prev, cur, i, a) => {
        return [...prev, ...cur];
      }, []);
  }

  getLogicNodeGraphMap(fieldId: string): TGraphNode[] {
    const agTree = this._formModel.aggregateLogicTree(fieldId);
    console.log({ agTree });
    const pojo = agTree.toPojoAt(undefined, false);
    console.log({ pojo });

    return transformers.pojoToD3TableData(pojo, this._formModel);

    // const agTree148604161 = tree5375703.aggregateLogicTree("148604161"); // (A) Big Dipper A->B->C->D->(B ^ E)
    // const d3Map148604161 = transformers.pojoToD3TableData(
    //   agTree148604161.toPojoAt(undefined, false),
    //   tree5375703
    // );
  }

  getFieldIdsExtendedLogicOf(fieldId: string): string[] {
    return this._formModel.aggregateLogicTree(fieldId).getDependentFieldIds();
  }

  getStatusMessagesFieldId(fieldId: string) {
    const agTree = this._formModel.aggregateLogicTree(fieldId);
    return agTree.getStatusMessage();
  }

  // public for testing purposes.. There isn't much time invested in that test -
  // better to make this private
  public wrapFieldIdsIntoLabelOptionList(fieldIds: string[]) {
    const circularReferenceFieldIds =
      this.getFieldIdsWithCircularReferences().concat(
        this.getFieldIdsWithLogicError()
      );
    return fieldIds.map((fieldId) => {
      const field = this._formModel.getFieldModel(fieldId);
      let label = circularReferenceFieldIds.includes(fieldId) ? "(Error) " : "";

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

export { FieldLogicService };
