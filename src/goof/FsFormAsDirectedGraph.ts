import type { TFieldLogic, TFieldDependencyList } from "./types";
import { AbstractDirectedGraph } from "predicate-tree-advanced-poc/dist/src";
import type { TGenericNodeContent } from "predicate-tree-advanced-poc/dist/src";

class FsFormAsDirectedGraph extends AbstractDirectedGraph<TFieldLogic> {
  private _rootFieldId!: string;
  private _dependencyFieldIds: string[] = [];
  private _childFields: {
    [fieldId: string]: FsFormAsDirectedGraph;
  } = {};

  public getParentNodeId(nodeId: string): string {
    return super.getParentNodeId(nodeId);
  }

  getChildFields() {
    return this._childFields;
  }

  getDependencyStatuses(): TFieldDependencyList {
    const dependencyStatusList: TFieldDependencyList = {};

    Object.values(this.getChildFields()).forEach((subjectField) => {
      dependencyStatusList[subjectField.rootFieldId] = {
        interdependent: [],
        parents: [],
        children: [],
        mutuallyExclusive: [],
      };
      Object.values(this.getChildFields()).forEach((targetField) => {
        if (subjectField.rootFieldId === targetField.rootFieldId) {
          return;
        }

        if (
          subjectField.isDependencyOf(targetField) &&
          targetField.isDependencyOf(subjectField)
        ) {
          dependencyStatusList[subjectField.rootFieldId].interdependent.push(
            targetField.rootFieldId
          );
        }
        if (subjectField.isDependencyOf(targetField)) {
          dependencyStatusList[subjectField.rootFieldId].parents.push(
            targetField.rootFieldId
          );
        }
        if (targetField.isDependencyOf(subjectField)) {
          dependencyStatusList[subjectField.rootFieldId].children.push(
            targetField.rootFieldId
          );
        }

        if (
          !subjectField.isDependencyOf(targetField) &&
          !targetField.isDependencyOf(subjectField)
        ) {
          dependencyStatusList[subjectField.rootFieldId].mutuallyExclusive.push(
            targetField.rootFieldId
          );
        }
      });
    });

    return dependencyStatusList;
  }

  public getFieldLogicDependencyList(fieldId: string) {
    const rootFieldTree = this._childFields[fieldId];
    const dependencies: { id: string; label: string }[] = [];

    try {
      // Object.values(subFieldTrees).forEach((subjectField) => {
      Object.values(this._childFields).forEach((dependencyField) => {
        if (
          !rootFieldTree ||
          !dependencyField ||
          !("rootFieldId" in rootFieldTree) ||
          !("rootFieldId" in dependencyField)
        ) {
          throw new Error("Found one with no root key");
        }

        if (rootFieldTree.rootFieldId === dependencyField.rootFieldId) {
          return; // of course two fields will have identical dependencies
        }

        if (dependencyField.isDependencyOf(rootFieldTree)) {
          const nodeContent = dependencyField.getChildContentAt(
            dependencyField.rootNodeId
          ) as TFieldLogic;

          const { label } = nodeContent;
          dependencies.push({
            id: dependencyField.rootFieldId,
            label: label || "",
          });
        }
      });
      return dependencies;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public replaceNodeContent(
    nodeId: string,
    nodeContent: TGenericNodeContent<TFieldLogic>
  ): void {
    if (nodeId === this.rootNodeId) {
      this._rootFieldId = (nodeContent as TFieldLogic).fieldId;
    } else {
      this._dependencyFieldIds.push((nodeContent as TFieldLogic).fieldId);
    }
    super.replaceNodeContent(nodeId, nodeContent);
  }

  getDependencyFieldIds() {
    return this._dependencyFieldIds.slice();
  }

  getDeepDependencyFieldIds(): string[] {
    const allDependencyIds: string[] = this._dependencyFieldIds;
    const subtreeIds = this.getSubtreeIdsAt();
    subtreeIds.forEach((subtreeId) => {
      const subtree = this.getChildContentAt(
        subtreeId
      ) as FsFormAsDirectedGraph;
      allDependencyIds.push(...subtree.getDependencyFieldIds());
    });
    return allDependencyIds;
  }

  get rootFieldId(): string {
    return this._rootFieldId;
  }

  public appendChildNodeWithContent(
    parentNodeId: string,
    nodeContent: TGenericNodeContent<TFieldLogic>
  ): string {
    this._dependencyFieldIds.push((nodeContent as TFieldLogic).fieldId);
    return super.appendChildNodeWithContent(parentNodeId, nodeContent);
  }

  isDependencyOf(otherField: FsFormAsDirectedGraph): boolean {
    const o = otherField.rootFieldId;
    return this._dependencyFieldIds.includes(otherField.rootFieldId);
  }

  static fromFormJson(formJson: {
    fields: { id: string; logic: { checks: any[] } }[];
  }): FsFormAsDirectedGraph {
    const formTree = new FsFormAsDirectedGraph();
    (formJson.fields || []).forEach((field) => {
      formTree._childFields[field.id] =
        formTree.createSubtreeAt<FsFormAsDirectedGraph>(formTree.rootNodeId);

      formTree._childFields[field.id].replaceNodeContent(
        formTree._childFields[field.id].rootNodeId,
        convertFieldRootNode(field)
      );

      if (field.logic && field.logic.checks) {
        field.logic.checks.forEach((logicTerm) => {
          formTree._childFields[field.id].appendChildNodeWithContent(
            formTree._childFields[field.id].rootNodeId,
            convertFieldLogicCheck(logicTerm)
          );
        });
      }
    });

    return formTree;
  }
}

const convertFieldRootNode = (field: any): TFieldLogic => {
  const fieldId = field.id;
  const logic = field.logic;

  const { action = null, conditional = null } = logic || {};
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
