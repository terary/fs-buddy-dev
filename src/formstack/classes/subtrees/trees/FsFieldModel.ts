import {
  AbstractExpressionTree,
  IExpressionTree,
  ITree,
} from "predicate-tree-advanced-poc/dist/src";
import { TFsFieldAnyJson, TFsNode } from "../../types";
import { FsTreeCalcString } from "./FsTreeCalcString";
import { FsFieldLogicModel } from "./FsFieldLogicModel";
import { FsFieldVisibilityLinkNode } from "./nodes/FsFieldVisibilityLinkNode";
import { AbstractFsTreeGeneric } from "./AbstractFsTreeGeneric";
import {
  TFsFieldLogicJunction,
  TFsJunctionOperators,
  TFsVisibilityModes,
} from "../types";
import { MultipleLogicTreeError } from "../../../errors/MultipleLogicTreeError";
import { FsCircularDependencyNode } from "./FsLogicTreeDeep";
import { AbstractNode } from "./nodes/AbstractNode";
import {
  TFsFieldAny,
  TFsFieldCheckbox,
  TFsFieldRadio,
  TFsFieldSection,
  TFsFieldSelect,
} from "../../../type.field";
// import { InvalidEvaluation } from "../../InvalidEvaluation";
import { Evaluator } from "../../Evaluator";

type TSelectFields = TFsFieldRadio | TFsFieldSelect | TFsFieldCheckbox;

type TSubtrees = FsTreeCalcString | FsFieldLogicModel;

type TFsFieldTreeNodeTypes =
  | FsTreeCalcString
  | FsFieldLogicModel
  | FsFieldVisibilityLinkNode
  | FsCircularDependencyNode;

class FsFieldModel extends AbstractFsTreeGeneric<TFsFieldTreeNodeTypes> {
  private _fieldId!: string;
  private _dependantFieldIds: string[] = [];

  // ---
  createSubtreeAt(
    targetNodeId: string
  ): IExpressionTree<TFsFieldTreeNodeTypes> {
    const subtree = new FsFieldModel("_subtree_");

    const subtreeParentNodeId = this.appendChildNodeWithContent(
      targetNodeId,
      subtree
    );

    AbstractExpressionTree.reRootTreeAt<TFsFieldTreeNodeTypes>(
      subtree,
      subtree.rootNodeId,
      subtreeParentNodeId
    );
    subtree._rootNodeId = subtreeParentNodeId;
    subtree._incrementor = this._incrementor;

    return subtree; // as IExpressionTree<TFsFieldTreeNodeTypes>;
  }

  get fieldJson(): TFsFieldAny {
    return this._fieldJson as TFsFieldAny;
  }

  get fieldId() {
    return this._fieldId;
  }

  get fieldType() {
    return (this._fieldJson as TFsFieldAny)["type"];
  }

  get section_heading() {
    return (this._fieldJson as TFsFieldSection)["section_heading"];
  }

  get label() {
    return this.fieldJson["label"];
  }

  private getNodesOfType<T extends AbstractFsTreeGeneric<any> | AbstractNode>(
    objectType: any
  ): T[] | null {
    const nodeIds = this.getTreeNodeIdsAt(this.rootNodeId);
    return nodeIds
      .filter(
        (subtreeId: any) =>
          this.getChildContentAt(subtreeId) instanceof objectType
      )
      .map((subtreeId) => this.getChildContentAt(subtreeId)) as T[];
  }

  private getSingleTreeOfType<
    T extends AbstractFsTreeGeneric<any> | AbstractNode
  >(objectType: any): T | null {
    const subtreeIds = this.getSubtreeIdsAt(this.rootNodeId);
    const logicTrees = subtreeIds
      .filter(
        (subtreeId: any) =>
          this.getChildContentAt(subtreeId) instanceof objectType
      )
      .map((subtreeId) =>
        this.getChildContentAt(subtreeId)
      ) as FsFieldLogicModel[];

    if (logicTrees.length > 1) {
      throw new MultipleLogicTreeError(
        `field with id: '${this.fieldId}' appears to have multiple logic tree(s) or multiple calc tree(s).`
      );
    }

    return (logicTrees.pop() as unknown as T) || null;
  }

  public getVisibilityLogicTree() {
    const visNode = this.getVisibilityNode();
    const visualLogicTree = visNode?.parentNode?.getLogicTree() || null;
    return visualLogicTree;
  }

  public getLogicTree(): FsFieldLogicModel | null {
    const simpleLogicTree =
      this.getSingleTreeOfType<FsFieldLogicModel>(FsFieldLogicModel);
    if (simpleLogicTree === null) {
      return null;
    }
    const rootNodeContent = simpleLogicTree?.getChildContentAt(
      simpleLogicTree.rootNodeId
    ) as TFsFieldLogicJunction<TFsJunctionOperators>;
    const { action } = rootNodeContent;

    // if (["hide", "Hide"].includes(action || "")) {
    //   return simpleLogicTree.getNegatedClone();
    // }

    return simpleLogicTree;
  }

  public x_getLogicTree(): FsFieldLogicModel | null {
    const simpleLogicTree =
      this.getSingleTreeOfType<FsFieldLogicModel>(FsFieldLogicModel);
    const visualLogicTree = this.getVisibilityLogicTree();

    let newTree: FsFieldLogicModel;
    if (visualLogicTree) {
      const visibilityFieldId = this.getVisibilityNode()?.parentNode?.fieldId;

      // the result tree doe not look correct. It appears there is root -> uknonwn node -> visualLogic
      // also this uses 'defaultJunction'  which works but dont have values for fieldJson etc
      // meaning this is calling a junction once after we create the tree - hence two junctions when we one only 1

      // @ts-ignore - conditional all is not a leaf
      newTree = new FsFieldLogicModel(this.fieldId, {
        conditional: "all",
        fieldJson: {}, //
        fieldId: visibilityFieldId || "_MISSING_FIELD_ID_",
      });
      newTree.appendTreeAt(newTree.rootNodeId, visualLogicTree);
      simpleLogicTree &&
        newTree.appendTreeAt(newTree.rootNodeId, simpleLogicTree);
      //  .appendTree(...)   "appears" to work, but the nodeId look like 'root:0:0:appendTree:3'
      return newTree;
    }
    return simpleLogicTree;
  }

  public getVisibilityNode(): FsFieldVisibilityLinkNode | null {
    const visibilityNodes = this.getNodesOfType<FsFieldVisibilityLinkNode>(
      FsFieldVisibilityLinkNode
    );

    if (!visibilityNodes || visibilityNodes?.length === 0) {
      return null;
    }
    if (visibilityNodes && visibilityNodes?.length > 1) {
      return null;
    }
    return visibilityNodes[0] || null;
  }

  protected getCalcStringTree(): FsTreeCalcString | null {
    return this.getSingleTreeOfType<FsTreeCalcString>(FsTreeCalcString);
  }

  evaluateShowHide(
    values: { [fieldId: string]: any } = {}

    // @ts-ignore
  ): TFsVisibilityModes {
    // multiple trees need to be considered.
    // const logicTrees = this.getLogicTrees();
    // if (logicTrees.length === 0) {
    //   return "Show"; // defaults to 'show' ?
    // }
    // if (logicTrees.length > 1) {
    //   return null; // this is an error condition. For FS set-up, we expect 1 and only 1 logic tree
    // }
    // const logicTree = logicTrees.pop();
    // if (logicTree === undefined) {
    //   // the guard above does the same thing.  This is here to appease the compiler
    //   return null;
    // }
    // return logicTree.evaluateWithValues<boolean>(values)
    //   ? logicTree.action
    //   : null;
  }

  evaluateWithValues<T>(values: { [fieldId: string]: any }): {
    [fieldId: string]: T; // | InvalidEvaluation; // this null should be instance of class 'InvalidEvaluation' (broken field)
  } {
    if (this.getLogicTree() === null) {
      const evaluator = Evaluator.getEvaluatorWithFieldJson(
        this.fieldJson as TFsFieldAny
      );
      return {
        [this.fieldId]: evaluator.evaluateWithValues<T>(
          values[this.fieldId]
        ) as T,
      };
    }
    return values[this.fieldId];
  }

  getSubmissionEvaluator() {
    return Evaluator.getEvaluatorWithFieldJson(this.fieldJson as TFsFieldAny);
  }

  getInterdependentFieldIdsOf(subjectField: FsFieldModel): string[] {
    const thisLogic = this.getLogicTree();
    return [];
  }

  isLeaf(): boolean {
    // I think this should also include linkNode
    return this.getLogicTree() === null;
  }

  isInterdependentOf(subjectField: FsFieldModel) {
    return this.getInterdependentFieldIdsOf(subjectField).length > 0;
  }

  getDependantFieldIds(): string[] {
    const logicDep = this.getLogicTree()?.getDependantFieldIds() || [];
    const calcDep = this.getCalcStringTree()?.getDependantFieldIds() || [];
    return logicDep.concat(calcDep);
  }

  static fromFieldJson(fieldJson: TFsFieldAny): FsFieldModel {
    // I think there is issues with using fieldId and the way subtree get rooted and re-rooted
    // such that fieldId is not a good rootNodeSeed

    const field = new FsFieldModel(`_FIELD_ID_: ${fieldJson.id}`, {
      // @ts-ignore
      fieldId: fieldJson.id,
      label: fieldJson.label,
      fieldJson: fieldJson as TFsFieldAny,
    });

    field._fieldId = fieldJson.id;
    field._fieldJson = fieldJson;

    if (fieldJson.calculation) {
      const subtreeConstructor = (fieldJson: TFsFieldAny) =>
        FsTreeCalcString.fromFieldJson(fieldJson as unknown as TFsFieldAnyJson);

      FsFieldModel.createSubtreeFromFieldJson(
        field,
        field.rootNodeId,
        fieldJson,
        subtreeConstructor
      );
    }

    if (fieldJson.logic) {
      // const subtreeConstructor = (fieldJson: TFsFieldAny) =>
      //   FsFieldLogicModel.fromFieldJson(fieldJson as unknown as TFsFieldAnyJson);
      const subtreeConstructor = (
        fieldJson: TFsFieldAny
      ): FsFieldLogicModel => {
        return FsFieldLogicModel.fromFieldJson(
          fieldJson as unknown as TFsFieldAnyJson
        );
      };

      FsFieldModel.createSubtreeFromFieldJson(
        field,
        field.rootNodeId,
        fieldJson,
        subtreeConstructor
      );
    }
    return field;
  }

  static createSubtreeFromFieldJson<T>(
    rootTree: FsFieldModel,
    targetRootId: string,
    fieldJson: TFsFieldAny,
    subtreeConstructor?:
      | ((fieldJson: TFsFieldAny) => TFsFieldTreeNodeTypes)
      | undefined
  ): T {
    const subtree = subtreeConstructor
      ? subtreeConstructor(fieldJson)
      : new FsFieldModel(targetRootId);

    const parentTreeIncrementorAdjustment = (
      subtree as FsFieldModel
    ).countTotalNodes();
    /// --------------------
    // const subtree = new FsFormModel("_subtree_");

    const subtreeParentNodeId = rootTree.appendChildNodeWithContent(
      targetRootId,
      subtree
    );

    AbstractExpressionTree.reRootTreeAt<TSubtrees>(
      subtree as AbstractExpressionTree<TSubtrees>,
      (subtree as AbstractExpressionTree<TSubtrees>).rootNodeId,
      subtreeParentNodeId
    );
    (subtree as FsFieldModel)._rootNodeId = subtreeParentNodeId;
    (subtree as FsFieldModel)._incrementor = (
      rootTree as unknown as FsFieldModel
    )._incrementor;

    for (let i = 0; i < parentTreeIncrementorAdjustment; i++) {
      (subtree as FsFieldModel)._incrementor.next;
    }

    return subtree as T;
  }
}
export { FsFieldModel };
