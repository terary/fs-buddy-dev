type TUiEvaluationObject = {
  uiid: string | null;
  fieldId: string;
  fieldType: string; // known type/string
  value: string;
  statusMessages: any[];
};

type TFlatSubmissionValues<T> = { [fieldId: string]: T };

// I am not sure this is what I want..
// Submission data will come in the form of {fieldId: Date | null | string[], number, number[]} etc
// type TFlatSubmissionValues<T> = TFlatSubmissionValue<T>[];
// type TFlatSubmissionValues = { [fieldId: string]: any };
// type TFlatSubmissionValues<T> = { [fieldId: string]: T };

export type { TFlatSubmissionValues, TUiEvaluationObject };
