import { TNodePojo } from "predicate-tree-advanced-poc/dist/src";
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

  static fromPojo(nodePojo: TNodePojo<AbstractLogicNode>): AbstractLogicNode {
    const { nodeContent } = nodePojo;
    return nodeContent;
  }
}
export { AbstractLogicNode };
