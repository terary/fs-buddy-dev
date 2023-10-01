import { TNodePojo } from "predicate-tree-advanced-poc/dist/src";
import { TStatusRecord } from "../../../../../../chrome-extension/type";

abstract class AbstractLogicNode {
  abstract toPojo(): object;
  get nodeType(): string {
    return this.constructor.name;
  }

  abstract getStatusMessage(dependentChainFieldIds?: string[]): TStatusRecord[];
}
export { AbstractLogicNode };
