import { TFsFieldAny } from "../type.field";
import type { TFsLogicNode } from "./subtrees/types";

type TFsFieldAnyJson = Omit<Partial<TFsFieldAny>, "logic"> & {
  logic: TFsLogicNode;
};
type TFsNode = {
  // fieldId: string;
  // fieldJson: Partial<TFsFieldAny>;
};
export type { TFsNode, TFsFieldAnyJson };
