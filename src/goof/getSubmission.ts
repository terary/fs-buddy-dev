import { FsFormAsDirectedGraph } from "./FsFormAsDirectedGraph";
import { ApiSubmissionCacheManager } from "../common/ApiSubmissionCacheManager";
const apiKey = "cc17435f8800943cc1abd3063a8fe44f";

const submissionId = "1128297723";

(async () => {
  const submissionJson =
    await ApiSubmissionCacheManager.getInstance().getSubmission(
      apiKey,
      submissionId
    );

  console.log({ submissionJson });
  console.log(JSON.stringify(submissionJson, null, 2));

  console.log("Thats all folks");
})();
