import { TNodePojo } from "predicate-tree-advanced-poc/dist/src";
import { transformers } from "../../../../../transformers";
import type { TStatusRecord } from "../../../../Evaluator/type";
import {
  TFsFieldLogicCheckLeaf,
  TFsLeafOperators,
  TFsVisibilityModes,
} from "../../../types";
import { AbstractLogicNode } from "./AbstractLogicNode";
interface ITFsFieldLogicCheckLeaf {
  fieldId: string;
  condition: TFsLeafOperators;
  option: string;
}
//TFsFieldLogicCheckLeaf
class FsLogicLeafNode
  extends AbstractLogicNode
  implements TFsFieldLogicCheckLeaf
{
  private _fieldId: string;
  private _condition: TFsLeafOperators;

  private _option: string;
  constructor(fieldId: string, condition: TFsLeafOperators, option: string) {
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

  toPojo(): object {
    return {
      nodeType: this.nodeType,
      fieldId: this.fieldId,
      condition: this.condition,
      option: this.option,
    };
  }

  getStatusMessage(
    rootFieldId: string,
    dependentChainFieldIds?: string[]
  ): TStatusRecord[] {
    const debugMessageObject = {
      nodeType: "FsLogicLeafNode",
      fieldId: this.fieldId,
      condition: this.condition,
      option: this.option,
    };

    const logicMessage = `logic: (root fieldId: ${rootFieldId}) requires  this field to '${this.condition}' ->  '${this.option}' `;
    return [
      {
        severity: "debug",
        fieldId: this.fieldId,
        message:
          transformers.Utility.jsObjectToHtmlFriendlyString(debugMessageObject),
      },
      {
        severity: "logic",
        fieldId: this.fieldId,
        message: logicMessage,
        relatedFieldIds: dependentChainFieldIds,
      },
    ];
  }

  static fromPojo(nodePojo: TNodePojo<AbstractLogicNode>): FsLogicLeafNode;
  static fromPojo(nodePojo: TNodePojo<AbstractLogicNode>): AbstractLogicNode;
  static fromPojo(nodePojo: TNodePojo<AbstractLogicNode>): AbstractLogicNode {
    const { nodeContent } = nodePojo;
    const { fieldId, condition, option } = nodeContent as FsLogicLeafNode; // using type information, this will never be an instance
    return new FsLogicLeafNode(fieldId, condition, option);
  }
}

export { FsLogicLeafNode };
