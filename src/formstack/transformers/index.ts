import { TApiFormFromJson } from "./TApiFormFromJson";
import { TFsFieldAnyFromJson } from "./TFsFieldAnyFromJson";
import { TFsFieldLogicJunctionFromJson } from "./TFsFieldLogicJunctionFromJson";
import { Utility } from "./Utility";

export const transformers = {
  fieldJson: TFsFieldAnyFromJson,
  formJson: TApiFormFromJson,
  logicJunctionJson: TFsFieldLogicJunctionFromJson,
  Utility,
};
