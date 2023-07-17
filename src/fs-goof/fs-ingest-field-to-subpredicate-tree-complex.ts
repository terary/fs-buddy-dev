import form5350841 from "./fs-form/form5350841.json";
import form5353031 from "./fs-form/form5353031.json";
import type { TFieldLogic } from "./types";
import type { TGenericNodeContent } from "predicate-tree-advanced-poc/dist/src";

import { AbstractDirectedGraph } from "predicate-tree-advanced-poc/dist/src";

const convertFieldRootNode = (field: any): TFieldLogic => {
  // const fieldPojo: TPojoDocument = {};
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

class TestAbstractDirectedGraph extends AbstractDirectedGraph<TFieldLogic> {
  private _rootFieldId!: string;
  private _dependencyFieldIds: string[] = [];
  public getParentNodeId(nodeId: string): string {
    return super.getParentNodeId(nodeId);
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

  get dependencyFieldIds() {
    return this._dependencyFieldIds.slice();
  }

  getDeepDependencyFieldIds(): string[] {
    const allDependencyIds: string[] = this._dependencyFieldIds;
    const subtreeIds = this.getSubtreeIdsAt();
    subtreeIds.forEach((subtreeId) => {
      const subtree = this.getChildContentAt(
        subtreeId
      ) as TestAbstractDirectedGraph;
      allDependencyIds.push(...subtree.dependencyFieldIds);
    });
    return allDependencyIds;
  }

  get rootFieldId(): string {
    return this._rootFieldId;
  }
  //appendChildNodeWithContent()
  public appendChildNodeWithContent(
    parentNodeId: string,
    nodeContent: TGenericNodeContent<TFieldLogic>
  ): string {
    this._dependencyFieldIds.push((nodeContent as TFieldLogic).fieldId);
    return super.appendChildNodeWithContent(parentNodeId, nodeContent);
    // can never append root
  }

  isDependencyOf(otherField: TestAbstractDirectedGraph): boolean {
    const o = otherField.rootFieldId;
    return this._dependencyFieldIds.includes(otherField.rootFieldId);
  }
}

const logicArray: any[] = [];
const formTree = new TestAbstractDirectedGraph();

const f0Tree = formTree.createSubtreeAt<TestAbstractDirectedGraph>(
  formTree.rootNodeId
);
f0Tree.replaceNodeContent(
  f0Tree.rootNodeId,
  convertFieldRootNode(form5350841.fields[0])
);
form5350841.fields[0].logic.checks.forEach((logicTerm) => {
  f0Tree.appendChildNodeWithContent(
    f0Tree.rootNodeId,
    convertFieldLogicCheck(logicTerm)
  );
});

const f1Tree = formTree.createSubtreeAt<TestAbstractDirectedGraph>(
  formTree.rootNodeId
);
f1Tree.replaceNodeContent(
  f1Tree.rootNodeId,
  convertFieldRootNode(form5350841.fields[1])
);
form5350841.fields[1].logic.checks.forEach((logicTerm) => {
  f1Tree.appendChildNodeWithContent(
    f1Tree.rootNodeId,
    convertFieldLogicCheck(logicTerm)
  );
});

const subFieldTrees: {
  [fieldId: string]: TestAbstractDirectedGraph;
} = {};
form5353031.fields.forEach((field) => {
  subFieldTrees[field.id] = formTree.createSubtreeAt<TestAbstractDirectedGraph>(
    formTree.rootNodeId
  );
  subFieldTrees[field.id].replaceNodeContent(
    subFieldTrees[field.id].rootNodeId,
    convertFieldRootNode(field)
  );
  field.logic.checks.forEach((logicTerm) => {
    subFieldTrees[field.id].appendChildNodeWithContent(
      subFieldTrees[field.id].rootNodeId,
      convertFieldLogicCheck(logicTerm)
    );
  });
});

Object.values(subFieldTrees).forEach((subjectField) => {
  Object.values(subFieldTrees).forEach((targetField) => {
    if (subjectField.rootFieldId === targetField.rootFieldId) {
      return; // of course two fields will have identical dependencies
    }

    if (
      subjectField.isDependencyOf(targetField) &&
      targetField.isDependencyOf(subjectField)
    ) {
      console.log(
        `fieldId: ${subjectField.rootFieldId} and fieldId: ${targetField.rootFieldId} are interdependent`
      );
    } else if (subjectField.isDependencyOf(targetField)) {
      console.log(
        `fieldId: ${subjectField.rootFieldId} is a dependancy of ${targetField.rootFieldId}`
      );
    } else if (targetField.isDependencyOf(subjectField)) {
      console.log(
        `fieldId: ${targetField.rootFieldId} is a dependancy of ${subjectField.rootFieldId}`
      );
    } else {
      console.log(
        `fieldId: ${subjectField.rootFieldId} and fieldId: ${targetField.rootFieldId} are mutually exclusive`
      );
    }
  });
});

console.log("Thats all folks");
