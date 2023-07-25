import { TFsFieldLogicCheckLeaf, TFsVisibilityModes } from "../../types";
import { AbstractNode } from "./AbstractNode";

//TFsFieldLogicCheckLeaf
class FsLogicLeafNode extends AbstractNode implements TFsFieldLogicCheckLeaf {
  private _fieldId: string;
  private _condition: "equals" | "greaterThan";
  private _option: TFsVisibilityModes;
  // condition: "equals" | "greaterThan"; // not sure greaterThan is valid. Need to find all valid
  // option: TFsVisibilityModes; // values of the target field (not the same as TFsFieldLogic.action)
  constructor(
    fieldId: string,
    condition: "equals" | "greaterThan",
    option: TFsVisibilityModes
  ) {
    super();
    this._fieldId = fieldId;
    this._condition = condition;
    this._option = option;
  }

  get fieldId() {
    return this._fieldId;
  }
  get condition() {
    return this._condition;
  }
  get option() {
    return this._option;
  }
}

export { FsLogicLeafNode };
