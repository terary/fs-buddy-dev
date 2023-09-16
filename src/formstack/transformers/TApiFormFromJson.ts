import { TFsFieldAnyJson } from "../classes/types";
import { TFsFieldAny } from "../type.field";
import { TApiForm, TApiFormJson } from "../type.form";
import { TFsFieldAnyFromJson } from "./TFsFieldAnyFromJson";

const TApiFormFromJson = (formJson: TApiFormJson): TApiForm => {
  // const fields: TFsFieldAny[] = [];
  const fields = (formJson.fields || []).map((fieldJson: TFsFieldAnyJson) =>
    TFsFieldAnyFromJson(fieldJson)
  );

  // TFsFieldAnyFromJson
  return { ...{ fields }, ...(formJson as TApiForm) };
};
export { TApiFormFromJson };
// type TNumericBoolean = "0" | "1";
// import type { TFsFieldAny } from "./type.field";

// type TApiForm = {
//   created: string; //"2023-07-04 06:04:24";
//   db: number; // "1";
//   deleted: TNumericBoolean; // "0";
//   folder: number; // "0";
//   id: string; // "5353031";
//   language: string; // "en";
//   name: string; // "predicate_tree_deep_routed_circular_logic";
//   num_columns: number; // "1";
//   progress_meter: number; // "0";
//   submissions: number; //"0";
//   submissions_unread: number; //"0";
//   updated: string; //"2023-07-04 06:04:24";
//   viewkey: string; //"92LJo5m7jk";
//   views: number; // "2";
//   submissions_today: number; // 0;
//   url: string; // "https://terarychambers.formstack.com/forms/predicate_tree_deep_routed_circular_logic";
//   encrypted: boolean; // false;
//   thumbnail_url: number | null; //null;
//   submit_button_title: string; // "Submit Form";
//   inactive: boolean;
//   timezone: string; // "US/Eastern";
//   should_display_one_question_at_a_time: boolean;
//   can_access_1q_feature: boolean;
//   is_workflow_form: boolean;
//   is_workflow_published: boolean;
//   has_approvers: boolean;
//   edit_url: string; //"https://www.formstack.com/admin/form/builder/5353031/build";
//   data_url: string; //"";
//   summary_url: string; //"";
//   rss_url: string; //"";
//   permissions: 0 | 50 | 100 | 150; // I think thats correct
//   can_edit: boolean;
//   javascript: string;
//   html: string;
//   fields: TFsFieldAny[];
// };

// type TApiFormJson = Partial<TApiForm>;
// export type { TApiFormJson, TApiForm };
