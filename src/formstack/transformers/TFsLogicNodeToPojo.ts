import { TNodePojo } from "predicate-tree-advanced-poc/dist/src";
import { TFsFieldLogicNode, TFsLogicNode } from "../classes/subtrees/types";

const TFsFieldLogicNodeToPojo = (nodeContent: TFsFieldLogicNode) => {
  // const safeCopy = structuredClone(nodeContent);
  // if ("checks" in safeCopy) {
  //   // @ts-ignore - checks not property of generic type
  //   safeCopy.checks = nodeContent.checks;
  // }

  return structuredClone(nodeContent) as unknown as TNodePojo<TFsLogicNode>;
};

const TFsFieldLogicNodeFromPojo = (nodeContent: TNodePojo<TFsLogicNode>) => {
  return nodeContent.nodeContent as unknown as TFsFieldLogicNode;
};

export { TFsFieldLogicNodeToPojo, TFsFieldLogicNodeFromPojo };
