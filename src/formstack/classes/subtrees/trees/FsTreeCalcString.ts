import {
  IExpressionTree,
  TGenericNodeContent,
} from "predicate-tree-advanced-poc/dist/src";
import { TFsFieldAnyJson, TFsNode } from "../../types";
import { AbstractFsTreeGeneric } from "./AbstractFsTreeGeneric";
import type { TFsArithmeticNode } from "../types";
class FsTreeCalcString extends AbstractFsTreeGeneric<TFsArithmeticNode> {
  private _dependantFieldIds: string[] = [];

  createSubtreeAt(nodeId: string): IExpressionTree<TFsArithmeticNode> {
    // this is not a subtree - but maybe it should be?
    return new FsTreeCalcString();
  }
  // createSubtreeAt(targetNodeId: string): IExpressionTree<TFsNode> {
  //   return new FsTreeCalcString();
  // }

  evaluateWithValues<T>(values: { [fieldId: string]: any }): T {
    let calcString = this._fieldJson as string;
    this._dependantFieldIds.forEach((fieldId) => {
      calcString = calcString.replace(`[${fieldId}]`, `${values[fieldId]}`);
    });
    return eval(calcString);
  }

  getDependantFieldIds(): string[] {
    return this._dependantFieldIds.slice();
  }

  static fromFieldJson(fieldJson: TFsFieldAnyJson): FsTreeCalcString {
    const rootNode = {
      operator: "*",
    } as TFsArithmeticNode;

    const calcTree = new FsTreeCalcString(
      fieldJson.id || "_calc_tree_",
      rootNode
    );
    calcTree._fieldJson = fieldJson.calculation || null;
    calcTree.replaceNodeContent(calcTree.rootNodeId, rootNode);

    const { operators, fieldIds } = calcStringToOperatorsAndFieldIds(
      fieldJson.calculation
    );

    operators.forEach((op) => {
      const opNode = calcTree.appendChildNodeWithContent(calcTree.rootNodeId, {
        operator: op,
      } as TFsArithmeticNode);
      fieldIds.forEach(() => {
        calcTree.appendChildNodeWithContent(opNode, {
          operator: op,
        } as TFsArithmeticNode);
      });
    });

    calcTree._dependantFieldIds.push(...fieldIds);
    return calcTree;
  }
}
export { FsTreeCalcString };

const calcStringToOperatorsAndFieldIds = (
  calcString?: string | null
): { operators: string[]; fieldIds: string[] } => {
  const fieldIds: string[] = [];
  const operators: string[] = [];
  const regExOperands = /\[(\d+)\]/g;

  if (!calcString || calcString === "") {
    return { operators: [], fieldIds: [] };
  }

  let match;
  while ((match = regExOperands.exec(calcString))) {
    const fieldId = match[1];
    fieldIds.push(fieldId);
  }
  const regExOperators = /[-+*/]/g;
  while ((match = regExOperators.exec(calcString))) {
    const op = match[0];
    operators.push(op);
  }
  return { operators, fieldIds };
};
