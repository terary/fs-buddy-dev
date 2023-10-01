import { AbstractExpressionTree } from "predicate-tree-advanced-poc/dist/src";

import { TFsFieldAnyJson } from "../types";
import { FsTreeLogicDeep } from "./trees/FsTreeLogicDeep";
import { FsTreeField } from "./trees/FsTreeField";
import { transformers } from "../../transformers";

import { FsFieldVisibilityLinkNode, FsFormRootNode } from "./trees/nodes";
import {
  TFsFieldLogicCheckLeaf,
  TFsFieldLogicJunction,
  TFsLogicNode,
  TLogicJunctionOperators,
  TTreeFieldNode,
} from "./types";
import { FsLogicLeafNode } from "./trees/nodes/FsLogicLeafNode";
import { FsCircularDependencyNode } from "./trees/nodes/FsCircularDependencyNode";
import { FsMaxDepthExceededNode } from "./trees/nodes/FsMaxDepthExceededNode";
import { FsLogicBranchNode } from "./trees/nodes/FsLogicBranchNode";
import { FsTreeLogic } from "./trees/FsTreeLogic";
import { TUiEvaluationObject } from "../Evaluator/type";
import { TSubmissionJson } from "../../type.form";
import { IEValuator } from "../Evaluator/IEvaluator";
import { TFsFieldAny } from "../../type.field";
import { FsCircularMutualInclusiveNode } from "./trees/nodes/FsCircularMutualInclusiveNode";
import { FsCircularMutualExclusiveNode } from "./trees/nodes/FsCircularMutualExclusiveNode";
class FsTreeFieldCollection extends AbstractExpressionTree<
  TTreeFieldNode | FsFormRootNode
> {
  private static MAX_DEPTH = 50; // we'll want to change this
  private _dependantFieldIds: string[] = [];
  private _fieldIdNodeMap: { [fieldId: string]: FsTreeField } = {};

  createSubtreeAt(targetNodeId: string): FsTreeFieldCollection {
    const subtree = new FsTreeFieldCollection("_subtree_");

    const subtreeParentNodeId = this.appendChildNodeWithContent(
      targetNodeId,
      subtree
    );

    AbstractExpressionTree.reRootTreeAt<TTreeFieldNode | FsFormRootNode>(
      subtree,
      subtree.rootNodeId,
      subtreeParentNodeId
    );
    subtree._rootNodeId = subtreeParentNodeId;
    subtree._incrementor = this._incrementor;

    return subtree;
  }

  getFormFieldsCount() {
    return this.getAllFieldIds().length;
  }

  getAllFieldIds() {
    return Object.keys(this._fieldIdNodeMap);
  }

  private getFieldById(fieldId: string): FsTreeField {
    return this._fieldIdNodeMap[fieldId];
  }

  private getExtendedTree<T extends FsTreeLogicDeep = FsTreeLogicDeep>(
    field: FsTreeField,
    atNodeId?: string,
    extendedTree?: FsTreeLogicDeep
  ): T {
    const logicTree = field.getLogicTree() as FsTreeLogic;
    if (logicTree === null) {
      if (extendedTree !== undefined) {
        extendedTree.appendChildNodeWithContent(
          atNodeId || extendedTree.rootNodeId,
          // if a field has no logic do we return ExtendTree with 1 and 1 one node?
          //@ts-ignore
          new FsLogicLeafNode(field.fieldId, "condition", "option")
        );
        return extendedTree as T;
      } else {
        const t = new FsTreeLogicDeep(
          field.fieldId,
          // @ts-ignore
          new FsLogicLeafNode(field.fieldId, "condition", "option")
        );
        t.ownerFieldId = field.fieldId;
        return t as T;
      }
    }

    const rootNodeContent = logicTree.getChildContentAt(
      logicTree.rootNodeId //
    ) as TFsFieldLogicJunction<TLogicJunctionOperators>;

    let exTree: FsTreeLogicDeep;
    let currentBranchNodeId: string;
    const { conditional, action, fieldJson } = rootNodeContent;
    const newBranchNode = new FsLogicBranchNode(
      field.fieldId,
      // @ts-ignore - doesn't like '$in'
      (conditional || "$and") as TLogicJunctionOperators,
      action || null,
      fieldJson
    );

    if (extendedTree === undefined) {
      const { conditional, action, fieldJson } =
        rootNodeContent as TFsFieldLogicJunction<TLogicJunctionOperators>;

      exTree = new FsTreeLogicDeep(field.fieldId, newBranchNode);
      exTree.ownerFieldId = field.fieldId;
      atNodeId = exTree.rootNodeId;
      currentBranchNodeId = exTree.rootNodeId;
    } else {
      // assert(atNodeId !== undefined);
      // !!atNodeId && throw new Error('Expected something');
      exTree = extendedTree;
      currentBranchNodeId = exTree.appendChildNodeWithContent(
        atNodeId || "",
        newBranchNode
      );
    }

    if (
      // this should be more intelligent
      // exTree.getTreeNodeIdsAt(exTree.rootNodeId).length >
      exTree.countTotalNodes() > FsTreeFieldCollection.MAX_DEPTH
    ) {
      exTree.appendChildNodeWithContent(
        currentBranchNodeId,
        new FsMaxDepthExceededNode()
      );
      return exTree as T;
    }

    // technically logicTree should always have children but in reality it's sometimes missing.
    logicTree
      .getChildrenNodeIdsOf(logicTree.rootNodeId)
      .forEach((logicChildNodeId: string) => {
        const childContent = logicTree.getChildContentAt(
          logicChildNodeId
        ) as TFsFieldLogicCheckLeaf;

        const childField = this.getFieldTreeByFieldId(
          childContent.fieldId
        ) as FsTreeField;

        if (exTree.isExistInDependencyChain(childField)) {
          exTree.appendChildNodeWithContent(
            currentBranchNodeId,
            // @ts-ignore TFsLogicField not compatible with Abstract
            this.getCorrectCircularNode(exTree, childField, childContent)
          );
        } else if (childField.getLogicTree() === null) {
          const { fieldId, condition, option } = childContent;
          exTree.appendChildNodeWithContent(
            currentBranchNodeId,
            new FsLogicLeafNode(fieldId, condition, option)
          );
        } else {
          this.getExtendedTree(childField, atNodeId, exTree); //(childFieldId)
        }
      });

    return exTree as T;
  }

  private isTwoConditionsMutuallyExclusive(
    fieldJson: TFsFieldAny,
    conditionA: TFsFieldLogicCheckLeaf,
    conditionB: TFsFieldLogicCheckLeaf
  ) {
    if (
      ["select", "radio"].includes(fieldJson.type) &&
      conditionA.condition === conditionB.condition &&
      conditionA.option === conditionB.option
    ) {
      return false;
    }

    return true;
  }

  private getCorrectCircularNode(
    exTree: FsTreeLogicDeep,
    childField: FsTreeField,
    childContent: TFsFieldLogicCheckLeaf
  ): TFsLogicNode {
    const existingChildContent =
      exTree.getChildContentByFieldId<TFsFieldLogicCheckLeaf>(
        childContent.fieldId
      );
    const logicSubjectTreeField = this.getFieldById(childField.fieldId);

    if (!childContent || !existingChildContent) {
      return new FsCircularDependencyNode(
        exTree.ownerFieldId,
        childField.fieldId,
        exTree.getDependentFieldIds()
      );
    }

    const isMutualExclusiveConflict = this.isTwoConditionsMutuallyExclusive(
      logicSubjectTreeField.fieldJson,
      childContent,
      // @ts-ignore - this is a known issue, should be using interfaces?
      existingChildContent
    );

    if (isMutualExclusiveConflict) {
      return new FsCircularMutualExclusiveNode(
        exTree.ownerFieldId,
        childField.fieldId,
        exTree.getDependentFieldIds(),
        // @ts-ignore - this is a known issue, should be using interfaces?
        { conditionalA: childContent, conditionalB: existingChildContent }
      );
    } else {
      return new FsCircularMutualInclusiveNode(
        exTree.ownerFieldId,
        childField.fieldId,
        exTree.getDependentFieldIds(),
        // @ts-ignore - this is a known issue, should be using interfaces?
        { conditionalA: childContent, conditionalB: existingChildContent }
      );
    }
    return new FsCircularDependencyNode(
      exTree.ownerFieldId,
      childField.fieldId,
      exTree.getDependentFieldIds()
    );
  }

  aggregateLogicTree(fieldId: string): FsTreeLogicDeep {
    const field = this.getFieldTreeByFieldId(fieldId) as FsTreeField;

    //@ts-ignore
    return this.getExtendedTree(field);
  }

  getFieldTreeByFieldId(fieldId: string): FsTreeField | undefined {
    // I wounder if a look-up table wouldn't be better
    //  also you're filtering after map, if possible the other order would be preferred
    return this._fieldIdNodeMap[fieldId];
  }

  getFieldIdsWithCircularLogic(): string[] {
    const allFieldIds = Object.keys(this._fieldIdNodeMap);
    return allFieldIds.filter((fieldId) => {
      return (
        this.aggregateLogicTree(fieldId).getCircularLogicNodes().length > 0
      );
    });
  }

  evaluateWithValues<T>(values: { [fieldId: string]: any }): T {
    return Object.entries(this._fieldIdNodeMap).map(([fieldId, field]) => {
      return field.evaluateWithValues(values);
    }) as T;
  }

  getDependantFields(): string[] {
    return this._dependantFieldIds.slice();
  }

  getFieldsBySection(section: FsTreeField) {
    const childrenFieldNodes = this.getChildrenContentOf(
      this.rootNodeId
    ) as TTreeFieldNode[];

    const sectionChildren = childrenFieldNodes
      .filter((fieldNode) => {
        const { fieldId, field } = fieldNode;

        const visibilityNode = field.getVisibilityNode();
        // return x?.parentNode?.fieldId === section.fieldId;

        return Object.is(visibilityNode?.parentNode, section);
      })
      .map((fieldNode) => fieldNode.field);
    return sectionChildren;
  }

  private getEvaluatorByFieldId(fieldId: string): IEValuator {
    const treeField = this.getFieldById(fieldId);
    return treeField.getSubmissionEvaluator();
  }

  getUiPopulateObject(
    apiSubmissionJson: TSubmissionJson
  ): TUiEvaluationObject[] {
    if (
      !("data" in apiSubmissionJson) ||
      !Array.isArray(apiSubmissionJson.data)
    ) {
      console.log("Do not not understand apiSubmissionJson");
      console.log({ apiSubmissionJson });
      return [];
    }

    const mappedSubmissionData = apiSubmissionJson.data.reduce(
      (prev: any, cur: any) => {
        prev[cur.field] = cur.value;
        return prev;
      },
      {}
    );
    // need to make sure guard against non array types
    const submissionUiDataItems: TUiEvaluationObject[] = this.getAllFieldIds()
      .map((fieldId) => {
        const evaluator = this.getEvaluatorByFieldId(fieldId);
        return evaluator.getUiPopulateObjects(mappedSubmissionData[fieldId]);
      })
      .reduce((prev: TUiEvaluationObject[], cur: TUiEvaluationObject[]) => {
        prev.push(...cur);
        return prev;
      }, []);

    return submissionUiDataItems;
  }
  static fromFieldJson(
    fieldsJson: TFsFieldAnyJson[],
    formId = "_FORM_ID_"
  ): FsTreeFieldCollection {
    const tree = new FsTreeFieldCollection(formId, new FsFormRootNode(formId));

    (fieldsJson || []).forEach((fieldJson) => {
      const field = FsTreeField.fromFieldJson(
        transformers.fieldJson(fieldJson)
      );

      // this doesn't belong in the loop ??
      tree.appendChildNodeWithContent(tree.rootNodeId, {
        fieldId: field.fieldId,
        field,
      });
    });

    //
    tree.getChildrenContentOf(tree.rootNodeId).forEach((childContent) => {
      const { fieldId, field } = childContent as TTreeFieldNode;
      tree._fieldIdNodeMap[fieldId] = field;
    });

    const childrenNodeContent = tree.getChildrenContentOf(
      tree.rootNodeId
    ) as TTreeFieldNode[];

    const sortedNodes = childrenNodeContent.sort(sortBySortProperty);

    let currentSection: FsTreeField | null = null;
    for (let childNode of sortedNodes) {
      // order is necessary
      const { fieldId, field } = childNode;
      const { type: fieldType } = field?.fieldJson as TFsFieldAny;

      if (fieldType && fieldType === "section") {
        currentSection = field;
      } else if (currentSection instanceof FsTreeField) {
        const isUltimatelyVisible = (values: {
          [fieldId: string]: any;
        }): boolean => {
          // @ts-ignore - current section may be null
          return currentSection.evaluateWithValues(values) || false;
        };

        field.appendChildNodeWithContent(
          field.rootNodeId,
          new FsFieldVisibilityLinkNode(isUltimatelyVisible, currentSection)
        );
      }
    }

    return tree;
  }
}
export { FsTreeFieldCollection };

const sortBySortProperty = (
  fieldNodeA: TTreeFieldNode,
  fieldNodeB: TTreeFieldNode
) => {
  const fieldAJson = fieldNodeA.field.fieldJson as TFsFieldAny;
  const fieldBJson = fieldNodeB.field.fieldJson as TFsFieldAny;

  if (fieldAJson.sort === undefined || fieldBJson.sort === undefined) {
    return 1;
  }
  const sortA = parseInt(fieldAJson.sort + "");
  const sortB = parseInt(fieldBJson.sort + "");

  if (sortA > sortB) {
    return 1;
  }
  if (sortA < sortB) {
    return -1;
  }
  return 0;
};
