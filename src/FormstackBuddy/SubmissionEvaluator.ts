// private _fieldCollection: FsTreeFieldCollection;
import type { TSubmissionJson } from "../formstack/type.form";

type TUiSubmissionDataItem = {
  uiid: string;
  fieldId: string;
  fieldType: string; // known type
  value: string;
};

// return {
//     uiid: "field" + submissionData.field,
//     fieldId: submissionData.field,
//     fieldType: submissionData.type,
//     value: submissionData.value,
//   };

import { FsTreeFieldCollection } from "../formstack";
import { Evaluator } from "../formstack/classes/Evaluator";
import { TFsFieldAny } from "../formstack/type.field";

class SubmissionEvaluator {
  private _fieldCollection: FsTreeFieldCollection;
  constructor(fieldCollection: FsTreeFieldCollection) {
    this._fieldCollection = fieldCollection;
  }

  private get fieldCollection() {
    return this._fieldCollection;
  }

  getPopulateUiArray(submission: TSubmissionJson): TUiSubmissionDataItem[] {
    /**
     *Get Evalua
     */
    submission.data.map((datum) => {
      const fieldTree = this.fieldCollection.getFieldTreeByFieldId(
        datum.fieldId
      );
      const evaluator = Evaluator.getEvaluatorWithFieldJson(
        fieldTree?.fieldJson as TFsFieldAny
      );
      return evaluator.getUiPopulateObject({ [datum.fieldId]: datum.value });
    });

    return [];
  }
}

export { SubmissionEvaluator };
