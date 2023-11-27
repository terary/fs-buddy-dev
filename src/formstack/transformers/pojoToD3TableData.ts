import { TTreePojo } from "predicate-tree-advanced-poc/dist/src";
import { FsFormModel } from "../classes/subtrees";
import { AbstractLogicNode } from "../classes/subtrees/trees/FsLogicTreeDeep/LogicNodes/AbstractLogicNode";
import {
  FsCircularDependencyNode,
  FsLogicBranchNode,
  FsLogicLeafNode,
} from "../classes/subtrees/trees/FsLogicTreeDeep";
import { TFsFieldSection } from "../type.field";

export type TGraphNode = {
  nodeId: string;
  parentId: string;
  nodeContent: {
    fieldId: string;
    nodeId: string;
    label: string;
    nodeType: keyof AbstractLogicNode;
  };
};

const truncate = (text = "", length = 25) =>
  text.slice(0, length) + (text.length > length ? "..." : "");

const pojoToD3TableData = (
  pojo: TTreePojo<AbstractLogicNode>,
  formModel: FsFormModel
): TGraphNode[] => {
  return Object.entries(pojo).map(([nodeId, nodeBody]) => {
    // @ts-ignore
    const { nodeContent } = nodeBody;
    let pojoNodeContent = {
      nodeId,
      nodeType: nodeContent.nodeType,
    };

    const fieldId =
      // @ts-ignore
      nodeContent?.ownerFieldId || nodeContent?.fieldId || "_FIELD_ID_";
    // @ts-ignore
    pojoNodeContent.fieldId = fieldId;

    // @ts-ignore
    pojoNodeContent.fieldId = fieldId;
    // finish with this label business
    // Probably want "label", "fieldId", "nodeID"
    // also how to present (operator value subject)?
    const fieldModel = formModel.getFieldModel(fieldId);

    switch (nodeContent.nodeType) {
      case "FsVirtualRootNode":
      case "FsLogicBranchNode":
        const { action, conditional } = nodeContent as FsLogicBranchNode;
        // @ts-ignore
        pojoNodeContent.label = [
          `${action || "vRoot"}`,
          truncate(
            fieldModel?.fieldType === "section"
              ? fieldModel.section_heading
              : fieldModel?.label
          ),
          ` if ${conditional}`,
        ];

        break;

      case "FsLogicLeafNode":
        const { condition, option } = nodeContent as FsLogicLeafNode;
        // @ts-ignore
        pojoNodeContent.label = `[${truncate(fieldModel?.label)}]
        ${condition}
        '${option}' `;

        // @ts-ignore
        pojoNodeContent.label = [
          truncate(fieldModel?.label),
          condition,
          option,
        ];

        break;

      case "FsCircularDependencyNode":
        const { sourceFieldId, ruleConflict } =
          nodeContent as FsCircularDependencyNode;
        // @ts-ignore - fieldId not element of pojoNodeContent
        pojoNodeContent.fieldId = sourceFieldId;
        // @ts-ignore - ruleConflict not element of pojoNodeContent
        pojoNodeContent.ruleConflict = ruleConflict;
        // "sourceFieldId": "148604234",
        // "sourceNodeId": "148604161:0:2:4:6",
        // "targetFieldId": "148604236",
        // "targetNodeId": "148604161:0:2",

        // @ts-ignore -
        pojoNodeContent.sourceFieldId = nodeContent.sourceFieldId;
        // @ts-ignore -
        pojoNodeContent.sourceNodeId = nodeContent.sourceNodeId;
        // @ts-ignore -
        pojoNodeContent.targetFieldId = nodeContent.targetFieldId;
        // @ts-ignore -
        pojoNodeContent.targetNodeId = nodeContent.targetNodeId;

        const sourceFieldModel = formModel.getFieldModel(sourceFieldId);

        // {
        //   "nodeId": "148509465:0:5",
        //   "parentId": "148509465:0",
        //   "nodeContent": {
        //     "nodeId": "148509465:0:5",
        //     "nodeType": "FsCircularDependencyNode",
        //     "fieldId": "148509465",
        //     "sourceFieldId": "148509465",
        //     "sourceNodeId": "148509465:0",
        //     "targetFieldId": "148509465",
        //     "targetNodeId": "148509465",
        //     "label": ["", null, null]
        //   }
        // },

        // @ts-ignore - ruleConflict not element of pojoNodeContent
        pojoNodeContent.label = [
          truncate(
            sourceFieldModel?.label ||
              (sourceFieldModel?.fieldJson as TFsFieldSection)[
                "section_heading"
              ] ||
              ""
          ),
          // @ts-ignore
          ruleConflict?.conditionalA.condition,
          // // @ts-ignore
          // ruleConflict?.conditionalA.option,
          // @ts-ignore
          ruleConflict?.conditionalB.condition,
          // // @ts-ignore
          // ruleConflict?.conditionalB.option,
        ];

        break;

      default:
        pojoNodeContent = { ...nodeContent, ...pojoNodeContent };
        break; // <-- never stops being funny
    }

    return {
      nodeId,
      parentId: nodeBody.parentId === nodeId ? "" : nodeBody.parentId, // root should be empty string
      nodeContent: pojoNodeContent,
    } as TGraphNode;
  });
};

export { pojoToD3TableData };
