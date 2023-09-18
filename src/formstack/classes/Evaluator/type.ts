type TUiEvaluationObject = {
  uiid: string | null;
  fieldId: string;
  fieldType: string; // known type/string
  value: string;
  statusMessages: any[];
};
type TStatusMessageSeverity = "debug" | "error" | "info" | "warn";
type TSimpleDictionary<T> = { [key: string]: T };

export type { TStatusMessageSeverity, TUiEvaluationObject, TSimpleDictionary };
