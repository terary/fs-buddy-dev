const factoryStatusMessageX = (fieldId: string) => {
  const severity = Math.random() > 0.5 ? "error" : "warn";
  return {
    [fieldId]: {
      severity: severity,
      message: `The ${severity} message`,
      fieldId: fieldId,
      relatedFieldIds: ["147738154", "148111228", "147738157"],
    },
  };
};

let devDebugFieldIdsX = [
  "148136237",
  "147462595",
  "147462596",
  "147462597",
  "147462598",
  "147462600",
  "148135962",
  "148136234",
];

const fieldStatusMessage = devDebugFieldIdsX.reduce(
  (prev, current, cIdx, ary) => {
    return { ...factoryStatusMessageX(current), ...prev };
  },
  {}
);
console.log({ fieldStatusMessage });
// const allFieldStatusMessage = {};
// devDebugFieldIds.reduce();
// devDebugFieldIds;
// factoryStatusMessage;
