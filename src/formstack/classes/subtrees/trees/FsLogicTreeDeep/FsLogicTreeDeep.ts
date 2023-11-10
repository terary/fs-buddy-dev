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
    sourceFieldId: string,
    deepTree: FsLogicTreeDeep,
    targetFieldContent: TFsLogicNode,
    formModel: FsFormModel,
    parentJunctionOperator?: TFsJunctionOperators
  ): FsCircularDependencyNode {
    `
    This should find circular references
    It needs to know, a the target/source node id (fieldId not as relevant)
    this should only be checking branches?
    current conflict seems to be leaf/branch
`;
    const existingChildContent = deepTree.getChildContentByFieldId(
      sourceFieldId
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
          sourceFieldId,
          deepTree.getNodeIdOfNodeContent(existingChildContent),

          deepTree.rootFieldId, /// These are always root?
          deepTree.rootNodeId, /// These are always root?
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
          sourceFieldId,
          deepTree.getNodeIdOfNodeContent(existingChildContent),
          deepTree.rootFieldId, /// These are always root?  Most likely last dependant?
          deepTree.rootNodeId, /// These are always root?  Most likely last dependant?
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

    if (parentJunctionOperator == "any") {
      // const targetNodeId = deepTree.getNodeIdOfNodeContent(
      //   targetFieldContent as AbstractLogicNode
      // );

      // not effecient but maybe it works?
      const x = deepTree._fsDeepLogicTree.getChildContentByFieldId(
        // @ts-ignore
        targetFieldContent.fieldId
      );
      const targetNodeId = deepTree.getNodeIdOfNodeContent(
        x as AbstractLogicNode
      );
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

      const targetFieldId =
        // @ts-ignore - fieldId/ownerFieldId not element of union type
        targetFieldContent?.fieldId || targetFieldContent?.ownerFieldId;
      // const targetNodeId = deepTree.getNodeIdOfNodeContent(targetFieldContent);

      return new FsCircularMutualInclusiveNode(
        sourceFieldId,
        existingChildContent !== null
          ? deepTree.getNodeIdOfNodeContent(
              existingChildContent as unknown as AbstractLogicNode
            )
          : null,
        targetFieldId,
        targetNodeId,
        // deepTree.rootFieldId, /// These are always root?  Most likely last dependant?
        //        deepTree.rootNodeId, /// These are always root?  Most likely last dependant?
        deepTree.getDependentFieldIds(),
        // @ts-ignore
        //        {}
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
    }
    // targetFieldContent
    return new FsCircularDependencyNode(
      sourceFieldId,
      existingChildContent !== null
        ? deepTree.getNodeIdOfNodeContent(
            existingChildContent as unknown as AbstractLogicNode
          )
        : null,
      // @ts-ignore
      targetFieldContent.fieldId,
      // deepTree.rootFieldId,
      deepTree.rootNodeId,
      deepTree.getDependentFieldIds(),
      {
        // @ts-ignore
        conditionalA: {
          // @ts-ignore
          condition: existingChildContent.conditional,
          // @ts-ignore
          action: existingChildContent.action,
          // @ts-ignore
          option: existingChildContent.option,
        },
        // @ts-ignore
        conditionalB: {
          // @ts-ignore
          condition: targetFieldContent.conditional,
          // @ts-ignore
          action: targetFieldContent.action,
          // @ts-ignore
          option: targetFieldContent.option,
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

    // @ts-ignore
    if (deepTree._fsDeepLogicTree.isExistInDependencyChain(nodeContent)) {
      `
        I think remove this check.  Let the child loop catch circular references.

        However, that will likely change the tree structure.  I need to look at the differences
        to make sure everything is ok.
        
      `;

      const circularNodeId = deepTree.appendChildNodeWithContent(
        deepTreeNodeId,
        FsLogicTreeDeep.getCircularReferenceNode(
          parentFieldId,
          deepTree,
          nodeContent,
          fieldCollection
          // parentJunctionOperator
        )
      );
      // const circularNodeContent =
      //   deepTree.getChildContentAt<FsCircularDependencyNode>(circularNodeId);
      deepTree.getChildContentAt<FsCircularDependencyNode>(
        circularNodeId
      ).targetNodeId = circularNodeId;
      return deepTree;
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
      // for (let i = 0; i < childrenNodeIds.length; i++) {
      // let childNodeId = childrenNodeIds[i];
      const childNodeContent =
        fieldLogicTree.getChildContentAtOrThrow<TFsFieldLogicCheckLeaf>(
          childNodeId
        );

      // const { fieldId, condition, option } = childNodeContent;
      const childTreeField = fieldCollection.getFieldTreeByFieldId(
        childNodeContent.fieldId
      );

      // add leaf AND add circular reference under same branch.
      // circular reference should always be a branch. If we do not do both leaf and circular reference
      // the current branch will not have leaves..I think this approach is more comprehensive but also more confusing.
      deepTree.appendChildNodeWithContent(
        newBranchNodeId,
        new FsLogicLeafNode(
          childNodeContent.fieldId,
          childNodeContent.condition,
          childNodeContent.option
        )
      );

      if (childTreeField?.getLogicTree() === null) {
        return deepTree;
      }

      if (deepTree.isExistInDependencyChain(childTreeField)) {
        // if two children from the same parent, conflict, and the parent is "any" then conflict resolves 1, else 0

        // const grandParentNodeId = deepTree.getParentNodeId(newBranchNodeId);
        const { conditional: parentJunctionOperator } =
          deepTree.getChildContentAt<FsLogicBranchNode>(newBranchNodeId);
        // here
        const circularReferenceNode = FsLogicTreeDeep.getCircularReferenceNode(
          newBranchNode.ownerFieldId,
          // fieldId,
          deepTree,
          childNodeContent,
          fieldCollection,
          parentJunctionOperator
        );
        const circularNodeId = deepTree.appendChildNodeWithContent(
          newBranchNodeId,
          circularReferenceNode
        );
        deepTree.getChildContentAt<FsCircularDependencyNode>(
          circularNodeId
        ).targetNodeId = circularNodeId;

        return deepTree; // because this is forEach, all nodes will get added.  Maybe change that to for.. and stop if circular? or not
      } else {
        return FsLogicTreeDeep.fromFormModel(
          childNodeContent.fieldId,
          fieldCollection,
          deepTree,
          newBranchNodeId
        );
        // this is not finding circular within a panel first degree
        // see: 154328256, Inter-dependent (not so much circular) no internal logic

        // Also when detecting circular its not adding target/source - only target/target or source/source (I don't recall which)
        // return FsLogicTreeDeep.appendFieldTreeNodeToLogicDeep(
        //   // fieldLogicTree: FsTreeLogic,
        //   // @ts-ignore - could be null/undefined
        //   fieldCollection.getFieldTreeByFieldId(childNodeContent.fieldId),
        //   // fieldLogicNodeId: string,
        //   childNodeContent.fieldId,
        //   // `_FIELD_ID_: ${childNodeContent.fieldId}`,
        //   // deepTree: FsLogicTreeDeep,
        //   deepTree,
        //   // deepTreeNodeId: string,
        //   newBranchNodeId,
        //   // fieldCollection: FsFormModel
        //   fieldCollection
        // );
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
      // this is a field with no logic -  as a logic tree
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
