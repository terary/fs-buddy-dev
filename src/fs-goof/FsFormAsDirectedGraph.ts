import type { TFieldLogic, TFieldDependancyList } from "./types";
import { AbstractDirectedGraph } from "predicate-tree-advanced-poc/dist/src";
import type { TGenericNodeContent } from "predicate-tree-advanced-poc/dist/src";

class FsFormAsDirectedGraph extends AbstractDirectedGraph<TFieldLogic> {
  private _rootFieldId!: string;
  private _dependancyFieldIds: string[] = [];
  private _childFields: {
    [fieldId: string]: FsFormAsDirectedGraph;
  } = {};

  public getParentNodeId(nodeId: string): string {
    return super.getParentNodeId(nodeId);
  }

  getChildFields() {
    return this._childFields;
  }

  getDependencyStatuses(): TFieldDependancyList {
    const dependancyStatusList: TFieldDependancyList = {};

    Object.values(this.getChildFields()).forEach((subjectField) => {
      dependancyStatusList[subjectField.rootFieldId] = {
        interdependant: [],
        parents: [],
        children: [],
        mutuallyExclusive: [],
      };
      Object.values(this.getChildFields()).forEach((targetField) => {
        if (subjectField.rootFieldId === targetField.rootFieldId) {
          return;
        }

        if (
          subjectField.isDependancyOf(targetField) &&
          targetField.isDependancyOf(subjectField)
        ) {
          dependancyStatusList[subjectField.rootFieldId].interdependant.push(
            targetField.rootFieldId
          );
        }
        if (subjectField.isDependancyOf(targetField)) {
          dependancyStatusList[subjectField.rootFieldId].parents.push(
            targetField.rootFieldId
          );
        }
        if (targetField.isDependancyOf(subjectField)) {
          dependancyStatusList[subjectField.rootFieldId].children.push(
            targetField.rootFieldId
          );
        }

        if (
          !subjectField.isDependancyOf(targetField) &&
          !targetField.isDependancyOf(subjectField)
        ) {
          dependancyStatusList[subjectField.rootFieldId].mutuallyExclusive.push(
            targetField.rootFieldId
          );
        }
      });
    });

    return dependancyStatusList;
  }

  public getFieldLogicDependancyList(fieldId: string) {
    const rootFieldTree = this._childFields[fieldId];
    const dependancies: { id: string; label: string }[] = [];

    // Object.values(subFieldTrees).forEach((subjectField) => {
    Object.values(this._childFields).forEach((depencyField) => {
      if (rootFieldTree.rootFieldId === depencyField.rootFieldId) {
        return; // of course two fields will have identical dependancies
      }

      if (depencyField.isDependancyOf(rootFieldTree)) {
        const nodeContent = depencyField.getChildContentAt(
          depencyField.rootNodeId
        ) as TFieldLogic;

        const { label } = nodeContent;
        dependancies.push({ id: depencyField.rootFieldId, label: label || "" });
      }
    });
    return dependancies;
  }

  public replaceNodeContent(
    nodeId: string,
    nodeContent: TGenericNodeContent<TFieldLogic>
  ): void {
    if (nodeId === this.rootNodeId) {
      this._rootFieldId = (nodeContent as TFieldLogic).fieldId;
    } else {
      this._dependancyFieldIds.push((nodeContent as TFieldLogic).fieldId);
    }
    super.replaceNodeContent(nodeId, nodeContent);
  }

  getDependancyFieldIds() {
    return this._dependancyFieldIds.slice();
  }

  getDeepDependancyFieldIds(): string[] {
    const allDependancyIds: string[] = this._dependancyFieldIds;
    const subtreeIds = this.getSubtreeIdsAt();
    subtreeIds.forEach((subtreeId) => {
      const subtree = this.getChildContentAt(
        subtreeId
      ) as FsFormAsDirectedGraph;
      allDependancyIds.push(...subtree.getDependancyFieldIds());
    });
    return allDependancyIds;
  }

  get rootFieldId(): string {
    return this._rootFieldId;
  }

  public appendChildNodeWithContent(
    parentNodeId: string,
    nodeContent: TGenericNodeContent<TFieldLogic>
  ): string {
    this._dependancyFieldIds.push((nodeContent as TFieldLogic).fieldId);
    return super.appendChildNodeWithContent(parentNodeId, nodeContent);
  }

  isDependancyOf(otherField: FsFormAsDirectedGraph): boolean {
    const o = otherField.rootFieldId;
    return this._dependancyFieldIds.includes(otherField.rootFieldId);
  }

  static fromFormJson(formJson: {
    fields: { id: string; logic: { checks: any[] } }[];
  }): FsFormAsDirectedGraph {
    const formTree = new FsFormAsDirectedGraph();
    formJson.fields.forEach((field) => {
      formTree._childFields[field.id] =
        formTree.createSubtreeAt<FsFormAsDirectedGraph>(formTree.rootNodeId);
      formTree._childFields[field.id].replaceNodeContent(
        formTree._childFields[field.id].rootNodeId,
        convertFieldRootNode(field)
      );
      field.logic.checks.forEach((logicTerm) => {
        formTree._childFields[field.id].appendChildNodeWithContent(
          formTree._childFields[field.id].rootNodeId,
          convertFieldLogicCheck(logicTerm)
        );
      });
    });

    return formTree;
  }
}

const convertFieldRootNode = (field: any): TFieldLogic => {
  const fieldId = field.id;
  const logic = field.logic;

  const { action, conditional } = logic;
  return {
    isRoot: true,
    subjectId: fieldId,
    fieldId,
    action,
    conditional,
    rootFieldId: fieldId,
    label: field.label,
  };
};
const convertFieldLogicCheck = (check: any): TFieldLogic => {
  const { field, condition, option } = check;

  return {
    isRoot: false,
    fieldId: field,
    condition,
    option,
  };
};

export { FsFormAsDirectedGraph };
