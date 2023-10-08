import { AbstractExpressionTree } from "predicate-tree-advanced-poc/dist/src";

import { FsTreeField } from "./trees/FsTreeField";

import { FsFieldVisibilityLinkNode, FsFormRootNode } from "./trees/nodes";
import {
  TFsFieldLogicCheckLeaf,
  TFsFieldLogicJunction,
  // TFsFieldLogicJunctionJson,
  TFsJunctionOperators,
  TFsLeafOperators,
  TFsLogicNode,
  // TLogicJunctionOperators,
  TTreeFieldNode,
} from "./types";

import {
  FsCircularDependencyNode,
  FsCircularMutualInclusiveNode,
  FsCircularMutualExclusiveNode,
  FsLogicBranchNode,
  FsLogicLeafNode,
  FsMaxDepthExceededNode,
  FsTreeLogicDeep,
} from "./trees/FsTreeLogicDeep";

import { FsTreeLogic } from "./trees/FsTreeLogic";
import { TStatusRecord, TUiEvaluationObject } from "../Evaluator/type";
import { TApiForm, TSubmissionJson } from "../../type.form";
import { IEValuator } from "../Evaluator/IEvaluator";
import { TFsFieldAny } from "../../type.field";
import { AbstractLogicNode } from "./trees/FsTreeLogicDeep/LogicNodes/AbstractLogicNode";

interface ILogicCheck {
  fieldId: string;
  // fieldJson: {
  //   field: 152293117,
  //   condition: "equals",
  //   option: "Zero",
  // },
  condition: TFsLeafOperators;
  option: string;
}

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
  ): FsTreeLogicDeep | null {
    return FsTreeLogicDeep.fromFieldCollection(field.fieldId, this);
  }

  private x_getExtendedTree<T extends FsTreeLogicDeep = FsTreeLogicDeep>(
    field: FsTreeField,
    atNodeId?: string,
    extendedTree?: FsTreeLogicDeep
  ): T {
    const logicTree = field.getLogicTree() as FsTreeLogic;
    if (logicTree === null) {
      // *tmc* probably what to type check null or undefined
      const t = new FsTreeLogicDeep(field.fieldId);
      t.ownerFieldId = field.fieldId;
      return t as T;
    }

    const rootNodeContent = logicTree.getChildContentAt(
      logicTree.rootNodeId //
    ) as unknown as TFsFieldLogicJunction<TFsJunctionOperators>;

    let exTree: FsTreeLogicDeep;
    let currentBranchNodeId: string;

    const { conditional, action, fieldJson, checks } = rootNodeContent;
    const newBranchNode = new FsLogicBranchNode(
      field.fieldId,
      (conditional || "all") as TFsJunctionOperators,
      action || null,
      checks as TFsFieldLogicCheckLeaf[],
      // @ts-ignore - logicJson isn't a member (logicJson should be fieldJson)
      fieldJson || rootNodeContent.logicJson
    );

    if (extendedTree === undefined) {
      exTree = new FsTreeLogicDeep(field.fieldId, newBranchNode);
      exTree.ownerFieldId = field.fieldId;
      atNodeId = exTree.rootNodeId;
      currentBranchNodeId = exTree.rootNodeId;
    } else {
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
            // @ts-ignore
            this.getCorrectCircularNode(
              exTree,
              // @ts-ignore
              childField,
              childContent as unknown as TFsFieldLogicCheckLeaf // TFsFieldLogicCheckLeaf
            )
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

    // (checks || []).forEach((check) => {
    //   const { fieldId, condition, option } = check;
    //   exTree.appendChildNodeWithContent(
    //     currentBranchNodeId || "",
    //     new FsLogicLeafNode(`${fieldId}`, condition, option)
    //   );
    // });

    return exTree as T;
  }

  private isTwoConditionsMutuallyExclusive(
    fieldJson: TFsFieldAny,
    conditionA: ILogicCheck, // TFsFieldLogicCheckLeaf,
    conditionB: ILogicCheck //TFsFieldLogicCheckLeaf
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
    // childField: ILogicCheck,
    // childContent: ILogicCheck
    childField: FsTreeField,
    childContent: TFsFieldLogicCheckLeaf
  ): TFsLogicNode {
    const existingChildContent =
      exTree.getChildContentByFieldId<TFsFieldLogicCheckLeaf>(
        childContent.fieldId
      ) as FsLogicLeafNode;
    const logicSubjectTreeField = this.getFieldById(childField.fieldId);

    if (!childContent || !existingChildContent) {
      return new FsCircularDependencyNode(
        exTree.ownerFieldId,
        childField.fieldId,
        exTree.getDependentFieldIds()
      );
    }

    if (existingChildContent.condition) {
    }
    // I think if you're going to use the virtual root option - something has to be done with fieldId?
    // I think Deep tree should have function fromFieldCollection, and all of this gets handled there
    // if virtualRoot - look into append tree again - see why/how to use it - it should  work, I think
    // I think LogicTree and LogicTreeDeep - should be using the same nodes - I think?
    const isMutualExclusiveConflict = this.isTwoConditionsMutuallyExclusive(
      logicSubjectTreeField.fieldJson,
      childContent,
      existingChildContent
    );

    if (isMutualExclusiveConflict) {
      return new FsCircularMutualExclusiveNode(
        exTree.ownerFieldId,
        childField.fieldId,
        exTree.getDependentFieldIds(),
        { conditionalA: childContent, conditionalB: existingChildContent }
      );
    } else {
      return new FsCircularMutualInclusiveNode(
        exTree.ownerFieldId,
        childField.fieldId,
        exTree.getDependentFieldIds(),
        { conditionalA: childContent, conditionalB: existingChildContent }
      );
    }
  }

  aggregateLogicTree(fieldId: string): FsTreeLogicDeep {
    const field = this.getFieldTreeByFieldId(fieldId) as FsTreeField;

    // @ts-ignore - possible null
    return this.getExtendedTree(field);
  }

  getAllLogicStatusMessages(): TStatusRecord[] {
    const allFieldIds = Object.keys(this._fieldIdNodeMap);
    // const allFieldIds = ["152290546", "152290563"]; // *tmc* debug

    const statusMessages: TStatusRecord[] = [];
    // does _dependantFieldIds ever get used?

    allFieldIds.forEach((fieldId) => {
      const agTree = this.aggregateLogicTree(fieldId);
      if (agTree instanceof FsTreeLogicDeep) {
        statusMessages.push(...agTree.getStatusMessage());
      }
    });
    return statusMessages.filter(
      (statusMessage) => statusMessage.severity !== "debug" // filter probably shouldn't be here
    );
  }

  getFieldTreeByFieldId(fieldId: string): FsTreeField | undefined {
    // I wounder if a look-up table wouldn't be better
    //  also you're filtering after map, if possible the other order would be preferred
    return this._fieldIdNodeMap[fieldId];
  }

  getFieldIdsWithCircularLogic(): string[] {
    const allFieldIds = Object.keys(this._fieldIdNodeMap);
    return allFieldIds.filter((fieldId) => {
      const agTree = this.aggregateLogicTree(fieldId);
      if (agTree) {
        return agTree.getCircularLogicNodes().length > 0;
      }
      // return false; // necessary?
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
      console.log("Did not understand apiSubmissionJson");
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

  static fromApiFormJson(
    formJson: TApiForm,
    formId = "_FORM_ID_"
  ): FsTreeFieldCollection {
    const fieldsJson = formJson.fields;

    const tree = new FsTreeFieldCollection(formId, new FsFormRootNode(formId));

    (fieldsJson || []).forEach((fieldJson) => {
      const field = FsTreeField.fromFieldJson(fieldJson);

      tree.appendChildNodeWithContent(tree.rootNodeId, {
        fieldId: field.fieldId,
        field,
      });
    });

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
          // @ts-ignore - section may be null. This depends on 'evaluateWithValues' which is not complete
          return currentSection.evaluateWithValues(values) || false;
        };

        // because sections can't be in sections
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
