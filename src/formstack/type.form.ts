type TNumericBoolean = "0" | "1";
import { TFsFieldAnyJson } from "./classes/types";
import type { TFsFieldAny } from "./type.field";

type TApiForm = {
  created: string; //"2023-07-04 06:04:24";
  db: string; // "1";
  deleted: TNumericBoolean; // "0";
  folder: string; // "0";
  id: string; // "5353031";
  language: string; // "en";
  name: string; // "predicate_tree_deep_routed_circular_logic";
  num_columns: string; // "1";
  progress_meter: string; // "0";
  submissions: string; //"0";
  submissions_unread: string; //"0";
  updated: string; //"2023-07-04 06:04:24";
  viewkey: string; //"92LJo5m7jk";
  views: string; // "2";
  submissions_today: number; // 0;
  url: string; // "https://terarychambers.formstack.com/forms/predicate_tree_deep_routed_circular_logic";
  encrypted: boolean; // false;
  thumbnail_url: string | null; //null;
  submit_button_title: string; // "Submit Form";
  inactive: boolean;
  timezone: string; // "US/Eastern";
  should_display_one_question_at_a_time: boolean;
  can_access_1q_feature: boolean;
  is_workflow_form: boolean;
  is_workflow_published: boolean;
  has_approvers: boolean;
  edit_url: string; //"https://www.formstack.com/admin/form/builder/5353031/build";
  data_url: string; //"";
  summary_url: string; //"";
  rss_url: string; //"";
  permissions: 0 | 50 | 100 | 150; // I think thats correct
  can_edit: boolean;
  javascript: string;
  html: string;
  fields: TFsFieldAny[];
};

// maybe move *submission* stuff to its own file(s)
type TSubmissionDataItem = { fieldId: string; value: string };
type TSubmissionJson = {
  id: string;
  form: string;
  data: TSubmissionDataItem[];
};
type OverridePropertyTypes =
  | "fields"
  | "inactive"
  | "is_workflow_form"
  | "is_workflow_published";
// *tmc* type 'any' should be json type
type TApiFormJson = Partial<Omit<TApiForm, OverridePropertyTypes>> & {
  fields: any; // TFsFieldAnyJson[];
  inactive: string;
  is_workflow_form: boolean | string;
  is_workflow_published: boolean | string;
};

export type { TApiFormJson, TApiForm, TSubmissionDataItem, TSubmissionJson };
