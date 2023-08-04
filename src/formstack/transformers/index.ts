import { TApiFormFromJson } from "./TApiFormFromJson";
import { TFsFieldAnyFromJson } from "./TFsFieldAnyFromJson";
import { TFsFieldLogicJunctionFromJson } from "./TFsFieldLogicJunctionFromJson";

export const transformers = {
  formJson: TApiFormFromJson,
  fieldJson: TFsFieldAnyFromJson,
  logicJunctionJson: TFsFieldLogicJunctionFromJson,
};
