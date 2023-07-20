import { TFsFieldAny } from "../type.field";
import { TLogicNodeJson } from "./subtrees/types";

type TFsFieldAnyJson = Omit<Partial<TFsFieldAny>, "logic"> & {
  logic: TLogicNodeJson;
};

type TFsNode = {
  // fieldId: string;
  // fieldJson: Partial<TFsFieldAny>;
};
export type { TFsNode, TFsFieldAnyJson };
