import { TNodePojo } from "predicate-tree-advanced-poc/dist/src";
import { AbstractLogicNode } from "./AbstractLogicNode";
import type { TStatusRecord } from "../../../../Evaluator/type";
import { transformers } from "../../../../../transformers";

class FsLogicErrorNode extends AbstractLogicNode {
  protected _nodeType = "FsLogicErrorNode";
  private _rootFieldId: string | null;
  private _parentFieldId: string | null;
  private _fieldId: string | null;
  private _message: string;
  private _dependentChainFieldIds: string[];
  constructor(
    rootFieldId: string | null,
    parentFieldId: string | null,
    fieldId: string | null,
    message: string,
    dependencyChain: string[]
  ) {
    super();
    this._rootFieldId = rootFieldId;
    this._parentFieldId = parentFieldId;
    this._fieldId = fieldId;
    this._message = message;
    this._dependentChainFieldIds = dependencyChain;
  }

  get dependentChainFieldIds() {
    return this._dependentChainFieldIds;
  }

  get fieldId(): string | null {
    return this._fieldId;
  }

  toPojo(): object {
    return {
      nodeType: this.nodeType,
      rootFieldId: this._rootFieldId,
      parentFieldId: this._parentFieldId,
      fieldId: this._fieldId,
      message: this._message,
      dependentChainFieldIds: this._dependentChainFieldIds,
    };
  }

  getStatusMessage(
    rootFieldId: string,
    dependentChainFieldIds?: string[]
  ): TStatusRecord[] {
    return [
      {
        severity: "error",
        fieldId: this._rootFieldId,
        message: this._message,
        relatedFieldIds: this._dependentChainFieldIds,
      },
      {
        severity: "debug",
        fieldId: this._rootFieldId,
        message: transformers.Utility.jsObjectToHtmlFriendlyString({
          rootFieldId: this._rootFieldId,
          parentFieldId: this._fieldId,
          fieldId: this._fieldId,
          message: this._message,
          dependencyChain: this._dependentChainFieldIds,
        }),
        relatedFieldIds: this._dependentChainFieldIds,
      },
    ];
  }
}
export { FsLogicErrorNode };
