import {
  AbstractExpressionTree,
  IExpressionTree,
} from "predicate-tree-advanced-poc/dist/src";

import { TFsFieldAnyJson } from "../types";
import { FsTreeLogicDeep } from "./trees/FsTreeLogicDeep";
import { FsTreeField } from "./trees/FsTreeField";
import { transformers } from "../../transformers";

import { FsFieldVisibilityLinkNode, FsFormRootNode } from "./trees/nodes";
import {
  TFsFieldLogicCheckLeaf,
  TFsFieldLogicJunction,
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
import { symbolName } from "typescript";
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

  private getExtendedTree_save<T extends FsTreeLogicDeep = FsTreeLogicDeep>(
    field: FsTreeField,
    atNodeId?: string,
    extendedTree?: FsTreeLogicDeep
  ): T {
    const logicTree = field.getLogicTree() as FsTreeLogic;

    if (logicTree === null) {
      //
      if (extendedTree !== undefined) {
        extendedTree.appendChildNodeWithContent(
          atNodeId || extendedTree.rootNodeId,
          // if a field has no logic do we return ExtendTree with 1 and 1 one node?
          //@ts-ignore
          new FsLogicLeafNode(field.fieldId, "condition", "option")
        );
        return extendedTree as T;
      } else {
        const newExtendedTree = new FsTreeLogicDeep(
          field.fieldId,
          // @ts-ignore
          new FsLogicLeafNode(field.fieldId, "condition", "option")
        );
        newExtendedTree.ownerFieldId = field.fieldId;
        return newExtendedTree as T;
      }
    }

    const rootNodeContent = logicTree.getChildContentAt(
      logicTree.rootNodeId //
    ) as TFsFieldLogicJunction<TLogicJunctionOperators>;

    let exTree: FsTreeLogicDeep;
    let currentBranchNodeId: string;
    const { conditional, action, logicJson } = rootNodeContent;
    const newBranchNode = new FsLogicBranchNode(
      field.fieldId,
      // @ts-ignore - doesn't like '$in'
      (conditional || "$and") as TLogicJunctionOperators,
      action || null,
      logicJson
    );

    if (extendedTree === undefined) {
      const { conditional, action, logicJson } =
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
      exTree.getTreeNodeIdsAt(exTree.rootNodeId).length >
      FsTreeFieldCollection.MAX_DEPTH
    ) {
      exTree.appendChildNodeWithContent(
        currentBranchNodeId,
        new FsMaxDepthExceededNode()
      );
      return exTree as T;
    }
    // technically logicTree should always have children but in reality it's sometimes missing.
    // look at merge move clone
    // its the same
    //       - if current node is leaf and parameter of extend tree, append leaf to parameter return tree
    //       - if current node is leaf and parameter extTree==undefined, create tree, append node return tree

    //       - if current node is isBranch, append current node content walk the branches adding leafs/branches

    //       This is fine except we need node, build extended.

    //       getLogicTree logic tree should have visisibility?

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
            new FsCircularDependencyNode(
              exTree.ownerFieldId,
              childField.fieldId,
              exTree.getDependantFieldIds()
            )
          );
        } else if (childField.getLogicTree() === null) {
          const {
            fieldId,
            condition,
            option,
            fieldJson: predicateJson,
          } = childContent;
          exTree.appendChildNodeWithContent(
            currentBranchNodeId,
            new FsLogicLeafNode(fieldId, condition, option, predicateJson)
          );
        } else {
          this.getExtendedTree_save(childField, atNodeId, exTree); //(childFieldId)
        }
      });

    return exTree as T;
  }

  private extendedTreeOrNew(
    fieldId: string,
    extendedTree?: FsTreeLogicDeep
  ): FsTreeLogicDeep {
    if (extendedTree) {
      return extendedTree;
    }

    const newTree = new FsTreeLogicDeep(
      fieldId,
      // @ts-ignore
      new FsLogicLeafNode(fieldId, "condition", "option")
    );
    newTree.ownerFieldId = fieldId;
    return newTree;
  }

  private getOrCreateEmptyExtendTree(
    fieldId: string,
    atNodeId?: string,
    extendedTree?: FsTreeLogicDeep
  ): FsTreeLogicDeep {
    let newNode: FsCircularDependencyNode | FsLogicLeafNode =
      //@ts-ignore
      new FsLogicLeafNode(fieldId, "condition", "option");

    if (extendedTree === undefined) {
      const newExtendedTree = new FsTreeLogicDeep(fieldId, newNode);
      newExtendedTree.ownerFieldId = fieldId;
      return newExtendedTree;
    } else {
      if (extendedTree.getDependantFieldIds().includes(fieldId)) {
        newNode = new FsCircularDependencyNode(
          extendedTree.ownerFieldId,
          fieldId,
          extendedTree.getDependantFieldIds()
        );
      }

      extendedTree.appendChildNodeWithContent(
        atNodeId || extendedTree.rootNodeId,
        newNode
      );
      return extendedTree;
    }
  }

  private getExtendedTree<T extends FsTreeLogicDeep = FsTreeLogicDeep>(
    field: FsTreeField,
    atNodeId?: string,
    extendedTree?: FsTreeLogicDeep
  ): T {
    const logicTree = field.getLogicTree() as FsTreeLogic;

    if (logicTree === null) {
      return this.getOrCreateEmptyExtendTree(
        field.fieldId,
        atNodeId,
        extendedTree
      ) as T;
    }

    const rootNodeContent = logicTree.getChildContentAt(logicTree.rootNodeId);
    const { conditional, action, logicJson } =
      rootNodeContent as TFsFieldLogicJunction<TLogicJunctionOperators>;
    const newBranchNode = new FsLogicBranchNode(
      field.fieldId,
      // @ts-ignore - doesn't like '$in'
      (conditional || "$and") as TLogicJunctionOperators,
      action || null,
      logicJson
    );

    let exTree: FsTreeLogicDeep;
    let currentBranchNodeId: string;

    if (extendedTree === undefined) {
      const { conditional, action, logicJson } =
        rootNodeContent as TFsFieldLogicJunction<TLogicJunctionOperators>;

      exTree = new FsTreeLogicDeep(field.fieldId, newBranchNode);
      exTree.ownerFieldId = field.fieldId;
      atNodeId = exTree.rootNodeId;
      currentBranchNodeId = exTree.rootNodeId;
    } else {
      // assert(atNodeId !== undefined);
      // !!atNodeId && throw new Error('Expected something');
      if (extendedTree.isInDependentsFields(field.fieldId)) {
        currentBranchNodeId = extendedTree.appendChildNodeWithContent(
          atNodeId || "",
          new FsCircularDependencyNode(
            field.fieldId,
            atNodeId || "__FIELD_ID__",
            extendedTree.getDependantFieldIds()
          )
        );
        return extendedTree as T;
      }
      exTree = extendedTree; // because possible undefined
      currentBranchNodeId = extendedTree.appendChildNodeWithContent(
        atNodeId || "",
        newBranchNode
      );
    }

    if (
      // this should be more intelligent
      exTree.getTreeNodeIdsAt(exTree.rootNodeId).length >
      FsTreeFieldCollection.MAX_DEPTH
    ) {
      exTree.appendChildNodeWithContent(
        currentBranchNodeId,
        new FsMaxDepthExceededNode()
      );
      return exTree as T;
    }
    // technically logicTree should always have children but in reality it's sometimes missing.
    // look at merge move clone
    // its the same
    //       - if current node is leaf and parameter of extend tree, append leaf to parameter return tree
    //       - if current node is leaf and parameter extTree==undefined, create tree, append node return tree

    //       - if current node is isBranch, append current node content walk the branches adding leafs/branches

    //       This is fine except we need node, build extended.

    //       getLogicTree logic tree should have visisibility?

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
            new FsCircularDependencyNode(
              exTree.ownerFieldId,
              childField.fieldId,
              exTree.getDependantFieldIds()
            )
          );
        } else if (childField.getLogicTree() === null) {
          /// TFsFieldLogicCheckLeaf
          const {
            fieldId,
            condition,
            option,
            fieldJson: predicateJson,
          } = childContent;
          //  TFsFieldLogicCheckLeaf
          exTree.appendChildNodeWithContent(
            currentBranchNodeId,
            new FsLogicLeafNode(fieldId, condition, option, predicateJson)
          );
        } else {
          this.getExtendedTree(childField, atNodeId, exTree); //(childFieldId)
        }
      });

    return exTree as T;
  }

  aggregateLogicTree(fieldId: string): FsTreeLogicDeep {
    const field = this.getFieldTreeByFieldId(fieldId) as FsTreeField;

    if (field.getVisibilityNode() === null) {
      return this.getExtendedTree(field);
    }

    const visibilityPanel = (
      field.getVisibilityNode() as FsFieldVisibilityLinkNode
    ).parentNode;

    const visibilityExtendTree = this.getExtendedTree(
      visibilityPanel as FsTreeField
    );

    return this.getExtendedTree(
      field,
      visibilityExtendTree.rootNodeId,
      visibilityExtendTree
    );
  }

  //  Just for fun,  build a function builds the tree similar to here (using branch, LeafNode etc)
  // the tree should have property merge tree
  // these should be the same type tree newTree<TYPE_X>.merge(otherTree<TYPE_X>);
  devDebug_getExtendedTree2(fieldId: string): FsTreeLogicDeep {
    const field = this.getFieldTreeByFieldId(fieldId) as FsTreeField;
    const panel = field.getVisibilityNode()?.parentNode;
    const e1 = this.getExtendedTree(field);
    const e1Count = e1.getTreeNodeIdsAt(e1.rootNodeId);
    const e1DepChain = e1.getDependantFieldIds(); // .getTreeNodeIdsAt(e1.rootNodeId);
    const pE = this.getExtendedTree(panel as FsTreeField);
    const e2 = this.getExtendedTree(field, pE.rootNodeId, pE);
    `
    Why two leaf nodes are circular reference? Should get caught at branch? or not?

`;
    const pECount = pE.getTreeNodeIdsAt(pE.rootNodeId);
    const peDepChain = pE.getDependantFieldIds(); // .getTreeNodeIdsAt(e1.rootNodeId);
    const e2Count = e2.getTreeNodeIdsAt(e2.rootNodeId);
    const e2DepChain = e2.getDependantFieldIds(); // .getTreeNodeIdsAt(e1.rootNodeId);

    const extLogicTree = this.getExtendedTree(field, field.rootNodeId, pE);
    // appendTree should be an override?
    // should do same walk-through as extendTree (Circular, Root, Branch, etc)
    // should be able to do copy/paste modify
    extLogicTree.appendTreeAt(
      extLogicTree.rootNodeId,
      this.getExtendedTree(field.getVisibilityNode()?.parentNode as FsTreeField)
    );
    return extLogicTree;
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
      const { type: fieldType } = field?.fieldJson as TFsFieldAnyJson;

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
  const fieldAJson = fieldNodeA.field.fieldJson as TFsFieldAnyJson;
  const fieldBJson = fieldNodeB.field.fieldJson as TFsFieldAnyJson;

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
