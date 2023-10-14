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

class FieldLogicService {
  // FsLogicTreeDeep
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

  getFormLogicStatusMessages(): TStatusRecord[] {
    const statusMessages: TStatusRecord[] = [];
    const allFormFieldIds = this._fieldCollection.getAllFieldIds();
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
      const logicTree =
        this._fieldCollection.getDeepLogicTreeByFieldId(fieldId);
      if (logicTree === null) {
        return;
      }

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

    statusMessages.push(
      // this.wrapAsStatusMessage(
      //   "info",
      //   `Logic composition (Extended) : ` +
      //     transformers.Utility.jsObjectToHtmlFriendlyString(extendedCounts) +
      //     extendCountHtmlLegend
      // ),
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
        }`
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
        }`
      )
    );
    // Want to get the count of branch node, leaf node,
    // const x = this.getFieldIdsWithCircularReferences();

    //   want to calculate - number of branches  (branches/total fields -> copolit candidate)
    //   number of leafs
    //  const x = fieldLogicService.getFieldIdsWithCircularReferences();

    // getStatusMessagesFieldId - gets called elsewhere or should add it here?
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

  // public for testing purposes.. There isn't much time invested in that test -
  // better to make this private
  public wrapFieldIdsIntoLabelOptionList(fieldIds: string[]) {
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
