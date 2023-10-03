import {
  TFsFieldLogicCheckLeaf,
  TFsFieldLogicCheckLeafJson,
} from "../classes/subtrees/types";

export const TFsFieldLogicCheckLeafFromJson = (
  checks: TFsFieldLogicCheckLeafJson[]
): TFsFieldLogicCheckLeaf[] => {
  if (!Array.isArray(checks)) {
    return [];
  }
  return (checks || []).map((check) => {
    return {
      fieldId: `${check.field}`,
      condition: check.condition,
      option: check.option,
    } as TFsFieldLogicCheckLeaf;
  });
};
