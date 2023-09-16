import {
  TFsFieldLogicJunction,
  TFsFieldLogicJunctionJson,
  TFsVisibilityModes,
  TLogicJunctionOperators,
} from "../classes/subtrees/types";
// TLogicJunctionOperators

const TFsFieldLogicJunctionFromJson = (
  fieldLogicJson: TFsFieldLogicJunctionJson,
  ownerFieldId: string
): TFsFieldLogicJunction<TLogicJunctionOperators> => {
  const action: TFsVisibilityModes = (
    ["SHOW", "HIDE"].includes(fieldLogicJson?.action?.toUpperCase() || "")
      ? upperFirst(fieldLogicJson?.action?.toLocaleLowerCase() || "")
      : null
  ) as TFsVisibilityModes;

  // TFsJunctionOperators

  const conditional: TLogicJunctionOperators =
    fieldLogicJson.conditional === "any" ? "$or" : "$and";
  return {
    fieldJson: fieldLogicJson,
    action,
    conditional,
    ownerFieldId,
  };
};
export { TFsFieldLogicJunctionFromJson };

const upperFirst = (s = "") => {
  return (s.charAt(0).toUpperCase() + s.slice(1)) as TFsVisibilityModes;
};
