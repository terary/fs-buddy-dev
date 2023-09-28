import { TStatusRecord } from "../../../../../chrome-extension/type";

abstract class AbstractNode {
  abstract getStatusMessage(dependentChainFieldIds?: string[]): TStatusRecord[];
}
export { AbstractNode };
