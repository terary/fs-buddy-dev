import { TFsFieldAny } from "./type.field";
import { FieldTreeCollection } from "./FieldTreeCollection";
import type { TApiFormJson } from "./type.form";
class FormAsTree {
  #viewKey!: string;
  #id!: string;
  #name!: string;
  #url!: string;
  #should_display_one_question_at_a_time!: boolean;
  #is_workflow_form!: boolean;
  #has_approvers!: boolean;
  #edit_url!: string;
  #fields!: FieldTreeCollection;

  get name() {
    return this.#name;
  }

  get id() {
    return this.#name;
  }

  static fromJson(json: Partial<TApiFormJson>): FormAsTree {
    const formTree = new FormAsTree();
    formTree.#edit_url = json.edit_url || "";
    formTree.#fields = FieldTreeCollection.fromJson(json.fields || []);
    formTree.#has_approvers = json.has_approvers || false;
    formTree.#id = json.id || "";
    formTree.#is_workflow_form = json.is_workflow_form || false;
    formTree.#name = json.name || "";
    formTree.#should_display_one_question_at_a_time =
      json.should_display_one_question_at_a_time || false;
    formTree.#url = json.url || "";
    formTree.#viewKey = json.viewkey || "";

    return formTree;
  }
}
