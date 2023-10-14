type TLogicTreeDeepStatisticCountField =
  | "totalBranchNodes"
  | "totalCircularExclusiveLogicNodes"
  | "totalCircularInclusiveLogicNodes"
  | "totalCircularLogicNodes"
  | "totalLeafNodes"
  | "totalNodes"
  | "totalRootNodes"
  | "totalUnclassifiedNodes";

// totalNodes: number;
// totalCircularLogicNodes: number;
// totalCircularExclusiveLogicNodes: number;
// totalCircularInclusiveLogicNodes: number;
// totalUnclassifiedNodes: number;
// totalLeafNodes: number;
// totalBranchNodes: number;
type TLogicTreeDeepStatisticCountRecord = {
  [k in TLogicTreeDeepStatisticCountField]: number;
};

// type TLogicTreeDeepStatisticCountRecord = {
//   totalNodes: number;
//   totalCircularLogicNodes: number;
//   totalCircularExclusiveLogicNodes: number;
//   totalCircularInclusiveLogicNodes: number;
//   totalUnclassifiedNodes: number;
//   totalLeafNodes: number;
//   totalBranchNodes: number;
// };

export type {
  TLogicTreeDeepStatisticCountRecord,
  TLogicTreeDeepStatisticCountField,
};
