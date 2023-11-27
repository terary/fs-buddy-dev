import {
  AbstractDirectedGraph,
  AbstractExpressionTree,
  AbstractTree,
  IDirectedGraph,
  IExpressionTree,
  ITree,
  TGenericNodeContent,
  TNodePojo,
  TTreePojo,
} from "predicate-tree-advanced-poc/dist/src";
import { TSimpleDictionary } from "../../types";

import { FsCircularDependencyNode } from "./LogicNodes/FsCircularDependencyNode";
import { FsLogicBranchNode } from "./LogicNodes/FsLogicBranchNode";
import { FsLogicLeafNode } from "./LogicNodes/FsLogicLeafNode";
import { FsFieldModel } from "../FsFieldModel";
import { AbstractLogicNode } from "./LogicNodes/AbstractLogicNode";
import { FsVirtualRootNode } from "./LogicNodes/FsVirtualRootNode";
import { FsLogicErrorNode } from "./LogicNodes/FsLogicErrorNode";
import { AbstractLogicTree } from "./AbstractLogicTree";
import { NegateVisitor } from "../NegateVisitor";
import { GenericDirectedGraph } from "predicate-tree-advanced-poc/dist/src/DirectedGraph";
// class FsLogicTreeDeepInternal extends AbstractLogicTree<AbstractLogicNode> {
class FsLogicTreeDeepInternal extends AbstractDirectedGraph<AbstractLogicNode> {
  private _dependantFieldIdsInOrder: string[] = [];

  // protected _ownerFieldId!: string;
  // set ownerFieldId(value: string) {
  //   this._ownerFieldId = value; // *tmc* should determine if this is being used, and remove it
  // }

  // get ownerFieldId() {
  //   return this._ownerFieldId;
  // }

  #dependantFieldIdMap: TSimpleDictionary<AbstractLogicNode> = {};
  constructor(rootNodeId?: string, nodeContent?: AbstractLogicNode) {
    super(rootNodeId, nodeContent);
  }

  public appendChildNodeWithContent(
    parentNodeId: string,
    nodeContent: AbstractLogicNode
  ): string {
    const fieldId = this.extractFieldIdFromNodeContentOrThrow(nodeContent);

    if (!this.isNodeIdExist(parentNodeId)) {
      throw new Error(
        `parentNodeId does not exists. parentNodeId: '${parentNodeId}'.`
      );
    }

    if (nodeContent instanceof FsLogicBranchNode) {
      this.appendFieldIdNode(fieldId, nodeContent);
    }
    return super.appendChildNodeWithContent(parentNodeId, nodeContent);
  }

  private isNodeIdExist(nodeId: string) {
    return this._nodeDictionary[nodeId] !== undefined;
  }

  private appendFieldIdNode(fieldId: string, node: AbstractLogicNode) {
    this.#dependantFieldIdMap[fieldId] = node;
    this._dependantFieldIdsInOrder.push(fieldId);
  }

  createSubtreeAt<Q extends IDirectedGraph<AbstractLogicNode>>(
    parentNodeId: string
  ): Q {
    const subtree = new FsLogicTreeDeepInternal("_subtree_");

    const subtreeParentNodeId = this.appendChildNodeWithContent(
      parentNodeId,
      // @ts-ignore - tree is not LogicNode
      subtree
    );

    AbstractExpressionTree.reRootTreeAt<AbstractLogicNode>(
      // @ts-ignore - Logic tree not AbstractExpression, reRoot is poorly typed and doesn't require most properties
      subtree,
      subtree.rootNodeId,
      subtreeParentNodeId
    );
    subtree._rootNodeId = subtreeParentNodeId;
    subtree._incrementor = this._incrementor;

    return subtree as unknown as Q;
  }

  private get dependantFieldIds() {
    return this._dependantFieldIdsInOrder.slice();
  }

  private extractFieldIdFromNodeContentOrThrow(
    nodeContent: AbstractLogicNode
  ): string {
    const fieldId = this.extractFieldIdFromNodeContent(nodeContent);
    if (fieldId === null) {
      throw new Error("Failed to extract fieldId from nodeContent.");
    }
    return fieldId;
  }

  private extractFieldIdFromNodeContent(
    nodeContent: AbstractLogicNode
  ): string | null {
    if (nodeContent instanceof FsLogicBranchNode) {
      return nodeContent.ownerFieldId;
    } else if (
      nodeContent instanceof FsLogicLeafNode ||
      nodeContent instanceof FsVirtualRootNode ||
      nodeContent instanceof FsLogicErrorNode
    ) {
      return nodeContent.fieldId;
    } else if (nodeContent instanceof FsCircularDependencyNode) {
      return nodeContent._targetFieldId; // + "-circular";
    }

    return null;
  }

  protected findAllNodesOfType<T>(objectType: any): T[] {
    const nodeIds = this.getTreeNodeIdsAt(this.rootNodeId);
    const logicTrees = nodeIds
      .filter(
        (nodeId: any) => this.getChildContentAt(nodeId) instanceof objectType
      )
      .map((nodeId) => this.getChildContentAt(nodeId)) as T[];

    return logicTrees;
  }

  getAllLeafContents(): FsLogicLeafNode[] {
    return this.getTreeContentAt().filter(
      (nodeContent) => nodeContent instanceof FsLogicLeafNode
    ) as FsLogicLeafNode[];
  }

  getChildContentByFieldId<T = AbstractLogicNode>(fieldId: string) {
    return this.#dependantFieldIdMap[fieldId] as T;
  }

  getCircularLogicNodes(): FsCircularDependencyNode[] {
    return this.findAllNodesOfType<FsCircularDependencyNode>(
      FsCircularDependencyNode
    );
  }

  getDependantFieldIds(): string[] {
    // this can be calculated also doing something like (tree.getTreeContent().filter...).
    // This method guarantees order, filtering nodes does not guarantee order but is a
    //  better source of truth
    return this.dependantFieldIds;
  }

  // getChildrenContentOf(parentNodeId: string, shouldIncludeSubtrees?: boolean | undefined): (AbstractLogicNode | ITree<AbstractLogicNode> | null)[] {

  // }

  getLogicErrorNodes(): FsLogicErrorNode[] {
    return this.findAllNodesOfType<FsLogicErrorNode>(FsLogicErrorNode);
  }

  getNodeIdOfNodeContent(nodeContent: AbstractLogicNode): string | null {
    const matchingNodeContent = this.getTreeNodeIdsAt(this.rootNodeId).filter(
      (nodeId) => Object.is(this.getChildContentAt(nodeId), nodeContent)
    );
    if (matchingNodeContent.length === 1) {
      return matchingNodeContent[0];
    }
    return null;
  }

  // cloneAt(nodeId: string): IDirectedGraph<AbstractLogicNode> {

  // }

  static clone(srcTree: FsLogicTreeDeepInternal): FsLogicTreeDeepInternal {
    const clone = new FsLogicTreeDeepInternal();
    clone.#dependantFieldIdMap = structuredClone(srcTree.#dependantFieldIdMap);
    clone._dependantFieldIdsInOrder = srcTree._dependantFieldIdsInOrder.slice();
    clone._nodeDictionary = srcTree._nodeDictionary;
    const nodeCount = srcTree._incrementor.next;
    for (let i = 0; i < nodeCount; i++) {
      clone._incrementor.next;
    }
    return clone;
  }
  cloneAt(nodeId?: string): FsLogicTreeDeepInternal;
  cloneAt(nodeId?: string): IDirectedGraph<AbstractLogicNode>;
  cloneAt<T>(nodeId: string): T {
    // this structure can not support cloneAt because orderFieldIds (it just doesn't make sense)
    return FsLogicTreeDeepInternal.clone(this) as T;
    // const clone = new FsLogicTreeDeepInternal();
    // const pojo = this.toPojoAt(nodeId, false);
    // return FsLogicTreeDeepInternal.fromPojo(pojo) as T;
  }

  // static fromPojo<P extends object, Q>(
  //   srcPojoTree: TTreePojo<P>,
  //   transform?: (nodeContent: TNodePojo<P>) => TGenericNodeContent<P>
  // ): FsLogicTreeDeepInternal;
  // static fromPojo<P extends object, Q>(
  //   srcPojoTree: TTreePojo<P>,
  //   transform?: (nodeContent: TNodePojo<P>) => TGenericNodeContent<P>
  // ): IDirectedGraph<P>;
  // static fromPojo<P extends object, Q = FsLogicTreeDeepInternal>(
  //   srcPojoTree: TTreePojo<P>,
  //   transform?: (nodeContent: TNodePojo<P>) => TGenericNodeContent<P>
  // ): Q {
  //   const aTree = AbstractDirectedGraph.fromPojo(
  //     srcPojoTree,
  //     transform
  //   ) as unknown as FsLogicTreeDeepInternal; // to silence ts error

  //   const tree = new FsLogicTreeDeepInternal(aTree.rootNodeId);
  //   tree._incrementor = aTree._incrementor;
  //   tree._nodeDictionary = aTree._nodeDictionary;

  //   return AbstractDirectedGraph.fromPojo(srcPojoTree, transform) as Q;
  // }

  getNegatedCloneAt(nodeId: string): FsLogicTreeDeepInternal {
    const visitor = new NegateVisitor();
    const clone = this.cloneAt();
    clone.visitAllAt(visitor, nodeId);

    return clone;
  }

  public isExistInDependencyChain(field: FsFieldModel): boolean {
    return (
      // this.ownerFieldId === field.fieldId ||
      this.isInDependentsFields(field.fieldId)
    );
  }

  isInDependentsFields(fieldId: string): boolean {
    return this.dependantFieldIds.includes(fieldId);
  }

  toPojoAt(nodeId?: string | undefined): TTreePojo<AbstractLogicNode>;
  toPojoAt(
    nodeId?: string | undefined,
    shouldObfuscate?: boolean
  ): TTreePojo<AbstractLogicNode>;
  toPojoAt(
    nodeId?: string | undefined,
    shouldObfuscate = true
  ): TTreePojo<AbstractLogicNode> {
    const transformer = (nodeContent: AbstractLogicNode) => {
      try {
        return nodeContent && "toPojo" in nodeContent
          ? nodeContent.toPojo()
          : nodeContent;
      } catch (e) {
        console.log({ e });
        return nodeContent;
      }
    };
    // @ts-ignore - doesn't like generic and the signature, I think the generic is goofed
    // return super.toPojoAt(nodeId, transformer);
    const clearPojo = super.toPojoAt(nodeId, transformer);
    if (shouldObfuscate) {
      return AbstractTree.obfuscatePojo(clearPojo);
    }
    return clearPojo;
  }
}

export { FsLogicTreeDeepInternal };
