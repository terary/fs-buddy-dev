import { TFsFieldAnyJson } from "../formstack";
import { FieldLogicService } from "./FieldLogicService";

class FormstackBuddy {
  private static _instance: FormstackBuddy;

  private _fieldLogicService!: FieldLogicService;
  private constructor() {}

  getFieldLogicService(fieldJson: TFsFieldAnyJson[]): FieldLogicService {
    return new FieldLogicService(fieldJson);
  }

  static getInstance(): FormstackBuddy {
    if (FormstackBuddy._instance === undefined) {
      FormstackBuddy._instance = new FormstackBuddy();
    }

    return FormstackBuddy._instance;
  }
}

export { FormstackBuddy };
