import { TApiFormFromJson } from "./TApiFormFromJson";
import { TFsFieldAnyFromJson } from "./TFsFieldAnyFromJson";
import { TFsFieldLogicJunctionFromJson } from "./TFsFieldLogicJunctionFromJson";
import { Utility } from "./Utility";
import {
  TFsFieldLogicNodeToPojo,
  TFsFieldLogicNodeFromPojo,
} from "./TFsLogicNodeToPojo";
export const transformers = {
  fieldJson: TFsFieldAnyFromJson,
  formJson: TApiFormFromJson,
  logicJunctionJson: TFsFieldLogicJunctionFromJson,
  TFsFieldLogicNode: {
    fromPojo: TFsFieldLogicNodeFromPojo,
    toPojo: TFsFieldLogicNodeToPojo,
  },
  Utility,
};
