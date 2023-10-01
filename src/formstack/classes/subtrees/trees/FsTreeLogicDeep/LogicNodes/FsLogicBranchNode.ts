import type {
  TFsFieldLogicCheckLeaf,
  TFsFieldLogicJunctionJson,
  TFsVisibilityModes,
  TFsFieldLogicJunction,
  TLogicJunctionOperators,
} from "../../../types";
import { AbstractLogicNode } from "./AbstractLogicNode";

//TFsFieldLogicJunction
class FsLogicBranchNode
  extends AbstractLogicNode
  implements TFsFieldLogicJunction<TLogicJunctionOperators>
{
  private _ownerFieldId: string;
  private _conditional: "$and" | "$or";
  private _action: TFsVisibilityModes;
  private _fieldJson: TFsFieldLogicJunctionJson;
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

  toPojo(): object {
    return {
      nodeType: this.nodeType,
      ownerFieldId: this.ownerFieldId,
      action: this.action,
      conditional: this.conditional,
    };
  }
}

export { FsLogicBranchNode };
