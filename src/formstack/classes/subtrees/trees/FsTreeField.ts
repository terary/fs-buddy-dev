import {
  AbstractExpressionTree,
  IExpressionTree,
} from "predicate-tree-advanced-poc/dist/src";
import { TFsFieldAnyJson, TFsNode } from "../../types";
import { FsTreeCalcString } from "./FsTreeCalcString";
import { FsTreeLogic } from "./FsTreeLogic";
import { FsFieldRootNode } from "./nodes/FsFieldRootNode";
import { FsFieldVisibilityLinkNode } from "./nodes/FsFieldVisibilityLinkNode";
import { AbstractFsTreeGeneric } from "./AbstractFsTreeGeneric";
import { TFsVisibilityModes } from "../types";
import { MultipleLogicTreeError } from "../../../errors/MultipleLogicTreeError";
import { FsCircularDependencyNode } from "./nodes/FsCircularDependencyNode";
type TSubtrees = FsTreeCalcString | FsTreeLogic;

type TFsFieldTreeNodeTypes =
  | FsFieldRootNode
  | FsTreeCalcString
  | FsTreeLogic
  | FsFieldVisibilityLinkNode
  | FsCircularDependencyNode;

class FsTreeField extends AbstractFsTreeGeneric<TFsFieldTreeNodeTypes> {
  private _fieldId!: string;
  private _dependantFieldIds: string[] = [];

  // ---
  createSubtreeAt(
    targetNodeId: string
  ): IExpressionTree<TFsFieldTreeNodeTypes> {
    const subtree = new FsTreeField("_subtree_");

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

  get fieldJson() {
    return this._fieldJson;
  }

  get fieldId() {
    return this._fieldId;
  }

  private getSingleTreeOfType<T extends AbstractFsTreeGeneric<any>>(
    objectType: any
  ): T | null {
    const subtreeIds = this.getSubtreeIdsAt(this.rootNodeId);
    const logicTrees = subtreeIds
      .filter(
        (subtreeId: any) =>
          this.getChildContentAt(subtreeId) instanceof objectType
      )
      .map((subtreeId) => this.getChildContentAt(subtreeId)) as FsTreeLogic[];

    if (logicTrees.length > 1) {
      throw new MultipleLogicTreeError(
        `field with id: '${this.fieldId}' appears to have multiple logic tree(s) or multiple calc tree(s).`
      );
    }

    return (logicTrees.pop() as unknown as T) || null;
  }

  private getSingleNodeOfType<T>(objectType: any): T | null {
    const nodeIds = this.getChildrenNodeIdsOf(this.rootNodeId);
    const matchingNodes = nodeIds
      .filter(
        (nodeId: any) => this.getChildContentAt(nodeId) instanceof objectType
      )
      .map((subtreeId) => this.getChildContentAt(subtreeId)) as FsTreeField[];

    if (matchingNodes.length > 1) {
      throw new MultipleLogicTreeError(
        `field with id: '${this.fieldId}' appears to have multiple nodes of type '${objectType}'.`
      );
    }

    return (matchingNodes.pop() as unknown as T) || null;
  }

  public getLogicTree(): FsTreeLogic | null {
    return this.getSingleTreeOfType<FsTreeLogic>(FsTreeLogic);
  }

  public getVisibilityNode(): FsFieldVisibilityLinkNode | null {
    return this.getSingleNodeOfType<FsFieldVisibilityLinkNode>(
      FsFieldVisibilityLinkNode
    );
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

  evaluateWithValues<T>(values: { [fieldId: string]: any }): T {
    // maybe in real life this would do a little more formatting.
    // also what about dependant factors? (isHidden)
    return values[this.fieldId];
  }

  private getVisibilityLogicChain() {}

  getInterdependentFieldIdsOf(subjectField: FsTreeField): string[] {
    // 148509470
    if (this.fieldId === "148509470") {
      console.log("found it");
    }
    const thisLogic = this.getLogicTree();
    return [];
    // - get all of my dependent
    // - get all of my viewLink's dependents (this could create circular reference)
    // const foreignDependentFieldIds = subjectField.getDependantFieldIds();
    // const thisDependentFieldIds = [
    //   this.fieldId,
    //   ...this.getDependantFieldIds(),
    // ];
    // const interDependentFieldIds = thisDependentFieldIds.filter((fieldId) =>
    //   foreignDependentFieldIds.includes(fieldId)
    // );
    // return interDependentFieldIds;
  }

  isInterdependentOf(subjectField: FsTreeField) {
    return this.getInterdependentFieldIdsOf(subjectField).length > 0;
  }

  getDependantFieldIds(): string[] {
    const logicDep = this.getLogicTree()?.getDependantFieldIds() || [];
    const calcDep = this.getCalcStringTree()?.getDependantFieldIds() || [];
    return logicDep.concat(calcDep);
  }

  static fromFieldJson(fieldJson: TFsFieldAnyJson): FsTreeField {
    const field = new FsTreeField("_FIELD_ID_", {
      filedId: fieldJson.id,
      label: fieldJson.label,
      fieldJson: fieldJson,
    });

    field._fieldId = fieldJson.id || "_MISSING_ID_";
    field._fieldJson = fieldJson;

    if (fieldJson.calculation) {
      const subtreeConstructor = (fieldJson: TFsFieldAnyJson) =>
        FsTreeCalcString.fromFieldJson(fieldJson);

      FsTreeField.createSubtreeFromFieldJson(
        field,
        field.rootNodeId,
        fieldJson,
        subtreeConstructor
      );
    }

    if (fieldJson.logic) {
      const subtreeConstructor = (fieldJson: TFsFieldAnyJson) =>
        FsTreeLogic.fromFieldJson(fieldJson);

      FsTreeField.createSubtreeFromFieldJson(
        field,
        field.rootNodeId,
        fieldJson,
        subtreeConstructor
      );
    }
    return field;
  }

  static createSubtreeFromFieldJson<T>(
    rootTree: FsTreeField,

    // rootTree: FsTreeFieldCollection,

    targetRootId: string,
    fieldJson: TFsFieldAnyJson,
    subtreeConstructor?:
      | ((fieldJson: TFsFieldAnyJson) => TFsFieldTreeNodeTypes)
      | undefined
  ): T {
    const subtree = subtreeConstructor
      ? subtreeConstructor(fieldJson)
      : new FsTreeField(targetRootId);

    /// --------------------
    // const subtree = new FsTreeFieldCollection("_subtree_");

    const subtreeParentNodeId = rootTree.appendChildNodeWithContent(
      targetRootId,
      subtree
    );

    AbstractExpressionTree.reRootTreeAt<TSubtrees>(
      subtree as AbstractExpressionTree<TSubtrees>,
      (subtree as AbstractExpressionTree<TSubtrees>).rootNodeId,
      subtreeParentNodeId
    );
    (subtree as FsTreeField)._rootNodeId = subtreeParentNodeId;
    (subtree as FsTreeField)._incrementor = (
      rootTree as unknown as FsTreeField
    )._incrementor; // 'unknown' should get fix with proper typing

    return subtree as T;
  }
}
export { FsTreeField };
