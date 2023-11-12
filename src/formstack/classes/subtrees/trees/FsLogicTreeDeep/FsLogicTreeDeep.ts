import { TTreePojo } from "predicate-tree-advanced-poc/dist/src";
import { FsCircularDependencyNode } from "./LogicNodes/FsCircularDependencyNode";
import { FsFieldModel } from "../FsFieldModel";
import { AbstractLogicNode } from "./LogicNodes/AbstractLogicNode";
import { FsLogicTreeDeepInternal } from "./FsLogicTreeDeepInternal";
import { TStatusRecord } from "../../../Evaluator/type";
import { FsFormModel } from "../../FsFormModel";
import { FsFieldLogicModel } from "../FsFieldLogicModel";
import {
  TFsFieldLogicJunction,
  TFsFieldLogicCheckLeaf,
  TFsJunctionOperators,
  TFsLogicNode,
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

  constructor(rootNodeId: string, nodeContent: FsVirtualRootNode) {
    this._rootFieldId = nodeContent.fieldId;
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

  getChildContentAt<T = AbstractLogicNode>(nodeId: string): T {
    return this._fsDeepLogicTree.getChildContentAt(nodeId) as T;
  }

  getChildContentByFieldId<T = AbstractLogicNode>(fieldId: string) {
    return this._fsDeepLogicTree.getChildContentByFieldId(fieldId);
  }

  getNodeIdOfNodeContent(nodeContent: AbstractLogicNode): string | null {
    return this._fsDeepLogicTree.getNodeIdOfNodeContent(nodeContent);
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

  // get ownerFieldId() {
  //   return this._fsDeepLogicTree.ownerFieldId;
  // }

  // set ownerFieldId(ownerFieldId: string) {
  //   this._fsDeepLogicTree.ownerFieldId = ownerFieldId;
  // }

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

  toPojoAt(
    nodeId?: string,
    shouldObfuscate = true
  ): TTreePojo<AbstractLogicNode> {
    // this has issues because circular reference nodes are using nodeId(s) which
    // do not get converted to UUID.

    return this._fsDeepLogicTree.toPojoAt(
      nodeId || this._fsDeepLogicTree.rootNodeId,
      shouldObfuscate
    );
  }

  public getAllLogicStatusMessages(): TStatusRecord[] {
    const statusMessages: TStatusRecord[] = [];

    const logicNodes = this._fsDeepLogicTree
      .getTreeContentAt(this._fsDeepLogicTree.rootNodeId)
      .filter((nodeContent) => {
        nodeContent instanceof AbstractLogicNode;
      }) as AbstractLogicNode[];

    logicNodes.forEach((logicNode) => {
      // const s = logicNodes;
      // statusMessages.push(...logicNode.getStatusMessage(this.ownerFieldId, []));
      statusMessages.push(...logicNode.getStatusMessage(this.rootFieldId, []));
    });

    return statusMessages;
  }

  private static getCircularReferenceNode(
    sourceFieldId: string,
    deepTree: FsLogicTreeDeep,
    targetFieldContent: TFsLogicNode
  ): FsCircularDependencyNode {
    const existingChildContent = deepTree.getChildContentByFieldId(
      sourceFieldId
    ) as unknown as
      | TFsFieldLogicJunction<TFsJunctionOperators>
      | TFsFieldLogicCheckLeaf;

    const sourceNodeId =
      existingChildContent !== null
        ? deepTree.getNodeIdOfNodeContent(
            existingChildContent as unknown as AbstractLogicNode
          )
        : null;

    const conditionalA =
      existingChildContent as TFsFieldLogicJunction<TFsJunctionOperators>;
    const conditionalB =
      targetFieldContent as TFsFieldLogicJunction<TFsJunctionOperators>;

    return new FsCircularDependencyNode(
      sourceFieldId,
      sourceNodeId,
      deepTree.getDependentChainFieldIds().slice(-1)[0],
      deepTree.rootNodeId,
      deepTree.getDependentFieldIds(),
      {
        conditionalA: {
          condition: conditionalA.conditional,
          action: conditionalA.action,
        },
        conditionalB: {
          condition: conditionalB.conditional,
          action: conditionalB.action,
        },
      }
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
    fieldLogicTree: FsFieldLogicModel,
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

    if (
      // @ts-ignore
      deepTree._fsDeepLogicTree.isExistInDependencyChain(nodeContent)
    ) {
      const circularNodeId = deepTree.appendChildNodeWithContent(
        deepTreeNodeId,
        FsLogicTreeDeep.getCircularReferenceNode(
          parentFieldId,
          deepTree,
          nodeContent
        )
      );

      deepTree.getChildContentAt<FsCircularDependencyNode>(
        circularNodeId
      ).targetNodeId = circularNodeId;

      return deepTree;
    }

    if (childrenNodeIds.length === 0) {
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
      // for (let i = 0; i < childrenNodeIds.length; i++) {
      // let childNodeId = childrenNodeIds[i];
      const childNodeContent =
        fieldLogicTree.getChildContentAtOrThrow<TFsFieldLogicCheckLeaf>(
          childNodeId
        );
      deepTree.appendChildNodeWithContent(
        newBranchNodeId,
        new FsLogicLeafNode(
          childNodeContent.fieldId,
          childNodeContent.condition,
          childNodeContent.option
        )
      );
      return FsLogicTreeDeep.fromFormModel(
        childNodeContent.fieldId,
        fieldCollection,
        deepTree,
        newBranchNodeId
      );
    });

    return deepTree;
  }

  static fromFormModel(
    fieldId: string,
    formModel: FsFormModel,
    deepTree?: FsLogicTreeDeep,
    deepTreeParentNodeId?: string
  ): FsLogicTreeDeep | null {
    const field = formModel.getFieldModelOrThrow(fieldId);
    const logicTree = field.getLogicTree() || null;
    const visualTree = field.getVisibilityLogicTree();

    if (!logicTree && !visualTree) {
      return null; // non-leaf, non-logic
    }

    const tree =
      deepTree ||
      new FsLogicTreeDeep(field.fieldId, new FsVirtualRootNode(fieldId));

    const parentNodeId = deepTreeParentNodeId || tree.rootNodeId;

    if (!logicTree) {
      return FsLogicTreeDeep.appendFieldTreeNodeToLogicDeep(
        visualTree as FsFieldLogicModel,
        (visualTree as FsFieldLogicModel).rootNodeId,
        tree,
        parentNodeId,
        formModel
      );
    }

    if (!visualTree) {
      return FsLogicTreeDeep.appendFieldTreeNodeToLogicDeep(
        logicTree as FsFieldLogicModel,
        (logicTree as FsFieldLogicModel).rootNodeId,
        tree,
        parentNodeId,
        formModel
      );
    }

    FsLogicTreeDeep.appendFieldTreeNodeToLogicDeep(
      logicTree as FsFieldLogicModel,
      (logicTree as FsFieldLogicModel).rootNodeId,
      tree,
      parentNodeId,
      formModel
    );
    return FsLogicTreeDeep.appendFieldTreeNodeToLogicDeep(
      visualTree as FsFieldLogicModel,
      (visualTree as FsFieldLogicModel).rootNodeId,
      tree,
      parentNodeId,
      formModel
    );
  }
}
export { FsLogicTreeDeep };
