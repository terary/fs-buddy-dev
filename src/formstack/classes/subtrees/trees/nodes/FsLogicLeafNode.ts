import { TStatusRecord } from "../../../../../chrome-extension/type";
import {
  TFsFieldLogicCheckLeaf,
  TFsFieldLogicJunction,
  TFsLeafOperators,
  TFsVisibilityModes,
} from "../../types";
import { AbstractNode } from "./AbstractNode";
import { FsLogicBranchNode } from "./FsLogicBranchNode";

//TFsFieldLogicCheckLeaf
class FsLogicLeafNode extends AbstractNode implements TFsFieldLogicCheckLeaf {
  private _fieldId: string;
  private _condition: TFsLeafOperators;
  private _predicateJson: object;
  private _option: TFsVisibilityModes;
  private _parentBranchNode: FsLogicBranchNode;
  constructor(
    fieldId: string,
    condition: TFsLeafOperators,
    option: TFsVisibilityModes,
    predicateJson: object,
    parentBranchNode: FsLogicBranchNode
  ) {
    super();
    this._fieldId = fieldId;
    this._condition = condition;
    this._option = option;
    this._predicateJson = predicateJson;
    this._parentBranchNode = parentBranchNode;
  }

  get condition() {
    return this._condition;
  }

  get fieldId() {
    return this._fieldId;
  }

  get fieldJson() {
    return this._predicateJson;
  }

  get option() {
    return this._option;
  }

  get predicateJson() {
    return this._predicateJson;
  }

  get parentBranchNode(): FsLogicBranchNode {
    return this._parentBranchNode;
  }

  getStatusMessage(): TStatusRecord[] {
    const debugMessage = JSON.stringify({
      nodeType: "FsLogicLeafNode",
      english: `Logic Term: this field '${this.condition}' '${this.option}'`,
      fieldId: this.fieldId,
      rootFieldId: this.parentBranchNode.ownerFieldId,
      condition: this.condition,
      option: this.option,
      junctionOperator: this.parentBranchNode.conditional,
      json: this.fieldJson,
    });
    // maybe it makes sense to add getStatusMessage on FsLogicLeafNode
    // this/it would need to reference parent (operator all/any, options)
    const logicMessage = `logic: value of this field: '${this.condition}' is  '${this.option}' (parent: fieldId: ${this.parentBranchNode.ownerFieldId} junction: '${this.parentBranchNode.conditional}')`;

    return [
      {
        severity: "debug",
        message: debugMessage,
        fieldId: this.fieldId,
      },
      {
        severity: "logic",
        message: logicMessage,
        fieldId: this.fieldId,
      },
    ];
  }
}

export { FsLogicLeafNode };
