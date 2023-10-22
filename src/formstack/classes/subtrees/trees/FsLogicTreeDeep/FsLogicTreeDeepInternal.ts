import {
  AbstractDirectedGraph,
  AbstractTree,
  IDirectedGraph,
  IExpressionTree,
  ITreeVisitor,
  TGenericNodeContent,
  TNodePojo,
  TTreePojo,
} from "predicate-tree-advanced-poc/dist/src";
import {
  TFsFieldLogicJunction,
  TFsFieldLogicJunctionJson,
  TFsLogicNode,
  TFsJunctionOperators,
  TSimpleDictionary,
  TFsFieldLogicCheckLeaf,
  TFsVisibilityModes,
} from "../../types";
import { AbstractFsTreeLogic } from "../AbstractFsTreeLogic";
import { FsCircularDependencyNode } from "./LogicNodes/FsCircularDependencyNode";
import { FsLogicBranchNode } from "./LogicNodes/FsLogicBranchNode";
import { FsLogicLeafNode } from "./LogicNodes/FsLogicLeafNode";
import { FsFieldModel } from "../FsFieldModel";
import { TFsFieldAny } from "../../../../type.field";
import { AbstractLogicNode } from "./LogicNodes/AbstractLogicNode";
import { FsVirtualRootNode } from "./LogicNodes/FsVirtualRootNode";
import { FsLogicErrorNode } from "./LogicNodes/FsLogicErrorNode";
import { FsFormModel } from "../../FsFormModel";
import { FsCircularMutualInclusiveNode } from "./LogicNodes/FsCircularMutualInclusiveNode";
import { FsCircularMutualExclusiveNode } from "./LogicNodes/FsCircularMutualExclusiveNode";

class FsLogicTreeDeepInternal extends AbstractDirectedGraph<AbstractLogicNode> {
  private _dependantFieldIdsInOrder: string[] = [];
  #dependantFieldIdMap: TSimpleDictionary<AbstractLogicNode> = {};
  // these should not be used.  Chronological order will not be preserved across
  // clones, or pojo must include it in the root node.
  // but this doesn't make sense on root.  We're not doing subtrees

  private _rootFieldId!: string;
  private _fieldJson: any;
  private _action: TFsVisibilityModes = "Show"; /// fieldJson and action do not make sense on this class

  constructor(rootNodeId?: string, nodeContent?: AbstractLogicNode) {
    super(rootNodeId, nodeContent);
  }

  public clone(): FsLogicTreeDeepInternal {
    return FsLogicTreeDeepInternal.fromPojo2(this.toPojoAt());
  }

  private _toJsMatcherExpressionAt(formModel: FsFormModel, nodeId: string) {
    const nodeContent = this.getChildContentAt(nodeId);
    if (nodeContent instanceof FsLogicLeafNode) {
      formModel.getEvaluator(nodeContent.fieldId);
    } else if (this.isBranch(nodeId)) {
    }
  }

  toJsMatcherExpression(formModel: FsFormModel) {}

  public appendChildNodeWithContent(
    parentNodeId: string,
    nodeContent: AbstractLogicNode
  ): string {
    const fieldId = this.extractFieldIdFromNodeContentOrThrow(nodeContent);

    this.appendFieldIdNode(fieldId, nodeContent);

    if (!this.isNodeIdExist(parentNodeId)) {
      throw new Error(
        `parentNodeId does not exists. parentNodeId: '${parentNodeId}'.`
      );
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

  get fieldJson() {
    return this._fieldJson;
  }

  // createSubtreeAt(nodeId: string): IExpressionTree<AbstractLogicNode> {
  //   // *tmc* needs to make this a real thing, I guess: or add it to the abstract?
  //   return new FsLogicTreeDeepInternal();
  // }

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

  getChildContentByFieldId<T = AbstractLogicNode>(fieldId: string) {
    return this.#dependantFieldIdMap[fieldId] as T;
  }

  getCircularLogicNodes(): FsCircularDependencyNode[] {
    return this.findAllNodesOfType<FsCircularDependencyNode>(
      FsCircularDependencyNode
    );
  }

  getCircularMutuallyExclusiveLogicNodes(): FsCircularDependencyNode[] {
    return this.findAllNodesOfType<FsCircularMutualExclusiveNode>(
      FsCircularMutualExclusiveNode
    );
  }

  getCircularMutuallyInclusiveLogicNodes(): FsCircularDependencyNode[] {
    return this.findAllNodesOfType<FsCircularMutualInclusiveNode>(
      FsCircularMutualInclusiveNode
    );
  }

  getDependantFieldIds(): string[] {
    // this can be calculated also doing something like (tree.getTreeContent().filter...).
    // This method guarantees order, filtering nodes does not guarantee order but is a
    //  better source of truth
    return this.dependantFieldIds;
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

  getLogicErrorNodes(): FsLogicErrorNode[] {
    return this.findAllNodesOfType<FsLogicErrorNode>(FsLogicErrorNode);
  }

  getAllLeafContents(): FsLogicLeafNode[] {
    return this.getTreeContentAt().filter(
      (nodeContent) => nodeContent instanceof FsLogicLeafNode
    ) as FsLogicLeafNode[];
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

  get rootFieldId() {
    return this._rootFieldId;
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
    // transformer?: (<T>(nodeContent: T) => TNodePojo<T>) | undefined): TTreePojo<AbstractLogicNode>
    const transformer = (nodeContent: AbstractLogicNode) => {
      if (nodeContent instanceof AbstractLogicNode) {
        return nodeContent.toPojo();
      }

      if (nodeContent === null) {
        return null;
      }

      if ("toPojo" in nodeContent) {
        // this probably isn't necessary
        //@ts-ignore -'toPojo' not on type 'never' ??
        return nodeContent.toPojo();
      }

      return nodeContent;
    };

    // @ts-ignore - transform signature not correct
    const clearPojo = super.toPojoAt(nodeId, transformer);
    if (shouldObfuscate) {
      return AbstractTree.obfuscatePojo(clearPojo);
    }
    return clearPojo;
  }

  // static fromPojo<P extends object, Q>(srcPojoTree: TTreePojo<P>, transform?: ((nodeContent: TNodePojo<P>) => TGenericNodeContent<P>) | undefined): IDirectedGraph<P> {
  static fromPojo2(
    srcPojoTree: TTreePojo<AbstractLogicNode>
    // transform?:
    //   | ((nodeContent: TNodePojo<AbstractLogicNode>) => TGenericNodeContent<AbstractLogicNode>)
    //   | undefined
  ): FsLogicTreeDeepInternal {
    const rootIdCandidate = parseUniquePojoRootKeyOrThrow(srcPojoTree);

    const dGraph = AbstractDirectedGraph.fromPojo<
      AbstractLogicNode,
      FsLogicTreeDeepInternal
    >(srcPojoTree, transformFsLogicTreeFromPojo) as FsLogicTreeDeepInternal;

    const tree = new FsLogicTreeDeepInternal(rootIdCandidate);
    tree._nodeDictionary = dGraph._nodeDictionary;
    tree._rootNodeId = dGraph._rootNodeId;
    const rootNodeContent = dGraph.getChildContentAt(
      dGraph.rootNodeId
    ) as FsVirtualRootNode;
    tree._rootFieldId = rootNodeContent.fieldId;
    tree._rootNodeId = dGraph.rootNodeId;
    tree.getDescendantContentOf(tree.rootNodeId).forEach((nodeContent) => {
      if (nodeContent instanceof FsLogicBranchNode) {
        tree.#dependantFieldIdMap[nodeContent.ownerFieldId] = nodeContent;
      } else if (nodeContent instanceof FsLogicLeafNode) {
        tree.#dependantFieldIdMap[nodeContent.fieldId] = nodeContent;
      }
    });
    // return this.#dependantFieldIdMap[fieldId] as T;

    // dependantFieldInOrder is not set here.  I think it doesn't belong on this class.  Dependant fieldIds really a leaf thing, I think
    tree._incrementor = dGraph._incrementor;
    return tree;
  }

  static fromFieldJson(fieldJson: TFsFieldAny): FsLogicTreeDeepInternal {
    // we should be receiving fieldJson.logic, but the Abstract._fieldJson is not typed properly
    // const logicJson: TFsLogicNodeJson = fieldJson.logic;
    // or maybe always get the whole json?

    const logicJson: TFsFieldLogicJunction<TFsJunctionOperators> =
      // @ts-ignore - what is this supposed to be ?
      fieldJson.logic as TFsFieldLogicJunction<TFsJunctionOperators>;

    const { action, conditional, checks } = logicJson;

    const rootNode = new FsLogicBranchNode(
      `${fieldJson.id}`,
      conditional,
      action,
      checks as TFsFieldLogicCheckLeaf[],
      logicJson
    );

    const tree = new FsLogicTreeDeepInternal(fieldJson.id, rootNode);
    tree._action = action || null;
    tree._fieldJson = logicJson;

    tree._rootFieldId = fieldJson.id;

    const { leafExpressions } = transformLogicLeafJsonToLogicLeafs(
      tree.fieldJson as TFsFieldLogicJunctionJson
    );

    // @ts-ignore
    leafExpressions.forEach((childNode: TFsLogicNode) => {
      const { condition, fieldId, option } = childNode as FsLogicLeafNode;
      const leafNode = new FsLogicLeafNode(fieldId, condition, option);
      tree.appendChildNodeWithContent(tree.rootNodeId, leafNode);
      // should this be done at a different level. I mean calculated?
    });

    return tree;
  }
}

export { FsLogicTreeDeepInternal };

const transformLogicLeafJsonToLogicLeafs = (
  logicJson: TFsFieldLogicJunctionJson
) => {
  const { action, conditional, checks } = logicJson || {};
  const op = conditional === "all" ? "$and" : "$or";
  // this doesn't look right, we're not use "op", "action", "conditional" ?
  const leafExpressions = (checks || []).map((check) => {
    const { condition, fieldId, option } = check;
    return {
      fieldId: fieldId + "" || "__MISSING_ID__",
      fieldJson: check,
      condition: check.condition,
      option,
    };
  });
  return { leafExpressions };
};

const parseUniquePojoRootKeyOrThrow = <T>(pojoDocument: TTreePojo<T>) => {
  const candidateRootIds = parseCandidateRootNodeId(pojoDocument);

  if (candidateRootIds.length !== 1) {
    throw new Error(
      `No distinct root found. There must exist on and only one nodeId === {parentId}. Found ${candidateRootIds.length}.`
    );
  }

  return candidateRootIds[0];
};

const parseCandidateRootNodeId = <T>(treeObject: TTreePojo<T>): string[] => {
  const candidateRootIds: string[] = [];
  Object.entries(treeObject).forEach(([key, node]) => {
    if (key === node.parentId) {
      candidateRootIds.push(key);
    }
  });
  return candidateRootIds;
};

const transformFsLogicTreeFromPojo = (
  nodePojo: TNodePojo<AbstractLogicNode>
): AbstractLogicNode => {
  const { nodeContent } = nodePojo;
  switch (nodeContent.nodeType) {
    case "FsVirtualRootNode":
      // @ts-ignore - 'fieldId' does not exist on type TNodePojo
      return new FsVirtualRootNode(nodeContent.fieldId);
    case "FsLogicBranchNode":
      return FsLogicBranchNode.fromPojo(nodePojo);
    case "FsLogicLeafNode":
      return FsLogicLeafNode.fromPojo(nodePojo);
    case "FsLogicLeafNode":
      return FsLogicLeafNode.fromPojo(nodePojo);
    case "FsCircularDependencyNode":
      return FsCircularDependencyNode.fromPojo(nodePojo);
    case "FsCircularMutualExclusiveNode":
      return FsCircularMutualExclusiveNode.fromPojo(nodePojo);
    case "FsCircularMutualInclusiveNode":
      return FsCircularMutualInclusiveNode.fromPojo(nodePojo);

    default:
      // @ts-ignore - missing properties
      return nodeContent;
  }
};
