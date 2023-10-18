type TUiEvaluationObject = {
  uiid: string | null;
  fieldId: string;
  fieldType: string; // known type/string
  value: string;
  statusMessages: any[];
};

type TStatusMessageSeverity = "debug" | "error" | "info" | "warn" | "logic";
type TSimpleDictionary<T> = { [key: string]: T };

type TStatusRecord = {
  fieldId?: string | null;
  severity: TStatusMessageSeverity;
  message: string;
  relatedFieldIds?: string[] | null;
};

export type {
  TStatusMessageSeverity,
  TUiEvaluationObject,
  TSimpleDictionary,
  TStatusRecord,
};
