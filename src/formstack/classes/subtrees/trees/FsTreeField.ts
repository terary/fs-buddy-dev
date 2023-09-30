import {
  AbstractExpressionTree,
  IExpressionTree,
} from "predicate-tree-advanced-poc/dist/src";
import { TFsFieldAnyJson, TFsNode } from "../../types";
import { FsTreeCalcString } from "./FsTreeCalcString";
import { FsTreeLogic } from "./FsTreeLogic";
import { FsFieldVisibilityLinkNode } from "./nodes/FsFieldVisibilityLinkNode";
import { AbstractFsTreeGeneric } from "./AbstractFsTreeGeneric";
import { TFsVisibilityModes } from "../types";
import { MultipleLogicTreeError } from "../../../errors/MultipleLogicTreeError";
import { FsCircularDependencyNode } from "./nodes/FsCircularDependencyNode";
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

type TSubtrees = FsTreeCalcString | FsTreeLogic;

type TFsFieldTreeNodeTypes =
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
      .map((subtreeId) => this.getChildContentAt(subtreeId)) as FsTreeLogic[];

    if (logicTrees.length > 1) {
      throw new MultipleLogicTreeError(
        `field with id: '${this.fieldId}' appears to have multiple logic tree(s) or multiple calc tree(s).`
      );
    }

    return (logicTrees.pop() as unknown as T) || null;
  }

  public getLogicTree(): FsTreeLogic | null {
    return this.getSingleTreeOfType<FsTreeLogic>(FsTreeLogic);
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
    return visibilityNodes.pop() || null;
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

  private x_evaluateMultiSelect<T>(values: { [fieldId: string]: any }): {
    [fieldId: string]: T; // | InvalidEvaluation;
  } {
    const options = (this.fieldJson as TSelectFields).options || [];
    const selectedOption = options.find(
      (option) => option.value === values[this.fieldId]
    );

    // if (selectedOption === undefined) {
    //   return {
    //     [this.fieldId]: new InvalidEvaluation("Selected option not found.", {
    //       options,
    //       searchValue: values[this.fieldId],
    //     }),
    //   };
    // } else {
    //   return { [this.fieldId]: selectedOption.value as T };
    // }
    return { [this.fieldId]: (selectedOption || {}).value as T };
  }

  private x_evaluateByFieldType<T>(values: { [fieldId: string]: any }): {
    [fieldId: string]: T; //| InvalidEvaluation;
  } {
    const evaluator = Evaluator.getEvaluatorWithFieldJson(
      this.fieldJson as TFsFieldAny
    );
    return {
      [this.fieldId]: evaluator.evaluateWithValues<T>(
        values[this.fieldId]
      ) as T,
    };
  }

  private getVisibilityLogicChain() {}

  getInterdependentFieldIdsOf(subjectField: FsTreeField): string[] {
    const thisLogic = this.getLogicTree();
    return [];
  }

  isLeaf(): boolean {
    // I think this should also include linkNode
    return this.getLogicTree() === null;
  }
  isInterdependentOf(subjectField: FsTreeField) {
    return this.getInterdependentFieldIdsOf(subjectField).length > 0;
  }

  getDependantFieldIds(): string[] {
    const logicDep = this.getLogicTree()?.getDependantFieldIds() || [];
    const calcDep = this.getCalcStringTree()?.getDependantFieldIds() || [];
    return logicDep.concat(calcDep);
  }

  static fromFieldJson(fieldJson: TFsFieldAny): FsTreeField {
    const field = new FsTreeField("_FIELD_ID_", {
      // @ts-ignore
      fieldId: fieldJson.id,
      label: fieldJson.label,
      fieldJson: fieldJson as TFsFieldAny,
    });

    field._fieldId = fieldJson.id || "_MISSING_ID_";
    field._fieldJson = fieldJson as TFsFieldAny;

    if (fieldJson.calculation) {
      const subtreeConstructor = (fieldJson: TFsFieldAny) =>
        FsTreeCalcString.fromFieldJson(fieldJson as unknown as TFsFieldAnyJson);

      FsTreeField.createSubtreeFromFieldJson(
        field,
        field.rootNodeId,
        fieldJson,
        subtreeConstructor
      );
    }

    if (fieldJson.logic) {
      const subtreeConstructor = (fieldJson: TFsFieldAny) =>
        FsTreeLogic.fromFieldJson(fieldJson as unknown as TFsFieldAnyJson);

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
    targetRootId: string,
    fieldJson: TFsFieldAny,
    subtreeConstructor?:
      | ((fieldJson: TFsFieldAny) => TFsFieldTreeNodeTypes)
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
