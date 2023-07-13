import form5350841 from "./fs-form/form5350841.json";
import form5353031 from "./fs-form/form5353031.json";
import type { TFieldLogic, TFieldDependancyList } from "./types";

import { FsFormAsDirectedGraph } from "./FsFormAsDirectedGraph";
const formTree = FsFormAsDirectedGraph.fromFormJson(form5353031);

// type TFieldDependcyStatus =
//   | "interdependant"
//   | "mutually-exclusive"
//   | "dependant";
// type TFieldDependcyStatusList = {
//   [K in TFieldDependcyStatus]?: string[];
// };
// type TFieldDepnencyList = { [fieldId: string]: TFieldDependcyStatusList[] };
// type TFieldList = {
//   [fieldId: string]: {
//     [status: string]: TFieldDependcyStatusList[];
//   };
// };

const subFieldTrees = formTree.getChildFields();
Object.values(subFieldTrees).forEach((subjectField) => {
  Object.values(subFieldTrees).forEach((targetField) => {
    if (subjectField.rootFieldId === targetField.rootFieldId) {
      return; // of course two fields will have identical dependancies
    }

    if (
      subjectField.isDependancyOf(targetField) &&
      targetField.isDependancyOf(subjectField)
    ) {
      console.log(
        `fieldId: ${subjectField.rootFieldId} and fieldId: ${targetField.rootFieldId} are interdependant`
      );
    } else if (subjectField.isDependancyOf(targetField)) {
      console.log(
        `fieldId: ${subjectField.rootFieldId} is a dependancy of ${targetField.rootFieldId}`
      );
    } else if (targetField.isDependancyOf(subjectField)) {
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

// type TFieldDependcyStatus =
//   | "interdependant"
//   | "mutually-exclusive"
//   | "dependant";
// type TFieldDependcyStatusList = {
//   [K in TFieldDependcyStatus]?: string[];
// };

const getDependacyStatuses = (
  tree: FsFormAsDirectedGraph
): TFieldDependancyList => {
  const dependancyStatusList: TFieldDependancyList = {};

  Object.values(tree.getChildFields()).forEach((subjectField) => {
    dependancyStatusList[subjectField.rootFieldId] = {
      interdependant: [],
      parents: [],
      children: [],
      mutuallyExclusive: [],
    };
    Object.values(tree.getChildFields()).forEach((targetField) => {
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
};

const getDependacyList = (tree: FsFormAsDirectedGraph): any => {
  const theList: any = {};
  console.log(theList);
  Object.values(tree.getChildFields()).forEach((field) => {
    theList[field.rootFieldId] = field.getDependancyFieldIds();
  });

  return theList;
};

const treeUtilities = (treeJson: any) => {
  const formTree = FsFormAsDirectedGraph.fromFormJson(treeJson);

  return {
    getDependacyList: getDependacyList(formTree),
    // fieldHasDependancy: formTree.getFieldLogicDependancyList("147462595"),
  };
};

export { treeUtilities };
