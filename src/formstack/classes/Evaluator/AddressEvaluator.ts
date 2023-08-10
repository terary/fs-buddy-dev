import { TFsFieldAddress } from "../../type.field";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { AbstractSubfieldEvaluator } from "./AbstractSubfieldEvaluator";
import { TEvaluateRequest, TEvaluateResponse } from "./type";

class AddressEvaluator extends AbstractSubfieldEvaluator {
  private _supportedSubfieldIds = [
    "address",
    "address2",
    "city",
    "state",
    "zip",
    "country",
  ];

  get supportedSubfieldIds() {
    return this._supportedSubfieldIds;
  }
}

export { AddressEvaluator };
