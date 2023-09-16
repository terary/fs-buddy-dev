type TStatusRecord = {
  fieldId?: string | null;
  severity: "error" | "warn" | "info" | "debug";
  message: string;
  relatedFieldIds?: string[] | null;
};

export type { TStatusRecord };
