import {
  TFsFieldLogicJunction,
  TFsFieldLogicJunctionJson,
  TFsJunctionOperators,
  TFsLeafOperators,
  TFsVisibilityModes,
  // TLogicJunctionOperators,
} from "../classes/subtrees/types";
// TLogicJunctionOperators
import { TFsFieldLogicCheckLeafFromJson } from "./TFsFieldLogicCheckLeafFromJson";
const TFsFieldLogicJunctionFromJson = (
  fieldLogicJson: TFsFieldLogicJunctionJson,
  ownerFieldId: string
): TFsFieldLogicJunction<TFsJunctionOperators> => {
  const action: TFsVisibilityModes = (
    ["SHOW", "HIDE"].includes(fieldLogicJson?.action?.toUpperCase() || "")
      ? upperFirst(fieldLogicJson?.action?.toLocaleLowerCase() || "")
      : null
  ) as TFsVisibilityModes;

  const checks = TFsFieldLogicCheckLeafFromJson(fieldLogicJson?.checks || []); //

  return {
    fieldJson: fieldLogicJson,
    action,
    conditional: fieldLogicJson.conditional || "all",
    ownerFieldId,
    checks,
  };
};
export { TFsFieldLogicJunctionFromJson };

const upperFirst = (s = "") => {
  return (s.charAt(0).toUpperCase() + s.slice(1)) as TFsVisibilityModes;
};
