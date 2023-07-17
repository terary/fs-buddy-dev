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

type TFieldDependencyStatus =
  | "mutuallyExclusive"
  | "interdependent"
  | "children"
  | "parents"; // should be only one except for circular dependency

type TFieldDependencyList = {
  [fieldId: string]: { [K in TFieldDependencyStatus]: string[] };
};

export type { TFieldLogic, TFieldDependencyList };
