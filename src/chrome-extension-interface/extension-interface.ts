import form5353031 from "../test-dev-resources/form-json/5353031.json";

import type { TFieldDependencyList } from "../fs-goof/types";
import { FsFormAsDirectedGraph } from "../fs-goof/FsFormAsDirectedGraph";

const getDependencyStatuses = (
  tree: FsFormAsDirectedGraph
): TFieldDependencyList => {
  const dependencyStatusList: TFieldDependencyList = {};

  Object.values(tree.getChildFields()).forEach((subjectField) => {
    dependencyStatusList[subjectField.rootFieldId] = {
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
};

const getDependancyList = (tree: FsFormAsDirectedGraph): any => {
  const theList: any = {};
  console.log(theList);
  Object.values(tree.getChildFields()).forEach((field) => {
    theList[field.rootFieldId] = field.getDependencyFieldIds();
  });

  return theList;
};

const treeUtilities = (treeJson: any) => {
  const formTree = FsFormAsDirectedGraph.fromFormJson(treeJson);

  return {
    getDependancyList: () => getDependancyList(formTree),
    getDependancyStatuses: () => getDependencyStatuses(formTree),
  };
};

(async () => {
  treeUtilities(form5353031).getDependancyList();
})();

export { treeUtilities };
