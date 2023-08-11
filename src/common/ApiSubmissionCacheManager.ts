import path from "path";
import fs from "fs";
type TFsFormJson = any;

const getFormJsonFromApi = async (message: any) => {
  const { apiKey, submissionId } = message;

  return new Promise((resolve, reject) => {
    if (!apiKey || !submissionId) {
      throw new Error(
        `apiKey: '${apiKey}' or submissionId: '${submissionId}'.`
      );
    }

    // const formGetUrl = `https://www.formstack.com/api/v2/form/${formId}`;
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

class ApiSubmissionCacheManager {
  static #instance: ApiSubmissionCacheManager;
  #cacheDirectory = process.cwd() + "/api-cache/submissions";
  private _submissionsAsJson: { [formId: string]: TFsFormJson } = {};
  private constructor() {
    this._initialize();
  }

  private _initialize() {
    const fileNames = fs.readdirSync(this.#cacheDirectory);

    fileNames.forEach((fileName) => {
      const submissionId = fileName.replace(".json", "");
      const submissionJson = fs
        .readFileSync(path.join(this.#cacheDirectory, fileName))
        .toString("utf8");
      this.addSubmission(submissionId, JSON.parse(submissionId));
    });
  }

  putFile(submissionId: string, submissionJson: any) {
    const fileName = path.join(this.#cacheDirectory, `/${submissionId}.json`);
    fs.writeFileSync(fileName, JSON.stringify(submissionJson));
  }

  addSubmission(submissionId: string, submissionJson: TFsFormJson) {
    this._submissionsAsJson[submissionId] = submissionJson;
  }

  formIdExists(submissionId: string): boolean {
    return submissionId in this._submissionsAsJson;
  }

  private _getSubmission(submissionId: string) {
    return this._submissionsAsJson[submissionId];
  }

  async getSubmission(
    apiKey: string,
    submissionId: string
  ): Promise<TFsFormJson> {
    if (this.formIdExists(submissionId)) {
      return Promise.resolve(this._getSubmission(submissionId));
    } else {
      const submissionJson = await getFormJsonFromApi({ apiKey, submissionId });
      this.putFile(submissionId, submissionJson);
      // console.log("Disabled disk write");
      this.addSubmission(submissionId, submissionJson);
      return this._getSubmission(submissionId);
    }
  }

  static getInstance(): ApiSubmissionCacheManager {
    if (!ApiSubmissionCacheManager.#instance) {
      ApiSubmissionCacheManager.#instance = new ApiSubmissionCacheManager();
    }
    return ApiSubmissionCacheManager.#instance;
  }
}

export { ApiSubmissionCacheManager };
