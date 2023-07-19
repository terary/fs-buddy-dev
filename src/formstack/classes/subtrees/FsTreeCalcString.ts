import {
  IExpressionTree,
  TGenericNodeContent,
} from "predicate-tree-advanced-poc/dist/src";
import { TFsFieldAnyJson, TFsNode } from "../types";
import { AbstractFsTreeGeneric } from "../AbstractFsTreeGeneric";
import type { TFsArithmeticNode } from "./types";
class FsTreeCalcString extends AbstractFsTreeGeneric<TFsArithmeticNode> {
  private _dependantFieldIds: string[] = [];

  createSubtreeAt(
    targetNodeId: string
    // fieldJson: Partial<TFsFieldAny>
  ): IExpressionTree<TFsNode> {
    // const rootNode = {
    //   fieldId: this.fieldId,
    // };

    return new FsTreeCalcString();
  }

  evaluateWithValues<T>(values: { [fieldId: string]: any }): T {
    let calcString = this._fieldJson.calculation || "";
    this._dependantFieldIds.forEach((fieldId) => {
      calcString = calcString.replace(`[${fieldId}]`, `${values[fieldId]}`);
    });
    return eval(calcString);
  }

  getDependantFields(): string[] {
    return this._dependantFieldIds.slice();
  }

  replaceNodeContent(
    nodeId: string,
    nodeContent: TGenericNodeContent<TFsNode>
  ) {
    // no good reason to override this
    return super.replaceNodeContent(nodeId, nodeContent);
  }

  static fromFieldJson(fieldJson: TFsFieldAnyJson): FsTreeCalcString {
    const rootNode = {
      fieldId: fieldJson.id || "_MISSING_ID_",
      fieldJson: fieldJson as TFsFieldAnyJson,
    };

    const tree = new FsTreeCalcString(fieldJson.id || "_calc_tree_", rootNode);
    // tree._fieldId = fieldJson.id || "_MISSING_ID_";
    tree._fieldJson = fieldJson;
    tree.replaceNodeContent(tree.rootNodeId, rootNode);

    const { operators, fieldIds } = calcStringToOperatorsAndFieldIds(
      fieldJson.calculation
    );

    operators.forEach((op) => {
      // @ts-ignore op is not type TFsNode
      const opNode = tree.appendChildNodeWithContent(tree.rootNodeId, { op });
      fieldIds.forEach((fieldId) => {
        // @ts-ignore - fieldId not  'TGenericNodeContent<TFsNode>'
        tree.appendChildNodeWithContent(opNode, { fieldId });
      });
    });

    tree._dependantFieldIds.push(...fieldIds);
    // @ts-ignore FsTreeCalcString maybe unrelated to FsTreeCalcString ???
    return tree;
  } // AbstractFsTreeGeneric

  static createSubtreeFromFieldJson<FsTreeCalcString>(
    targetRootId: string,
    fieldJson: TFsFieldAnyJson,
    subtreeConstructor?:
      | ((rootIdSeed: string, fieldJson: TFsFieldAnyJson) => FsTreeCalcString)
      | undefined
  ): FsTreeCalcString {
    const tree = new FsTreeCalcString(targetRootId);
    const rootNode = {
      fieldId: fieldJson.id || "_MISSING_ID_",
      fieldJson: fieldJson as TFsFieldAnyJson,
    };
    tree.replaceNodeContent(tree.rootNodeId, rootNode);

    const { operators, fieldIds } = calcStringToOperatorsAndFieldIds(
      fieldJson.calculation
    );

    operators.forEach((op) => {
      // @ts-ignore op is not type TFsNode
      const opNode = tree.appendChildNodeWithContent(tree.rootNodeId, { op });
      fieldIds.forEach((fieldId) => {
        // @ts-ignore - fieldId not  'TGenericNodeContent<TFsNode>'
        tree.appendChildNodeWithContent(opNode, fieldId);
      });
    });

    tree._dependantFieldIds.push(...fieldIds);
    // @ts-ignore FsTreeCalcString maybe unrelated to FsTreeCalcString ???
    return tree;
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
