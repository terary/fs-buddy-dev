import { TFsFieldAnyJson } from "../formstack";
import { TApiForm } from "../formstack/type.form";
import { FieldLogicService } from "./FieldLogicService";
import { FormAnalytics } from "./FormAnalytics";

class FormstackBuddy {
  private static _instance: FormstackBuddy;

  private _fieldLogicService!: FieldLogicService;
  private constructor() {}

  getFieldLogicService(formJson: TApiForm): FieldLogicService {
    return new FieldLogicService(formJson);
  }

  // getFieldLogicService(fieldJson: TFsFieldAnyJson[]): FieldLogicService {
  //   return new FieldLogicService(fieldJson);
  // }

  getFormAnalyticService(formJson: TApiForm): FormAnalytics {
    return new FormAnalytics(formJson);
  }

  static getInstance(): FormstackBuddy {
    if (FormstackBuddy._instance === undefined) {
      FormstackBuddy._instance = new FormstackBuddy();
    }

    return FormstackBuddy._instance;
  }
}

export { FormstackBuddy };
