type TStatusRecord = {
  fieldId?: string | null;
  severity: "error" | "warn" | "info" | "debug" | "logic";
  message: string;
  relatedFieldIds?: string[] | null;
};

export type { TStatusRecord };
