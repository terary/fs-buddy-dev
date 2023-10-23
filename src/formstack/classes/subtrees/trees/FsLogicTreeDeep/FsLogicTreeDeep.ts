import { ITree, TTreePojo } from "predicate-tree-advanced-poc/dist/src";
import { FsCircularDependencyNode } from "./LogicNodes/FsCircularDependencyNode";
import { FsFieldModel } from "../FsFieldModel";
import { TFsFieldAny } from "../../../../type.field";
import { AbstractLogicNode } from "./LogicNodes/AbstractLogicNode";
import { FsLogicTreeDeepInternal } from "./FsLogicTreeDeepInternal";
import { TStatusRecord } from "../../../Evaluator/type";
import { FsFormModel } from "../../FsFormModel";
import { FsTreeLogic } from "../FsTreeLogic";
import {
  TFsFieldLogicJunction,
  TFsFieldLogicCheckLeaf,
  TFsJunctionOperators,
  TSimpleDictionary,
  TFsLogicNode,
  TFsFieldLogicNode,
} from "../../types";

import { FsLogicBranchNode } from "./LogicNodes/FsLogicBranchNode";

import { FsLogicLeafNode } from "./LogicNodes/FsLogicLeafNode";
import { FsVirtualRootNode } from "./LogicNodes/FsVirtualRootNode";
import { FsCircularMutualExclusiveNode } from "./LogicNodes/FsCircularMutualExclusiveNode";
import { FsCircularMutualInclusiveNode } from "./LogicNodes/FsCircularMutualInclusiveNode";
import type { TLogicTreeDeepStatisticCountRecord } from "./type";
import { FsLogicErrorNode } from "./LogicNodes/FsLogicErrorNode";

class FsLogicTreeDeep {
  static readonly MAX_TOTAL_NODES = 50;
  private _fsDeepLogicTree: FsLogicTreeDeepInternal;
  private _rootFieldId: string;
  constructor(rootNodeId?: string, nodeContent?: AbstractLogicNode) {
    // @ts-ignore
    this._rootFieldId = nodeContent?.ownerFieldId
      ? // @ts-ignore
        nodeContent?.ownerFieldId
      : // @ts-ignore
        nodeContent?.fieldId;
    this._fsDeepLogicTree = new FsLogicTreeDeepInternal(
      rootNodeId,
      nodeContent
    );
  }

  public appendChildNodeWithContent(
    parentNodeId: string,
    nodeContent: AbstractLogicNode
  ): string {
    return this._fsDeepLogicTree.appendChildNodeWithContent(
      parentNodeId,
      nodeContent
    );
  }

  get rootFieldId() {
    return this._rootFieldId;
  }

  getParentNodeId(childNodeId: string): string {
    return this._fsDeepLogicTree.getParentNodeId(childNodeId);
  }

  countTotalNodes() {
    return this._fsDeepLogicTree.countTotalNodes();
  }

  getDependentChainFieldIds() {
    return this._fsDeepLogicTree.getDependantFieldIds() || [];
  }

  // getChildContentAt<T>(nodeId: string): T;
  // getChildContentAt(
  //   nodeId: string
  // ): AbstractLogicNode | ITree<AbstractLogicNode> | null;

  getChildContentAt<T = AbstractLogicNode>(nodeId: string): T {
    return this._fsDeepLogicTree.getChildContentAt(nodeId) as T;
  }

  getChildContentByFieldId<T = AbstractLogicNode>(fieldId: string) {
    return this._fsDeepLogicTree.getChildContentByFieldId(fieldId);
  }

  getLogicErrorNodes(): FsLogicErrorNode[] {
    return this._fsDeepLogicTree.getLogicErrorNodes();
  }

  getCircularLogicNodes(): FsCircularDependencyNode[] {
    return this._fsDeepLogicTree.getCircularLogicNodes();
  }

  getCircularMutuallyExclusiveLogicNodes(): FsCircularDependencyNode[] {
    return this._fsDeepLogicTree.getCircularMutuallyExclusiveLogicNodes();
  }

  getCircularMutuallyInclusiveLogicNodes(): FsCircularDependencyNode[] {
    return this._fsDeepLogicTree.getCircularMutuallyInclusiveLogicNodes();
  }

  getDependentFieldIds(): string[] {
    return this._fsDeepLogicTree.getDependantFieldIds();
  }

  isExistInDependencyChain(field?: FsFieldModel) {
    if (!field) {
      return false;
    }
    return this._fsDeepLogicTree.isExistInDependencyChain(field);
  }

  get ownerFieldId() {
    return this._fsDeepLogicTree.ownerFieldId;
  }

  set ownerFieldId(ownerFieldId: string) {
    this._fsDeepLogicTree.ownerFieldId = ownerFieldId;
  }

  get rootNodeId() {
    return this._fsDeepLogicTree.rootNodeId;
  }

  getStatusMessage(): TStatusRecord[] {
    const statusMessages: TStatusRecord[] = [];
    this._fsDeepLogicTree.getTreeContentAt().forEach((logicNode) => {
      if (logicNode instanceof AbstractLogicNode) {
        statusMessages.push(
          ...logicNode.getStatusMessage(
            this.rootFieldId,
            // this.ownerFieldId,
            this.getDependentFieldIds()
          )
        );
      }
    });
    return statusMessages;
  }

  // toPojoAt(nodeId?: string | undefined): TTreePojo<AbstractLogicNode>;
  // toPojoAt(nodeId?: string | undefined, shouldObfuscate = true);
  toPojoAt(
    nodeId?: string,
    shouldObfuscate = true
  ): TTreePojo<AbstractLogicNode> {
    return this._fsDeepLogicTree.toPojoAt(
      nodeId || this._fsDeepLogicTree.rootNodeId,
      shouldObfuscate
    );
  }

  static x_fromFieldJson(fieldJson: TFsFieldAny): FsLogicTreeDeep {
    const internalTree = FsLogicTreeDeepInternal.x_fromFieldJson(fieldJson);

    const tree = new FsLogicTreeDeep();
    tree._fsDeepLogicTree = internalTree;

    return tree;
  }

  public getAllLogicStatusMessages(): TStatusRecord[] {
    const statusMessages: TStatusRecord[] = [];

    const logicNodes = this._fsDeepLogicTree
      .getTreeContentAt(this._fsDeepLogicTree.rootNodeId)
      .filter((nodeContent) => {
        nodeContent instanceof AbstractLogicNode;
      }) as AbstractLogicNode[];

    logicNodes.forEach((logicNode) => {
      const s = logicNodes;
      statusMessages.push(...logicNode.getStatusMessage(this.ownerFieldId, []));
    });

    return statusMessages;
  }

  private static getCircularReferenceNode(
    targetFieldId: string,
    deepTree: FsLogicTreeDeep,
    targetFieldContent: TFsLogicNode,
    formModel: FsFormModel,
    parentJunctionOperator?: TFsJunctionOperators
  ): FsCircularDependencyNode {
    const existingChildContent = deepTree.getChildContentByFieldId(
      targetFieldId
    ) as unknown as
      | TFsFieldLogicJunction<TFsJunctionOperators>
      | TFsFieldLogicCheckLeaf;

    // const parentField =

    if (existingChildContent instanceof FsLogicLeafNode) {
      // parentJunctionOperator
      if (
        ((targetFieldContent as FsLogicLeafNode).condition ===
          existingChildContent.condition &&
          (targetFieldContent as FsLogicLeafNode).option ===
            existingChildContent.option) ||
        parentJunctionOperator == "any" // this "any" could be further refined.
      ) {
        const {
          option: optionA,
          condition: conditionA,
          fieldId: fieldIdA,
        } = targetFieldContent as FsLogicLeafNode;
        const {
          option: optionB,
          condition: conditionB,
          fieldId: fieldIdB,
        } = existingChildContent as FsLogicLeafNode;

        return new FsCircularMutualInclusiveNode(
          deepTree.rootFieldId,
          targetFieldId,
          deepTree.getDependentFieldIds(),
          {
            conditionalA: {
              option: optionA,
              condition: conditionA,
              fieldId: fieldIdA,
            },
            conditionalB: {
              option: optionB,
              condition: conditionB,
              fieldId: fieldIdB,
            },
          }
        );
      } else {
        return new FsCircularMutualExclusiveNode(
          deepTree.rootFieldId,
          targetFieldId,
          deepTree.getDependentFieldIds(),
          {
            conditionalA:
              targetFieldContent as unknown as TFsFieldLogicCheckLeaf,
            conditionalB:
              existingChildContent as unknown as TFsFieldLogicCheckLeaf,
          }
        );
      }
    }

    I dont know if MutuallyInclusive is the same way
    would it worth keeping dictionary of fieldExpressions and determine coflicts there?
    could use evaluator - maybe

    is it worth rewriting the whole tree structure?
    
    if (parentJunctionOperator == "any") {
      return new FsCircularMutualInclusiveNode(
        deepTree.rootFieldId,
        targetFieldId,
        deepTree.getDependentFieldIds(),
        // @ts-ignore
        {}
        // {
        //   conditionalA: {
        //     option: optionA,
        //     condition: conditionA,
        //     fieldId: fieldIdA,
        //   },
        //   conditionalB: {
        //     option: optionB,
        //     condition: conditionB,
        //     fieldId: fieldIdB,
        //   },
        // }
      );
    }

    return new FsCircularDependencyNode(
      deepTree.rootFieldId,
      targetFieldId,
      deepTree.getDependentFieldIds()
    );
  }

  /**
   * Return all fieldIds within actual logical leaf term expressions
   *
   * leaf term expression: [fieldId] ["equal" | "noequals" | "gt" ...] [some given value]
   *    returns every "[fieldId]"
   */
  public getAllFieldIdsLeafTermReference() {
    return this._fsDeepLogicTree
      .getAllLeafContents()
      .map((leafNode) => leafNode.fieldId);
  }

  public getStatisticCounts(): TLogicTreeDeepStatisticCountRecord {
    const countRecords: TLogicTreeDeepStatisticCountRecord = {
      totalNodes: 0,
      totalCircularLogicNodes: 0,
      totalCircularExclusiveLogicNodes: 0,
      totalCircularInclusiveLogicNodes: 0,
      totalUnclassifiedNodes: 0,
      totalLeafNodes: 0,
      totalBranchNodes: 0,
      totalRootNodes: 0,
    };
    this._fsDeepLogicTree.getTreeContentAt().forEach((nodeContent) => {
      countRecords.totalNodes++;
      switch (true) {
        case nodeContent instanceof FsCircularMutualExclusiveNode:
          countRecords.totalCircularLogicNodes++;
          countRecords.totalCircularExclusiveLogicNodes++;
          break;

        case nodeContent instanceof FsCircularMutualInclusiveNode:
          countRecords.totalCircularLogicNodes++;
          countRecords.totalCircularInclusiveLogicNodes++;
          break;
        case nodeContent instanceof FsCircularDependencyNode:
          countRecords.totalCircularLogicNodes++;
          break;

        case nodeContent instanceof FsLogicBranchNode:
          countRecords.totalBranchNodes++;
          break;

        case nodeContent instanceof FsLogicLeafNode:
          countRecords.totalLeafNodes++;
          break;
        case nodeContent instanceof FsVirtualRootNode:
          // need to verify each Deep tree has virtual root.  It may be the case
          // that only deepTrees with both visualTree and logicTree will have virtual tree
          countRecords.totalRootNodes++;
          break;

        default:
          countRecords.totalUnclassifiedNodes++;
          break; // <-- never stops being funny.
      }
    });
    return countRecords;
  }

  private static appendFieldTreeNodeToLogicDeep(
    fieldLogicTree: FsTreeLogic,
    fieldLogicNodeId: string,
    deepTree: FsLogicTreeDeep,
    deepTreeNodeId: string,
    fieldCollection: FsFormModel
  ): FsLogicTreeDeep | null {
    const nodeContent =
      fieldLogicTree.getChildContentAtOrThrow(fieldLogicNodeId);
    const childrenNodeIds =
      fieldLogicTree.getChildrenNodeIdsOf(fieldLogicNodeId);

    // @ts-ignore -- need to work-out the "fieldId" and "ownerFieldId"
    const parentFieldId = nodeContent?.fieldId || nodeContent?.ownerFieldId;

    if (!parentFieldId) {
      throw Error("Found no field id" + JSON.stringify(nodeContent));
    }

    if (
      deepTree._fsDeepLogicTree.countTotalNodes() >
      FsLogicTreeDeep.MAX_TOTAL_NODES
    ) {
      throw new Error("What - too many nodes");
    }

    // @ts-ignore  -- maybe isExist should be defined with an interface
    if (deepTree._fsDeepLogicTree.isExistInDependencyChain(nodeContent)) {
      // const { conditional: parentJunctionOperator } =
      //   deepTree.getChildContentAt<FsLogicBranchNode>(parentFieldId);
      // console.log({ parentJunctionOperator });

      deepTree.appendChildNodeWithContent(
        deepTreeNodeId,
        FsLogicTreeDeep.getCircularReferenceNode(
          parentFieldId,
          deepTree,
          nodeContent,
          fieldCollection
        )
      );
      return deepTree;
      // return null;
    }

    if (childrenNodeIds.length === 0) {
      // // maybe not this?
      const { fieldId, condition, option } =
        nodeContent as TFsFieldLogicCheckLeaf;
      deepTree.appendChildNodeWithContent(
        deepTreeNodeId,
        new FsLogicLeafNode(fieldId, condition, option)
      );

      return deepTree;
    }

    const {
      conditional,
      action,
      // @ts-ignore
      logicJson: fieldJson,
      checks,
    } = nodeContent as TFsFieldLogicJunction<TFsJunctionOperators>;

    const newBranchNode = new FsLogicBranchNode(
      // @ts-ignore
      nodeContent.fieldId, //ownerFieldId,
      conditional,
      action || null,
      checks as TFsFieldLogicCheckLeaf[],
      fieldJson
    );

    const newBranchNodeId = deepTree.appendChildNodeWithContent(
      deepTreeNodeId,
      newBranchNode
    );

    childrenNodeIds.forEach((childNodeId) => {
      const childNodeContent =
        fieldLogicTree.getChildContentAtOrThrow<TFsFieldLogicCheckLeaf>(
          childNodeId
        );

      const { fieldId, condition, option } = childNodeContent;
      const childTreeField = fieldCollection.getFieldTreeByFieldId(fieldId);

      deepTree.appendChildNodeWithContent(
        newBranchNodeId,
        new FsLogicLeafNode(fieldId, condition, option)
      );

      if (deepTree.isExistInDependencyChain(childTreeField)) {
        // if two children from the same parent, conflict, and the parent is "any" then conflict resolves 1, else 0

        // const grandParentNodeId = deepTree.getParentNodeId(newBranchNodeId);
        const { conditional: parentJunctionOperator } =
          deepTree.getChildContentAt<FsLogicBranchNode>(newBranchNodeId);

        const circularReferenceNode = FsLogicTreeDeep.getCircularReferenceNode(
          fieldId,
          deepTree,
          childNodeContent,
          fieldCollection,
          parentJunctionOperator
        );
        deepTree.appendChildNodeWithContent(
          newBranchNodeId,
          circularReferenceNode
        );
      } else if (childTreeField?.getLogicTree() === null) {
        // is this necessary?
        // append leaf
        // deepTree.appendChildNodeWithContent(
        //   newBranchNodeId,
        //   new FsLogicLeafNode(fieldId, condition, option)
        // );
      } else {
        // deepTree.appendChildNodeWithContent(
        //   newBranchNodeId,
        //   new FsLogicLeafNode(fieldId, condition, option)
        // );

        // const newChildNodeId = deepTree.appendChildNodeWithContent(
        //   newBranchNodeId,
        //   new FsLogicLeafNode(fieldId, condition, option)
        // );

        // recursive call - not truly 'recursive' in that it's calling a different function which in-turn calls this function
        // this is a dangerous pattern and needs to be reworked to call itself, at a minimum
        return FsLogicTreeDeep.fromFormModel(
          fieldId,
          fieldCollection,
          deepTree,
          newBranchNodeId
        );
      }
    });

    return deepTree;
  }

  static fromFormModel(
    fieldId: string,
    fieldCollection: FsFormModel,
    deepTree?: FsLogicTreeDeep,
    deepTreeParentNodeId?: string
  ): FsLogicTreeDeep | null {
    const field = fieldCollection.getFieldTreeByFieldId(fieldId);

    if (field === undefined && deepTree) {
      deepTree.appendChildNodeWithContent(
        deepTreeParentNodeId || deepTree.rootNodeId,
        new FsLogicErrorNode(
          deepTree.rootFieldId,
          null,
          fieldId,
          `Failed to find fieldId in form. fieldId: "${fieldId}".`,
          deepTree.getDependentChainFieldIds()
        )
      );
      return null;
    } else if (field === undefined) {
      return null;
    }

    const logicTree = field.getLogicTree() || null;
    // const visualTree =
    //   field.getVisibilityNode()?.parentNode?.getLogicTree() || null; //as FsTreeLogic;

    const visualTree = field.getVisibilityLogicTree();
    if (!logicTree && !visualTree) {
      // this is a field with no logic - therefore null as a logic tree
      // when evaluating it should simple return the value provided.  Evaluation is a
      // different animal but is related.

      return null; // non-leaf, non-logic
    }

    const tree =
      deepTree ||
      new FsLogicTreeDeep(
        field.fieldId,
        // "_ROOT_", // this should be fieldId - but for the time being want to rule out name conflicts
        // field.fieldId,
        new FsVirtualRootNode(fieldId)
      );
    const parentNodeId = deepTreeParentNodeId || tree.rootNodeId;
    if (!logicTree) {
      return FsLogicTreeDeep.appendFieldTreeNodeToLogicDeep(
        visualTree as FsTreeLogic,
        (visualTree as FsTreeLogic).rootNodeId,
        tree,
        parentNodeId,
        fieldCollection
      );
    }

    if (!visualTree) {
      return FsLogicTreeDeep.appendFieldTreeNodeToLogicDeep(
        logicTree as FsTreeLogic,
        (logicTree as FsTreeLogic).rootNodeId,
        tree,
        parentNodeId,
        fieldCollection
      );
    }

    FsLogicTreeDeep.appendFieldTreeNodeToLogicDeep(
      logicTree as FsTreeLogic,
      (logicTree as FsTreeLogic).rootNodeId,
      tree,
      parentNodeId,
      fieldCollection
    );
    return FsLogicTreeDeep.appendFieldTreeNodeToLogicDeep(
      visualTree as FsTreeLogic,
      (visualTree as FsTreeLogic).rootNodeId,
      tree,
      parentNodeId,
      fieldCollection
    );
  }
}
export { FsLogicTreeDeep };
