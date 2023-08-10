import { TFsFieldAddress } from "../../type.field";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { AbstractSubfieldEvaluator } from "./AbstractSubfieldEvaluator";
import { TEvaluateRequest, TEvaluateResponse } from "./type";

class NameEvaluator extends AbstractSubfieldEvaluator {
  private _supportedSubfieldIds = [
    "first",
    "last",
    "initial",
    "prefix",
    "suffix",
    "middle",
  ];

  get supportedSubfieldIds() {
    return this._supportedSubfieldIds;
  }
}

export { NameEvaluator };
