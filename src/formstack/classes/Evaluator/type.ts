type TUiEvaluationObject = {
  uiid: string | null;
  fieldId: string;
  fieldType: string; // known type/string
  value: string;
  statusMessages: any[];
};
type TStatusMessageSeverity = "debug" | "error" | "info" | "warn";

export type { TStatusMessageSeverity, TUiEvaluationObject };
