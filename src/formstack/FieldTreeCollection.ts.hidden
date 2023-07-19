import {
  AbstractExpressionTree,
  IExpressionTree,
  ITree,
  TGenericNodeContent,
  TNodePojo,
} from "predicate-tree-advanced-poc/dist/src";
import type { TFsFieldAny, TFsFieldSection } from "./type.field";
import { TFieldLogic } from "../fs-goof/types";
import { FSExpressionTree, TFsNode } from "./FSExpressionTree";
import { FsStringCalculationTree } from "./FsStringCalculationTree";

const transformLogicExpressionJsonToNodeAndLeafs = (
  fieldJson: Partial<TFsFieldAny>
) => {
  const { action, conditional, checks } = fieldJson.logic || {};
  const op = conditional === "all" ? "$and" : "$or";
  const leafExpressions = (checks || []).map((check) => {
    const { condition, field, option } = check;
    return {
      fieldId: field + "" || "__MISSING_ID__",
      sectionChildren: [],
      sectionParents: [],
      fieldJson: check,
      condition,
      field,
      option,
    };
  });
  return {
    // *tmc* down and dirty, it would be better to use some sort of filter (joi or similar)
    nodeContent: {
      fieldJson: { action, conditional, ...fieldJson },
      fieldId: fieldJson.id || "__MISSING_ID__",
      sectionChildren: [],
      sectionParents: [],
    },
    childrenLeafExpressions: leafExpressions,
  };
};

const fieldJsonToNodeContent = (json: Partial<TFsFieldAny>): TFsNode => {
  return {
    fieldId: json.id || "__MISSING_ID__",
    fieldJson: json,
    sectionChildren: [],
    sectionParents: [],
  } as TFsNode;
};

class FieldTreeCollection {
  #tree!: FSExpressionTree; // GenericExpressionTree<TFsFieldAny>;
  #fieldIdToNodeId: {
    [fieldId: string]: {
      nodeId: string;
      tree: AbstractExpressionTree<TFsNode>;
    };
  } = {};
  get count() {
    return this.#tree.countTotalNodes();
  }

  getAllFieldIds(): string[] {
    return Object.keys(this.#fieldIdToNodeId);
  }

  private getNodeIdFromFieldId(fieldId: string): string {
    return this.#fieldIdToNodeId[fieldId]?.nodeId;
  }

  getDependancyList(fieldId: string): (string | null)[] {
    const { tree: ownerTree, nodeId } = this.#fieldIdToNodeId[fieldId];
    const t = this.#tree;
    console.log({ t });
    const dependencyList: string[] = [];

    const nodeContent = this.#tree.getChildContentAt(nodeId) as TFsNode;
    dependencyList.push(...(nodeContent.sectionParents || []));

    if (ownerTree instanceof FsStringCalculationTree) {
      dependencyList.push(...ownerTree.getDependancyList());
      return dependencyList;
    }

    const childrenNodeIds = ownerTree.getChildrenNodeIdsOf(nodeId);
    const childFieldIds = childrenNodeIds.map((childNodeId) => {
      const childContent = ownerTree.getChildContentAt(childNodeId) as TFsNode;
      return childContent.fieldId;
    });

    dependencyList.push(...childFieldIds);
    return dependencyList;
  }

  private findParentTreeByFieldId(fieldId: string): ITree<TFsNode> | null {
    return this.#fieldIdToNodeId[fieldId].tree;
  }

  private reverseLookupNodeIdToFieldId(nodeId: string): string | null {
    let nodeContent: TGenericNodeContent<TFsNode> | null =
      this.getChildContentAt(nodeId);

    if (nodeContent && !(nodeContent instanceof AbstractExpressionTree)) {
      return (nodeContent as TFsNode).fieldId;
    }

    if (nodeContent instanceof AbstractExpressionTree) {
      return (nodeContent.getChildContentAt(nodeContent.rootNodeId) as TFsNode)
        .fieldId;
    }

    const parentTree = this.findParentTreeByFieldId(nodeId);

    if (!parentTree) {
      return null;
    }

    nodeContent = parentTree.getChildContentAt(nodeId);
    if (nodeContent === null) {
      return null;
    }
    return (nodeContent as TFsNode).fieldId;
  }

  getFieldJson(fieldId: string): TFsFieldAny {
    const nodeId = this.getNodeIdFromFieldId(fieldId);
    const nodeContent = this.#tree.getChildContentAt(nodeId);
    if (nodeContent instanceof AbstractExpressionTree) {
      const subtreeContent = nodeContent.getChildContentAt(
        nodeContent.rootNodeId
      );
      return (subtreeContent as TFsNode).fieldJson as TFsFieldAny;
    }

    return (nodeContent as TFsNode).fieldJson as TFsFieldAny;
  }

  private getChildContentAt(fieldId: string): TFsNode {
    const nodeId = this.#fieldIdToNodeId[fieldId].nodeId;
    const nodeContent = this.#tree.getChildContentAt(nodeId);
    if (nodeContent instanceof AbstractExpressionTree) {
      return nodeContent.getChildContentAt(nodeContent.rootNodeId);
    }
    return this.#tree.getChildContentAt(nodeId) as TFsNode;
  }

  getSectionFieldIds() {
    return Object.keys(this.#fieldIdToNodeId)
      .filter((fieldId) => {
        return this.getFieldJson(fieldId).type === "section";
      })
      .map((fieldId) => this.getFieldJson(fieldId).id);
  }

  getSectionChildrenFieldIds(fieldId: string): string[] {
    const nodeContent = this.getChildContentAt(fieldId);
    return nodeContent.sectionChildren.slice();
  }

  private static setSectionRelationships(fieldCollection: FieldTreeCollection) {
    const originalJson = Object.keys(fieldCollection.#fieldIdToNodeId)
      .map((fieldId) => {
        return fieldCollection.getFieldJson(fieldId);
      })
      .sort((a, b) => {
        if (parseInt(a.sort + "") > parseInt(b.sort + "")) return 1;
        if (parseInt(a.sort + "") == parseInt(b.sort + "")) return 0;
        return -1;
      });

    let currentSection: TFsNode | null = null;
    for (let i = 0; i < originalJson.length; i++) {
      // because order is important
      const fieldJson = originalJson[i];

      if (fieldJson.id == "148149763") {
        console.log({ what: "what" });
      }
      if (fieldJson.type === "section") {
        currentSection = fieldCollection.getChildContentAt(
          fieldJson.id
        ) as TFsNode;
      }

      if (currentSection !== null && currentSection.fieldId !== fieldJson.id) {
        const graphNode = fieldCollection.getChildContentAt(
          fieldJson.id
        ) as TFsNode;
        graphNode.sectionParents.push(currentSection.fieldId);
        currentSection.sectionChildren.push(graphNode.fieldId);
      }
    }
    const debugTree = fieldCollection.#tree;
    console.log({ debugTree });
    console.log("All done folks");
  }

  static fromJson(json: Partial<TFsFieldAny>[]): FieldTreeCollection {
    const fieldTreeCollection = new FieldTreeCollection();
    fieldTreeCollection.#tree = FSExpressionTree.fromEmpty();
    const debugTree = fieldTreeCollection.#tree;

    (json || []).forEach((fieldJson) => {
      if (fieldJson.id === "148151439") {
        console.log("We got us a hot one");
      }
      let subtree: IExpressionTree<TFsNode> | null = null;

      if (fieldJson.calculation && fieldJson.calculation != "") {
        subtree = fieldTreeCollection.#tree.createSubtreeFromCalcStringAt(
          fieldTreeCollection.#tree.rootNodeId,
          fieldJson
        );
      }

      if (fieldJson.logic) {
        // not really sure how to handle logic with calc, we'll try this
        subtree =
          subtree ||
          fieldTreeCollection.#tree.createSubtreeAt<FSExpressionTree>(
            fieldTreeCollection.#tree.rootNodeId
          );

        const { nodeContent, childrenLeafExpressions } =
          transformLogicExpressionJsonToNodeAndLeafs(fieldJson);

        subtree.replaceNodeContent(subtree.rootNodeId, nodeContent as TFsNode);

        childrenLeafExpressions.forEach((childNode: any) => {
          subtree &&
            subtree.appendChildNodeWithContent(subtree.rootNodeId, childNode);
        });
        console.log("what what");
      } else {
        const nodeContent = fieldJsonToNodeContent(fieldJson);

        fieldTreeCollection.#tree.appendChildNodeWithContent(
          fieldTreeCollection.#tree.rootNodeId,
          nodeContent
        );
      }
    });

    // build fieldId -> nodeId map
    fieldTreeCollection.#tree
      .getChildrenNodeIdsOf(fieldTreeCollection.#tree.rootNodeId, true)
      .forEach((treeNodeId) => {
        const h = fieldTreeCollection.#fieldIdToNodeId;
        const t = fieldTreeCollection.#tree;
        const x = fieldTreeCollection.getNodeIdFromFieldId("148149773");
        if (
          treeNodeId === "_root_:1" ||
          treeNodeId === fieldTreeCollection.getNodeIdFromFieldId("148149773")
        ) {
          console.log("we Got a live one");
        }
        const nodeContent =
          fieldTreeCollection.#tree.getChildContentAt(treeNodeId);
        if (nodeContent instanceof FsStringCalculationTree) {
          const subRootContent = (
            nodeContent as FsStringCalculationTree
          ).getChildContentAt(nodeContent.rootNodeId);

          fieldTreeCollection.#fieldIdToNodeId[
            (subRootContent as TFsNode).fieldId
          ] = { nodeId: treeNodeId, tree: nodeContent };

          // ITree<TFsFieldAny>
        } else if (nodeContent instanceof AbstractExpressionTree) {
          const subRootContent = (
            nodeContent as FSExpressionTree
          ).getChildContentAt(nodeContent.rootNodeId);

          fieldTreeCollection.#fieldIdToNodeId[
            (subRootContent as TFsNode).fieldId
          ] = { nodeId: treeNodeId, tree: nodeContent };

          // ITree<TFsFieldAny>
        } else {
          if (!nodeContent || !(nodeContent as TFsNode).fieldId) {
            throw new Error(
              `Can not process field: ${JSON.stringify(nodeContent)}`
            );
          }
          if ("148149773" === (nodeContent as TFsNode).fieldId) {
            console.log("we have an overwrite");
          }
          if (
            nodeContent !== null &&
            !fieldTreeCollection.#fieldIdToNodeId[
              (nodeContent as TFsNode).fieldId
            ]
          ) {
            fieldTreeCollection.#fieldIdToNodeId[
              (nodeContent as TFsNode).fieldId
            ] = { nodeId: treeNodeId, tree: fieldTreeCollection.#tree };
          }
        }
      });

    const h = fieldTreeCollection.#fieldIdToNodeId;
    console.log({ h });
    const devDebugTree = fieldTreeCollection.#tree;
    console.log({ devDebugTree });
    FieldTreeCollection.setSectionRelationships(fieldTreeCollection);
    return fieldTreeCollection;
  }

  dev_debug_get_tree() {
    return this.#tree;
  }

  static fromEmpty(
    formId?: string,
    nodeContent?: TFsFieldAny
  ): FieldTreeCollection {
    const collection = new FieldTreeCollection();
    collection.#tree = FSExpressionTree.fromEmpty(formId, nodeContent);
    return collection;
  }
}

export { FieldTreeCollection };
