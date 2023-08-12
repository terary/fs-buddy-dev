import { TSubmissionDataItem, TSubmissionJson } from "../formstack/type.form";
import { FormstackBuddy } from "../FormstackBuddy/FormstackBuddy";
import { FieldLogicService } from "../FormstackBuddy/FieldLogicService";

const getSubmissionJsonFromApi = async (
  message: any
): Promise<TSubmissionJson> => {
  const { apiKey, submissionId } = message;

  return new Promise((resolve, reject) => {
    if (!apiKey || !submissionId) {
      throw new Error(
        `missing: apiKey: '${apiKey}' or submissionId: '${submissionId}'.`
      );
    }

    const submissionGetUrl = `https://www.formstack.com/api/v2/submission/${submissionId}.json`;

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${apiKey}`);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(submissionGetUrl, requestOptions)
      .then((response) => {
        return response.text();
      })
      .then((result) => {
        try {
          resolve(JSON.parse(result));
        } catch (e) {
          reject(e);
        }
      })
      .catch((error) => reject(error));
  });
};

class SubmissionManager {
  static #instance: SubmissionManager;

  private _submissions: { [submissionId: string]: TSubmissionJson } = {};
  private _fieldLogicService!: FieldLogicService;
  private constructor() {}

  addTree(submissionId: string, formJson: TSubmissionJson) {
    this._submissions[submissionId] = formJson;
  }

  async getSubmission(
    apiKey: string,
    submissionId: string
  ): Promise<TSubmissionJson> {
    if (this._submissions[submissionId]) {
      return Promise.resolve(this._submissions[submissionId]);
    } else {
      const submissionJson = await getSubmissionJsonFromApi({
        apiKey,
        submissionId,
      });
      this._submissions[submissionId] = submissionJson;
      // this._fieldLogicService =
      //   FormstackBuddy.getInstance().getFieldLogicService(
      //     formJson.fields || []
      //   );

      return this._submissions[submissionId];
    }
  }

  static getInstance(): SubmissionManager {
    if (!SubmissionManager.#instance) {
      SubmissionManager.#instance = new SubmissionManager();
    }
    return SubmissionManager.#instance;
  }
}

export { SubmissionManager };
