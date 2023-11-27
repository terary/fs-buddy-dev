import { IExpressionTree } from "predicate-tree-advanced-poc/dist/src";
import { AbstractFsTreeGeneric } from "./AbstractFsTreeGeneric";
import { TFsVisibilityModes } from "../types";

abstract class AbstractFsFieldLogicModel<
  T extends object
> extends AbstractFsTreeGeneric<T> {
  protected _action!: TFsVisibilityModes;
  protected _ownerFieldId!: string;

  get action(): TFsVisibilityModes {
    // FS
    return this._action;
  }

  set ownerFieldId(value: string) {
    this._ownerFieldId = value; // *tmc* should determine if this is being used, and remove it
  }

  get ownerFieldId() {
    return this._ownerFieldId;
  }
}

export { AbstractFsFieldLogicModel };
