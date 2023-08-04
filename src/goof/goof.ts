import { FsFormAsDirectedGraph } from "./FsFormAsDirectedGraph";
// import form5353031 from "./fs-goof/fs-form/form5353031.json";
import { ApiCacheManager } from "../common/ApiManager";
const apiKey = "cc17435f8800943cc1abd3063a8fe44f";
// const formId = "5368371";
// const formId = "5375703";  // different logic (big dipper, interdependant)
const formId = "5389250"; // calc/logic operators

const getDependancyList = (tree: FsFormAsDirectedGraph): any => {
  const theList: any = {};
  Object.values(tree.getChildFields()).forEach((field) => {
    theList[field.rootFieldId] = field.getDependencyFieldIds();
  });

  return theList;
};

(async () => {
  // const treeJsonX = await ApiCacheManager.getInstance().getTree(apiKey, formId);
  const treeJson = await ApiCacheManager.getInstance().getTree(
    apiKey,
    formId
    // "5358473"
  );
  const formTree = FsFormAsDirectedGraph.fromFormJson(treeJson);

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

  console.log("Thats all folks");

  console.log({
    fieldHasDependancy: formTree.getFieldLogicDependencyList("147738219"),
  });

  console.log({
    getDependancyList: getDependancyList(formTree),
  });

  console.log(".getDependencyStatuses");
  console.log(JSON.stringify(formTree.getDependencyStatuses(), null, 2));
})();
