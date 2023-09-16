import { TApiFormJson } from "../formstack/type.form";
import { FormstackBuddy } from "../FormstackBuddy/FormstackBuddy";
import { FieldLogicService } from "../FormstackBuddy/FieldLogicService";

const getFormJsonFromApi = async (message: any): Promise<TApiFormJson> => {
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

class TreeManager {
  static #instance: TreeManager;

  private _formTrees: { [formId: string]: TApiFormJson } = {};
  private _fieldLogicService!: FieldLogicService;
  private constructor() {}

  addTree(fieldId: string, formJson: TApiFormJson) {
    this._formTrees[fieldId] = formJson;
  }

  getFieldLogicService() {
    return this._fieldLogicService;
  }

  async getTree(apiKey: string, formId: string): Promise<TApiFormJson> {
    if (this._formTrees[formId]) {
      return Promise.resolve(this._formTrees[formId]);
    } else {
      const formJson = await getFormJsonFromApi({ apiKey, formId });
      this._formTrees[formId] = formJson;
      this._fieldLogicService =
        FormstackBuddy.getInstance().getFieldLogicService(
          formJson.fields || []
        );

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
