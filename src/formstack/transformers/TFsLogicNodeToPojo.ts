import { TNodePojo } from "predicate-tree-advanced-poc/dist/src";
import { TFsFieldLogicNode, TFsLogicNode } from "../classes/subtrees/types";
import { TFsFieldLogicJunctionFromJson } from "./TFsFieldLogicJunctionFromJson";

const TFsFieldLogicNodeToPojo = (nodeContent: TFsFieldLogicNode) => {
  return structuredClone(nodeContent) as unknown as TNodePojo<TFsLogicNode>;
};

const TFsFieldLogicNodeFromPojo = (nodeContent: TNodePojo<TFsLogicNode>) => {
  return nodeContent.nodeContent as unknown as TFsFieldLogicNode;
};

export { TFsFieldLogicNodeToPojo, TFsFieldLogicNodeFromPojo };
