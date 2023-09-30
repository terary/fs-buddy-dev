import { TNodePojo } from "predicate-tree-advanced-poc/dist/src";

abstract class AbstractLogicNode {
  abstract toPojo(): object;
  get nodeType(): string {
    return this.constructor.name;
  }
}
export { AbstractLogicNode };
