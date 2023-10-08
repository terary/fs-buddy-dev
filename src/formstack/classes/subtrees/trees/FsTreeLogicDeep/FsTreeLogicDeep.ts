import { ITree, TTreePojo } from "predicate-tree-advanced-poc/dist/src";
import { FsCircularDependencyNode } from "./LogicNodes/FsCircularDependencyNode";
import { FsTreeField } from "../FsTreeField";
import { TFsFieldAny } from "../../../../type.field";
import { AbstractLogicNode } from "./LogicNodes/AbstractLogicNode";
import { FsTreeLogicDeepInternal } from "./FsTreeLogicDeepInternal";
import { TStatusRecord } from "../../../Evaluator/type";
import { FsTreeFieldCollection } from "../../FsTreeFieldCollection";
import { FsTreeLogic } from "../FsTreeLogic";
import {
  TFsFieldLogicJunction,
  TFsFieldLogicCheckLeaf,
  TFsJunctionOperators,
  TSimpleDictionary,
  TFsLogicNode,
} from "../../types";

// | TFsFieldLogicJunction<TFsJunctionOperators>
// | TFsFieldLogicCheckLeaf;

import { FsLogicBranchNode } from "./LogicNodes/FsLogicBranchNode";
import { TFsFieldLogicCheckLeafFromJson } from "../../../../transformers/TFsFieldLogicCheckLeafFromJson";
import { FsMaxDepthExceededNode } from "./LogicNodes/FsMaxDepthExceededNode";
import { FsLogicLeafNode } from "./LogicNodes/FsLogicLeafNode";
import { FsVirtualRootNode } from "./LogicNodes/FsVirtualRootNode";
import { FsCircularMutualExclusiveNode } from "./LogicNodes/FsCircularMutualExclusiveNode";
import { FsCircularMutualInclusiveNode } from "./LogicNodes/FsCircularMutualInclusiveNode";

class FsTreeLogicDeep {
  static readonly MAX_TOTAL_NODES = 50;
  private _fsDeepLogicTree: FsTreeLogicDeepInternal;
  private _rootFieldId: string;
  constructor(rootNodeId?: string, nodeContent?: AbstractLogicNode) {
    // @ts-ignore
    this._rootFieldId = nodeContent?.ownerFieldId
      ? // @ts-ignore
        nodeContent?.ownerFieldId
      : // @ts-ignore
        nodeContent?.fieldId;
    this._fsDeepLogicTree = new FsTreeLogicDeepInternal(
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

  countTotalNodes() {
    return this._fsDeepLogicTree.countTotalNodes();
  }

  getDependentChainFieldIds() {
    return this._fsDeepLogicTree.getDependantFieldIds() || [];
  }

  getChildContentAt(
    nodeId: string
  ): AbstractLogicNode | ITree<AbstractLogicNode> | null {
    return this._fsDeepLogicTree.getChildContentAt(nodeId);
  }

  getChildContentByFieldId<T = AbstractLogicNode>(fieldId: string) {
    return this._fsDeepLogicTree.getChildContentByFieldId(fieldId);
  }

  getCircularLogicNodes(): FsCircularDependencyNode[] {
    return this._fsDeepLogicTree.getCircularLogicNodes();
  }

  getDependentFieldIds(): string[] {
    return this._fsDeepLogicTree.getDependantFieldIds();
  }

  isExistInDependencyChain(field?: FsTreeField) {
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

  getStatusMessage(dependentChainFieldIds?: string[]): TStatusRecord[] {
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

  toPojoAt(): TTreePojo<AbstractLogicNode> {
    return this._fsDeepLogicTree.toPojoAt(this._fsDeepLogicTree.rootNodeId);
  }

  static fromFieldJson(fieldJson: TFsFieldAny): FsTreeLogicDeep {
    const internalTree = FsTreeLogicDeepInternal.fromFieldJson(fieldJson);

    const tree = new FsTreeLogicDeep();
    tree._fsDeepLogicTree = internalTree;

    return tree;
  }

  getAllLogicStatusMessages(): TStatusRecord[] {
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
    deepTree: FsTreeLogicDeep,
    targetFieldContent: TFsLogicNode
  ): FsCircularDependencyNode {
    const existingChildContent = deepTree.getChildContentByFieldId(
      targetFieldId
    ) as unknown as
      | TFsFieldLogicJunction<TFsJunctionOperators>
      | TFsFieldLogicCheckLeaf;

    if (existingChildContent instanceof FsLogicLeafNode) {
      if (
        // @ts-ignore - not sure target is leaf (therefore maybe now "condition")
        targetFieldContent.condition === existingChildContent.condition &&
        // @ts-ignore - not sure target is leaf (therefore maybe now "option")
        targetFieldContent.option === existingChildContent.option
      ) {
        return new FsCircularMutualInclusiveNode(
          deepTree.ownerFieldId,
          targetFieldId,
          deepTree.getDependentFieldIds(),
          {
            conditionalA:
              targetFieldContent as unknown as TFsFieldLogicCheckLeaf,
            conditionalB:
              existingChildContent as unknown as TFsFieldLogicCheckLeaf,
          }
        );
      } else {
        return new FsCircularMutualExclusiveNode(
          deepTree.ownerFieldId,
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

    return new FsCircularDependencyNode(
      deepTree.ownerFieldId,
      targetFieldId,
      deepTree.getDependentFieldIds()
    );
  }

  private static appendFieldTreeNodeToLogicDeep(
    fieldLogicTree: FsTreeLogic,
    fieldLogicNodeId: string,
    deepTree: FsTreeLogicDeep,
    deepTreeNodeId: string,
    fieldCollection: FsTreeFieldCollection
  ): FsTreeLogicDeep | null {
    const nodeContent =
      fieldLogicTree.getChildContentAtOrThrow(fieldLogicNodeId);
    const childrenNodeIds =
      fieldLogicTree.getChildrenNodeIdsOf(fieldLogicNodeId);

    // @ts-ignore -- need to work-out the "fieldId" and "ownerFieldId"
    const fieldId = nodeContent?.fieldId || nodeContent?.ownerFieldId;
    if (!fieldId) {
      throw Error("Found no field id" + JSON.stringify(nodeContent));
    }

    if (
      deepTree._fsDeepLogicTree.countTotalNodes() >
      FsTreeLogicDeep.MAX_TOTAL_NODES
    ) {
      throw new Error("What - too many nodes");
    }

    // @ts-ignore  -- maybe isExist should be defined with an interface
    if (deepTree._fsDeepLogicTree.isExistInDependencyChain(nodeContent)) {
      deepTree.appendChildNodeWithContent(
        deepTreeNodeId,
        new FsCircularDependencyNode(
          deepTree.getDependentChainFieldIds().pop() ||
            "_NO_PREVIOUS_FIELD_ID_",
          fieldId,
          deepTree.getDependentChainFieldIds()
        )
      );
      return null;
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
      const childNodeContent =
        fieldLogicTree.getChildContentAtOrThrow<TFsFieldLogicCheckLeaf>(
          childNodeId
        );

      const { fieldId, condition, option } = childNodeContent;
      const childTreeField = fieldCollection.getFieldTreeByFieldId(fieldId);

      if (deepTree.isExistInDependencyChain(childTreeField)) {
        const circularReferenceNode = FsTreeLogicDeep.getCircularReferenceNode(
          fieldId,
          deepTree,
          childNodeContent
        );
        deepTree.appendChildNodeWithContent(
          newBranchNodeId,
          circularReferenceNode
        );
      } else if (childTreeField?.getLogicTree() === null) {
        // append leaf
        deepTree.appendChildNodeWithContent(
          newBranchNodeId,
          new FsLogicLeafNode(fieldId, condition, option)
        );
      } else {
        // recursive call
        return FsTreeLogicDeep.fromFieldCollection(
          fieldId,
          fieldCollection,
          deepTree
        );
      }
    });

    return deepTree;
  }
  // this may cause circular imports (FieldCollection imports LogicDeep, LogicDeep imports FieldCOllection) ??
  static fromFieldCollection(
    fieldId: string,
    fieldCollection: FsTreeFieldCollection,
    deepTree?: FsTreeLogicDeep
  ): FsTreeLogicDeep | null {
    const field = fieldCollection.getFieldTreeByFieldId(fieldId);

    if (field === undefined) {
      return null;
    }
    const logicTree = field.getLogicTree() || null;
    const visualTree =
      field.getVisibilityNode()?.parentNode?.getLogicTree() || null; //as FsTreeLogic;

    if (!logicTree && !visualTree) {
      return null;
    }

    const tree =
      deepTree ||
      new FsTreeLogicDeep(
        "_ROOT_", // this should be fieldId - but for the time being want to rule out name conflicts
        // field.fieldId,
        new FsVirtualRootNode(fieldId)
      );

    if (!logicTree) {
      return FsTreeLogicDeep.appendFieldTreeNodeToLogicDeep(
        visualTree as FsTreeLogic,
        (visualTree as FsTreeLogic).rootNodeId,
        tree,
        tree.rootNodeId,
        fieldCollection
      );
    }

    if (!visualTree) {
      return FsTreeLogicDeep.appendFieldTreeNodeToLogicDeep(
        logicTree as FsTreeLogic,
        (logicTree as FsTreeLogic).rootNodeId,
        tree,
        tree.rootNodeId,
        fieldCollection
      );
    }

    FsTreeLogicDeep.appendFieldTreeNodeToLogicDeep(
      logicTree as FsTreeLogic,
      (logicTree as FsTreeLogic).rootNodeId,
      tree,
      tree.rootNodeId,
      fieldCollection
    );
    return FsTreeLogicDeep.appendFieldTreeNodeToLogicDeep(
      visualTree as FsTreeLogic,
      (visualTree as FsTreeLogic).rootNodeId,
      tree,
      tree.rootNodeId,
      fieldCollection
    );
  }
}
export { FsTreeLogicDeep };
