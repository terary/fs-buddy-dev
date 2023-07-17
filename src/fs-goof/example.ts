import form5350841 from "./fs-form/form5350841.json";
import form5353031 from "./fs-form/form5353031.json";
import type { TFieldLogic, TFieldDependencyList } from "./types";

import { FsFormAsDirectedGraph } from "./FsFormAsDirectedGraph";
const formTree = FsFormAsDirectedGraph.fromFormJson(form5353031);

const subFieldTrees = formTree.getChildFields();
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

const getDependancyStatuses = (
  tree: FsFormAsDirectedGraph
): TFieldDependencyList => {
  const dependancyStatusList: TFieldDependencyList = {};

  Object.values(tree.getChildFields()).forEach((subjectField) => {
    dependancyStatusList[subjectField.rootFieldId] = {
      interdependent: [],
      parents: [],
      children: [],
      mutuallyExclusive: [],
    };
    Object.values(tree.getChildFields()).forEach((targetField) => {
      if (subjectField.rootFieldId === targetField.rootFieldId) {
        return;
      }

      if (
        subjectField.isDependencyOf(targetField) &&
        targetField.isDependencyOf(subjectField)
      ) {
        dependancyStatusList[subjectField.rootFieldId].interdependent.push(
          targetField.rootFieldId
        );
      }
      if (subjectField.isDependencyOf(targetField)) {
        dependancyStatusList[subjectField.rootFieldId].parents.push(
          targetField.rootFieldId
        );
      }
      if (targetField.isDependencyOf(subjectField)) {
        dependancyStatusList[subjectField.rootFieldId].children.push(
          targetField.rootFieldId
        );
      }

      if (
        !subjectField.isDependencyOf(targetField) &&
        !targetField.isDependencyOf(subjectField)
      ) {
        dependancyStatusList[subjectField.rootFieldId].mutuallyExclusive.push(
          targetField.rootFieldId
        );
      }
    });
  });

  return dependancyStatusList;
};

const getDependancyList = (tree: FsFormAsDirectedGraph): any => {
  const theList: any = {};
  console.log(theList);
  Object.values(tree.getChildFields()).forEach((field) => {
    theList[field.rootFieldId] = field.getDependencyFieldIds();
  });

  return theList;
};

console.log("Thats all folks");

console.log({
  fieldHasDependancy: formTree.getFieldLogicDependencyList("147462595"),
});

console.log({
  getDependacyList: getDependancyList(formTree),
});
console.log(JSON.stringify(formTree.getDependencyStatuses(), null, 2));
