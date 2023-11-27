import {
  AbstractDirectedGraph,
  AbstractExpressionTree,
  AbstractTree,
  IExpressionTree,
  ITree,
  TGenericNodeContent,
  TNodePojo,
  TTreePojo,
} from "predicate-tree-advanced-poc/dist/src";
import { TFsFieldAnyJson } from "../../types";
import type {
  TFsFieldLogicCheckLeaf,
  TFsFieldLogicCheckLeafJson,
  TFsFieldLogicJunction,
  TFsFieldLogicJunctionJson,
  TFsFieldLogicNode,
  TFsLogicNodeJson,
  TFsVisibilityModes,
  TFsJunctionOperators,
} from "../types";
import { AbstractFsFieldLogicModel } from "./AbstractFsFieldLogicModel";
import { transformers } from "../../../transformers";
import { NegateVisitor } from "./NegateVisitor";
const andReducer = (prev: boolean | null, cur: boolean | null) => {
  return prev && cur;
};

const orReducer = (prev: boolean | null, cur: boolean | null) => {
  return prev || cur;
};

class FsFieldLogicModel extends AbstractFsFieldLogicModel<TFsFieldLogicNode> {
  public _debug_visitedFieldIds: string[] = []; // this maybe better as getChildren(filter)

  createSubtreeAt(nodeId: string): IExpressionTree<TFsFieldLogicNode> {
    // *tmc* needs to make this a real thing, I guess: or add it to the abstract?
    return new FsFieldLogicModel();
  }

  protected defaultJunction(nodeId: string): TFsFieldLogicNode {
    // @ts-ignore - doesn't match shape of proper junction (no fieldJson or fieldId).  But this is
    // only used for creating 'virtual' trees with field and panel logic, hence no nodeContent or then 'all'
    return { conditional: "all", fieldJson: {} };
  }

  getDependantFieldIds() {
    return this.getShallowDependantFieldIds();
  }

  getChildContentAtOrThrow<
    T extends
      | TFsFieldLogicJunction<TFsJunctionOperators>
      | TFsFieldLogicCheckLeaf
  >(nodeId: string): T {
    const childContent = this.getChildContentAt(nodeId);

    return childContent as T;
  }

  // getNegatedClone(): FsFieldLogicModel {
  //   const visitor = new NegateVisitor();
  //   const clone = this.cloneAt();
  //   clone.visitAllAt(visitor);
  //   return clone;
  // }

  getShallowDependantFieldIds(): string[] {
    const children = this.getChildrenContentOf(
      this.rootNodeId
    ) as TFsFieldLogicNode[]; // shallow = only the children
    return children.map((child) =>
      // @ts-ignore - fieldId, ownerId not on type TFsLogic...
      child.fieldId ? child.fieldId : child.ownerFieldId
    );
    return [];
  }

  evaluateWithValues<T>(values: { [fieldId: string]: any }): T | undefined {
    const parent = this.getChildContentAt(
      this.rootNodeId
    ) as unknown as TFsFieldLogicJunction<TFsJunctionOperators>;
    const { conditional } = parent;
    const children = this.getChildrenContentOf(
      this.rootNodeId
    ) as TFsFieldLogicCheckLeaf[];

    const evaluatedChildren = children.map((child) => {
      switch (child.condition) {
        case "==":
          return values[child.fieldId] === child.option;
        case "gt":
          // guard against null/undefined
          return child.option && values[child.fieldId] > child.option;
      }
    });

    if (conditional === "all") {
      // @ts-ignore - not happy about typing of 'andReducer'
      return evaluatedChildren.reduce(andReducer, true) as T;
    }
    if (conditional === "any") {
      // @ts-ignore - not happy about typing of 'orReducer'
      return evaluatedChildren.reduce(orReducer, false) as T;
    }

    // we'll return undefined if something goes wrong
  }

  evaluateShowHide(values: { [fieldId: string]: any }): TFsVisibilityModes {
    return this.evaluateWithValues<boolean>(values) ? this.action : null;
  }

  private x_demote_and_negate() {
    const { action } = this;
    // @ts-ignore - TFsVisibilityMode should be upcase, does transformer need fixed? or datatype?
    if (action === "hide") {
      // This works - but it should be in visibilityNode
      // or ... make 'negateTree' a method of LogicTree ?

      // subtree incrementor is not working correctly.
      // I think it fails to update new nodes count so the count is off and
      // nodes get overwritten (or just needs to iternate same number of subtree iterator)
      // this should be "Hide", dev/debug
      const previousRootNodeContent = this.getChildContentAt(this.rootNodeId);
      const previousChildrenNodeIds = this.getChildrenNodeIdsOf(
        this.rootNodeId
      );

      this.replaceNodeContent(this.rootNodeId, {
        // @ts-ignore
        virtualBranch: "something",
        junctionOperator: "$not",
      });

      const newBranchNodeId = this.appendChildNodeWithContent(
        this.rootNodeId,
        previousRootNodeContent
      );
      previousChildrenNodeIds.forEach((childId) => {
        this.move(childId, newBranchNodeId);
      });
    }
    console.log({ logicTree: this });

    return this;
  }
  static x_fromPojo<P extends object, Q>(
    srcPojoTree: TTreePojo<TFsFieldLogicNode>,
    transform?:
      | ((nodeContent: TNodePojo<P>) => TGenericNodeContent<P>)
      | undefined
  ): IExpressionTree<TFsFieldLogicNode> {
    return super.fromPojo(srcPojoTree);
  }

  static fromPojo<FsFieldLogicModel, TFsFieldLogicNode>(
    srcPojoTree: TTreePojo<TFsFieldLogicNode>,
    transform?:
      | ((
          nodeContent: TNodePojo<TFsFieldLogicNode>
        ) => TGenericNodeContent<object>)
      | undefined
  ): FsFieldLogicModel;
  static fromPojo<P extends object, Q>(
    srcPojoTree: TTreePojo<P>,
    transform?:
      | ((nodeContent: TNodePojo<P>) => TGenericNodeContent<P>)
      | undefined
  ): IExpressionTree<P>;
  static fromPojo<P extends object, Q>(
    srcPojoTree: TTreePojo<P>,
    transform?:
      | ((nodeContent: TNodePojo<P>) => TGenericNodeContent<P>)
      | undefined
  ): IExpressionTree<TFsLogicNodeJson> {
    const rootFieldId = parseUniquePojoRootKeyOrThrow(srcPojoTree);

    const genericTree = AbstractDirectedGraph.fromPojo(
      srcPojoTree as TTreePojo<TFsFieldLogicNode>,
      transformers.TFsFieldLogicNode.fromPojo
    );
    // const genericTree = AbstractExpressionTree.fromPojo(
    //   srcPojoTree as TTreePojo<TFsFieldLogicNode>,
    //   transformers.TFsFieldLogicNode.fromPojo
    // );

    if (!genericTree) {
      throw new Error("No Generic Tree");
    }
    const fsTree = new FsFieldLogicModel(
      rootFieldId,
      // genericTree.rootNodeId,
      genericTree.getChildContentAt(genericTree.rootNodeId) as TFsFieldLogicNode
    );

    genericTree
      .getChildrenContentOf(genericTree.rootNodeId)
      .forEach((childContent) => {
        fsTree.appendChildNodeWithContent(fsTree.rootNodeId, childContent);
      });

    return fsTree as IExpressionTree<TFsLogicNodeJson>;
  }

  toPojoAt(nodeId?: string | undefined): TTreePojo<TFsFieldLogicNode>;
  toPojoAt(
    nodeId?: string | undefined,
    shouldObfuscate?: boolean
  ): TTreePojo<TFsFieldLogicNode>;
  override toPojoAt(
    nodeId?: string | undefined,
    shouldObfuscate = true
  ): TTreePojo<TFsFieldLogicNode> {
    const clearPojo = super.toPojoAt(
      this.rootNodeId,
      // @ts-ignore -- T is not compatible with TFsFieldLogicNode
      transformers.TFsFieldLogicNode.toPojo
    );
    if (shouldObfuscate) {
      return AbstractTree.obfuscatePojo(clearPojo);
    }
    return clearPojo;
  }

  override cloneAt(nodeId?: string | undefined): FsFieldLogicModel {
    const pojo = this.toPojoAt(undefined, false);
    return FsFieldLogicModel.fromPojo(pojo) as FsFieldLogicModel;
  }

  static fromFieldJson(fieldJson: TFsFieldAnyJson): FsFieldLogicModel {
    // we should be receiving fieldJson.logic, but the Abstract._fieldJson is not typed properly
    // const logicJson: TFsFieldLogicNodeJson = fieldJson.logic;
    // or maybe always get the whole json?

    const logicJson: TFsLogicNodeJson =
      fieldJson.logic as TFsFieldLogicJunctionJson;
    const { action, conditional, checks } = logicJson;
    const rootNode = {
      fieldId: fieldJson.id || "__MISSING_ID__",
      conditional,
      action: action || "Show", // *tmc* shouldn't be implementing business logic here
      logicJson,
      checks,
    };

    const tree = new FsFieldLogicModel(
      fieldJson.id || "_calc_tree_",
      // @ts-ignore - there is a little confuse about a tree node and a logic node
      rootNode as TFsFieldLogicNode
    );
    tree._action = action || null;
    tree._fieldJson = logicJson;
    tree._ownerFieldId = fieldJson.id || "_calc_tree_";

    const { leafExpressions } = transformLogicLeafJsonToLogicLeafs(
      tree.fieldJson as TFsFieldLogicJunctionJson
    );

    // @ts-ignore - there is a little confuse about a tree node and a logic node
    leafExpressions.forEach((childNode: TFsFieldLogicNode) => {
      // const { condition, fieldId, option } =
      //   childNode as TFsFieldLogicCheckLeaf;
      // const leafNode = { fieldId, condition, option };
      // tree.appendChildNodeWithContent(tree.rootNodeId, leafNode);
      tree.appendChildNodeWithContent(tree.rootNodeId, childNode);
    });

    return tree;
  }

  static createSubtreeFromFieldJson<T>(
    rootTree: FsFieldLogicModel,
    targetRootId: string,
    fieldJson: TFsFieldAnyJson,
    subtreeConstructor?:
      | ((
          fieldJson: TFsFieldAnyJson
        ) => AbstractExpressionTree<FsFieldLogicModel>)
      | undefined
  ): T {
    const subtree = subtreeConstructor
      ? subtreeConstructor(fieldJson)
      : new FsFieldLogicModel(targetRootId);
    const logicJson: TFsLogicNodeJson =
      fieldJson.logic as TFsFieldLogicJunctionJson;

    const { action, conditional } = logicJson;

    (subtree as FsFieldLogicModel)._action = action || null;
    (subtree as FsFieldLogicModel)._fieldJson = logicJson;

    const rootNode: TFsFieldLogicJunctionJson = {
      action,
      conditional,
      fieldJson: logicJson,
      checks: undefined, // we won't use this,  this becomes children
    };

    subtree.replaceNodeContent(
      subtree.rootNodeId,
      // @ts-ignore Junction not a node type
      rootNode as TFsFieldLogicJunction
    );

    const subtreeParentNodeId = rootTree.appendChildNodeWithContent(
      targetRootId,
      subtree as FsFieldLogicModel
    );

    AbstractExpressionTree.reRootTreeAt<FsFieldLogicModel>(
      subtree as AbstractExpressionTree<FsFieldLogicModel>,
      (subtree as AbstractExpressionTree<FsFieldLogicModel>).rootNodeId,
      subtreeParentNodeId
    );
    (subtree as FsFieldLogicModel)._rootNodeId = subtreeParentNodeId;
    (subtree as FsFieldLogicModel)._incrementor = (
      rootTree as FsFieldLogicModel
    )._incrementor;

    const { leafExpressions } = transformLogicLeafJsonToLogicLeafs(
      (subtree as FsFieldLogicModel).fieldJson as TFsFieldLogicJunctionJson
    );

    leafExpressions.forEach((childNode: any) => {
      subtree.appendChildNodeWithContent(subtree.rootNodeId, childNode);
    });

    return subtree as T;
  }
}

const transformLogicLeafJsonToLogicLeafs = (
  logicJson: TFsFieldLogicJunctionJson
) => {
  const { action, conditional, checks } = logicJson || {};
  const op = conditional === "all" ? "$and" : "$or";

  const leafExpressions = (checks || []).map((check) => {
    const { condition, field, option } =
      check as unknown as TFsFieldLogicCheckLeafJson;
    return {
      fieldId: field + "" || "__MISSING_ID__",
      fieldJson: check,
      condition: convertFsOperatorToOp(
        check as unknown as TFsFieldLogicCheckLeafJson
      ),
      option,
    };
  });
  return { leafExpressions };
};

export { FsFieldLogicModel };

const convertFsOperatorToOp = (check: TFsFieldLogicCheckLeafJson) => {
  // if (check.condition === "equals") {
  //   return "$eq";
  // }
  // if (check.condition === "greaterThan") {
  //   return "$gt";
  // }

  return check.condition;
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
