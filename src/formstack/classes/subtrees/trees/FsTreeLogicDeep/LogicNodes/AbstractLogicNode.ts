import type { TStatusRecord } from "../../../../Evaluator/type";

abstract class AbstractLogicNode {
  abstract toPojo(): object;
  get nodeType(): string {
    return this.constructor.name;
  }

  abstract getStatusMessage(
    rootFieldId: string,
    dependentChainFieldIds?: string[]
  ): TStatusRecord[];
}
export { AbstractLogicNode };
