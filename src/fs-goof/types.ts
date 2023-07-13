type TFieldLogic = {
  isRoot: boolean;
  rootFieldId?: string;
  subjectId?: string;
  fieldId: string;
  // root
  label?: string;
  action?: string; // should be show| hide?
  conditional?: string;

  // children
  condition?: "equals";
  option?: {
    all?: string[];
    any?: string[];
  };
  value?: string; // options created by form creator
};

type TFieldDependcyStatus =
  | "mutuallyExclusive"
  | "interdependant"
  | "children"
  | "parents"; // should be only one except for circular dependancy

type TFieldDependancyList = {
  [fieldId: string]: { [K in TFieldDependcyStatus]: string[] };
};

export type { TFieldLogic, TFieldDependancyList };
