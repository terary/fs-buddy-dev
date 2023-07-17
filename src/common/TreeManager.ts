import { ITree } from "predicate-tree-advanced-poc/dist/src";
const getFormJsonFromApi = async (message: any) => {
  const { apiKey, formId } = message;

  return new Promise((resolve, reject) => {
    console.log("Preparing request");

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

type TFsFormJson = any;

class TreeManager {
  static #instance: TreeManager;

  private _formTrees: { [formId: string]: TFsFormJson } = {};
  private constructor() {}

  addTree(fieldId: string, formJson: TFsFormJson) {
    this._formTrees[fieldId] = formJson;
  }

  async getTree(apiKey: string, formId: string): Promise<TFsFormJson> {
    if (this._formTrees[formId]) {
      return Promise.resolve(this._formTrees[formId]);
    } else {
      const formJson = await getFormJsonFromApi({ apiKey, formId });
      this._formTrees[formId] = formJson;
      return this._formTrees[formId];
    }
  }

  static getInstance(): TreeManager {
    if (!TreeManager.#instance) {
      TreeManager.#instance = new TreeManager();
    }
    return TreeManager.#instance;
  }
}

export { TreeManager };
