import path from "path";
import fs from "fs";
type TFsFormJson = any;

const getFormJsonFromApi = async (message: any) => {
  const { apiKey, formId } = message;

  return new Promise((resolve, reject) => {
    if (!apiKey || !formId) {
      throw new Error(`apiKey: '${apiKey}' or formId: '${formId}'.`);
    }

    const formGetUrl = `https://www.formstack.com/api/v2/form/${formId}`;

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${apiKey}`);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(formGetUrl, requestOptions)
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

class ApiFormCacheManager {
  static #instance: ApiFormCacheManager;
  #cacheDirectory = process.cwd() + "/api-cache/forms";
  private _formsAsJson: { [formId: string]: TFsFormJson } = {};
  private constructor() {
    this._initialize();
  }

  private _initialize() {
    const fileNames = fs.readdirSync(this.#cacheDirectory);

    fileNames.forEach((fileName) => {
      const formId = fileName.replace(".json", "");
      const formJson = fs
        .readFileSync(path.join(this.#cacheDirectory, fileName))
        .toString("utf8");
      this.addTree(formId, JSON.parse(formJson));
    });
  }

  putFile(formId: string, formJson: any) {
    const fileName = path.join(this.#cacheDirectory, `/${formId}.json`);
    fs.writeFileSync(fileName, JSON.stringify(formJson));
  }

  addTree(formId: string, formJson: TFsFormJson) {
    this._formsAsJson[formId] = formJson;
  }

  formIdExists(formId: string): boolean {
    return formId in this._formsAsJson;
  }

  private _getTree(formId: string) {
    return this._formsAsJson[formId];
  }

  async getTree(apiKey: string, formId: string): Promise<TFsFormJson> {
    if (this.formIdExists(formId)) {
      const x = this._getTree(formId);
      return Promise.resolve(x);
    } else {
      const formJson = await getFormJsonFromApi({ apiKey, formId });
      this.putFile(formId, formJson);
      this.addTree(formId, formJson);
      return this._getTree(formId);
    }
  }

  static getInstance(): ApiFormCacheManager {
    if (!ApiFormCacheManager.#instance) {
      ApiFormCacheManager.#instance = new ApiFormCacheManager();
    }
    return ApiFormCacheManager.#instance;
  }
}

export { ApiFormCacheManager };
