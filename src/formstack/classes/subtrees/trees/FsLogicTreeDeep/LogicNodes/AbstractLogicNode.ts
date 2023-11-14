import type { TStatusRecord } from "../../../../Evaluator/type";

abstract class AbstractLogicNode {
  abstract toPojo(): object;
  protected abstract _nodeType: string;
  get nodeType(): string {
    // this is a problem if ran minified
    // this.constructor.name, won't work if minified
    return this._nodeType;
  }

  abstract getStatusMessage(
    rootFieldId: string,
    dependentChainFieldIds?: string[]
  ): TStatusRecord[];
}
export { AbstractLogicNode };
