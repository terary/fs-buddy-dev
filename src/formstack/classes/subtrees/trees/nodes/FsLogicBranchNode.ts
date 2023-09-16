import type {
  TFsFieldLogicCheckLeaf,
  TFsFieldLogicJunctionJson,
  TFsVisibilityModes,
  TFsFieldLogicJunction,
  TLogicJunctionOperators,
} from "../../types";
import { AbstractNode } from "./AbstractNode";

//TFsFieldLogicJunction
class FsLogicBranchNode
  extends AbstractNode
  implements TFsFieldLogicJunction<TLogicJunctionOperators>
{
  //<TLogicJunctionOperators>
  private _ownerFieldId: string;
  private _conditional: "$and" | "$or";
  private _action: TFsVisibilityModes;
  private _fieldJson: TFsFieldLogicJunctionJson;
  // private _option: TFsVisibilityModes;
  // condition: "equals" | "greaterThan"; // not sure greaterThan is valid. Need to find all valid
  // option: TFsVisibilityModes; // values of the target field (not the same as TFsFieldLogic.action)
  constructor(
    ownerFieldId: string,
    conditional: "$and" | "$or" = "$and", // bad idea to implement business logic here
    action: TFsVisibilityModes,
    fieldJson: any
  ) {
    super();
    this._ownerFieldId = ownerFieldId;
    this._conditional = conditional;
    this._action = action;
    this._fieldJson = fieldJson;
  }

  get ownerFieldId() {
    return this._ownerFieldId;
  }

  get conditional() {
    return this._conditional;
  }

  get action() {
    return this._action;
  }

  get fieldJson() {
    return this._fieldJson;
  }
}

export { FsLogicBranchNode };
