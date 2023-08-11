import { FsFormAsDirectedGraph } from "./FsFormAsDirectedGraph";
// import form5353031 from "./fs-goof/fs-form/form5353031.json";
import { ApiSubmissionCacheManager } from "../common/ApiSubmissionCacheManager";
const apiKey = "cc17435f8800943cc1abd3063a8fe44f";
// const formId = "5368371";
// const formId = "5375703";  // different logic (big dipper, interdependant)
// const formId = "5389250"; // calc/logic operators
// const formId = "5353031"; // calc/logic operators
// const formId = "5358471"; // calc/logic operators
const submissionId = "1128297723";
const getDependancyList = (tree: FsFormAsDirectedGraph): any => {
  const theList: any = {};
  Object.values(tree.getChildFields()).forEach((field) => {
    theList[field.rootFieldId] = field.getDependencyFieldIds();
  });

  return theList;
};

(async () => {
  // const treeJsonX = await ApiCacheManager.getInstance().getTree(apiKey, formId);
  const submissionJson =
    await ApiSubmissionCacheManager.getInstance().getSubmission(
      apiKey,
      submissionId
      // "5358473"
    );

  console.log({ submissionJson });
  console.log(JSON.stringify(submissionJson, null, 2));

  console.log("Thats all folks");
})();
