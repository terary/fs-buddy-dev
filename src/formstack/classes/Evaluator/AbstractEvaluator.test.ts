import { TFsFieldAny } from "../../type.field";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { TStatusRecord, TUiEvaluationObject } from "./type";

import { isFunctions } from "../../../common/isFunctions";

class TestSubfieldEvaluator extends AbstractEvaluator {
  parseValues<S = string, T = string>(submissionDatum?: S): T {
    return submissionDatum as T;
  }

  _getStoredValue(value: any) {
    return this.getStoredValue(value);
  }

  isCorrectType<T>(submissionDatum: T): boolean {
    return isFunctions.isString(submissionDatum);
  }
  // pass all submission fields, return all submission fields
  // so what does DateEvaluator(flatSubmissionData) do?
  // in what context would this be used?  theForm.evaluate(submissionData)[theFieldId],
  evaluateWithValues(values: string): string {
    return values;
  }

  getUiPopulateObjects<T = string | undefined>(
    submissionDatum: T
  ): TUiEvaluationObject[] {
    const datum = this.getStoredValue<string>(submissionDatum as string);

    const statusMessages: TStatusRecord[] = [
      {
        severity: datum === "__MISSING_AND_REQUIRED__" ? "warn" : "info",
        message: `Stored value: '${datum}'.`,
        relatedFieldIds: [],
      },
    ];

    if (datum === "__MISSING_AND_REQUIRED__") {
      statusMessages.push({
        fieldId: this.fieldId,
        severity: "warn",
        message: `Submission data missing and required.  This is not an issue if the field is hidden by logic.`,
        relatedFieldIds: [],
      });
    }

    return [
      {
        // *tmc* getUi - is probably an abstract function, should be removed from this class?
        uiid: "_ABSTRACT_",
        //  // this.isValidSubmissionDatum(datum)
        //   ? `field${this.fieldId}`
        //   : null,
        fieldId: this.fieldId,
        fieldType: this.fieldJson.type,
        value: "_ABSTRACT_", //this.isValidSubmissionDatum(datum) ? datum : "",

        statusMessages: statusMessages,
      },
    ];
  }
}

describe("AbstractSubfieldAbstractEvaluator", () => {
  describe("Getters", () => {
    describe("get fieldId", () => {
      it("should return fieldId", () => {
        const evaluator = new TestSubfieldEvaluator(fieldJson);
        expect(evaluator.fieldId).toStrictEqual("148008076");
      });
    });
    describe("get fieldJson", () => {
      it("should return copy of original fieldJson", () => {
        const evaluator = new TestSubfieldEvaluator(fieldJson);

        // comparing object to object gives error:
        // "Received: serializes to the same string"
        expect(Object.keys(evaluator.fieldJson)).toStrictEqual(
          Object.keys(fieldJson)
        );
        expect(Object.values(evaluator.fieldJson)).toStrictEqual(
          Object.values(fieldJson)
        );
      });
      it("should should be immutable", () => {
        const evaluator = new TestSubfieldEvaluator(fieldJson);

        evaluator.fieldJson.id = "_SOME_TEST_VALUE";
        // comparing object to object gives error:
        // "Received: serializes to the same string"
        expect(Object.keys(evaluator.fieldJson)).toStrictEqual(
          Object.keys(fieldJson)
        );
        expect(Object.values(evaluator.fieldJson)).toStrictEqual(
          Object.values(fieldJson)
        );
        expect(evaluator.fieldId).toStrictEqual("148008076");
      });
    });
    describe("get fieldType", () => {
      it("should return copy of original fieldJson", () => {
        const evaluator = new TestSubfieldEvaluator(fieldJson);
        expect(evaluator.fieldType).toStrictEqual("text");
      });
    });
    describe("get isRequired", () => {
      it("Should be false if fieldJson.required is '0'.", () => {
        const evaluator = new TestSubfieldEvaluator(fieldJson);
        expect(evaluator.isRequired).toStrictEqual(false);
      });

      it("Should be true if fieldJson.required is '1'.", () => {
        const modifiedFieldJson = {
          ...fieldJson,
          ...{ required: "1" },
        } as unknown as TFsFieldAny;
        const evaluator = new TestSubfieldEvaluator(modifiedFieldJson);
        expect(evaluator.isRequired).toStrictEqual(true);
      });
      it("Should be false if fieldJson.required is undefined.", () => {
        const modifiedFieldJson = {
          ...fieldJson,
        } as unknown as TFsFieldAny;
        // @ts-ignore - 'required' should be optional typed, this is the test case
        delete modifiedFieldJson["required"];
        const evaluator = new TestSubfieldEvaluator(modifiedFieldJson);
        expect(evaluator.isRequired).toStrictEqual(false);
      });
    });
  });

  describe(".getStoredValue()", () => {
    it("should return the provided value if not undefined and not required.", () => {
      const evaluator = new TestSubfieldEvaluator(fieldJson);
      const x = evaluator._getStoredValue("Any value will do");
      expect(evaluator._getStoredValue("Any value will do")).toStrictEqual(
        "Any value will do"
      );
    });
    it("should return '__NO_SUBMISSION_DATA__' if undefined and required.", () => {
      const evaluator = new TestSubfieldEvaluator(fieldJson);
      expect(evaluator._getStoredValue(undefined)).toStrictEqual(
        "__NO_SUBMISSION_DATA__"
      );
    });
    it("should return '__MISSING_AND_REQUIRED__' if undefined and required is truthy.", () => {
      const modifiedFieldJson = {
        ...fieldJson,
        ...{ required: "1" },
      } as unknown as TFsFieldAny;
      const evaluator = new TestSubfieldEvaluator(modifiedFieldJson);
      expect(evaluator._getStoredValue(undefined)).toStrictEqual(
        "__EMPTY_AND_REQUIRED__"
      );
    });
  });

  describe(".getUiPopulateObjects(...)", () => {
    it("Should return TUiEvaluationObject[] non-empty, correctly typed submissionData.", () => {
      const evaluator = new TestSubfieldEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects("any value will do");
      expect(actual).toStrictEqual([
        {
          uiid: "_ABSTRACT_",
          fieldId: "148008076",
          fieldType: "text",
          value: "_ABSTRACT_",
          statusMessages: [
            {
              severity: "info",
              message: "Stored value: 'any value will do'.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should return TUiEvaluationObject[] with status message indicating required and empty (statusMessage[].severity: 'warn'), if datum undefined and not required.", () => {
      const modifiedFieldJson = {
        ...fieldJson,
        ...{ required: "1" },
      } as unknown as TFsFieldAny;

      const evaluator = new TestSubfieldEvaluator(modifiedFieldJson);
      const actual = evaluator.getUiPopulateObjects(undefined);
      expect(actual).toStrictEqual([
        {
          uiid: "_ABSTRACT_",
          fieldId: "148008076",
          fieldType: "text",
          value: "_ABSTRACT_",
          statusMessages: [
            {
              severity: "info",
              message: "Stored value: '__EMPTY_AND_REQUIRED__'.",
              relatedFieldIds: [],
            },
            // {
            //   fieldId: "148008076",
            //   severity: "warn",
            //   message:
            //     "Submission data missing and required.  This is not an issue if the field is hidden by logic.",
            //   relatedFieldIds: [],
            // },
          ],
        },
      ]);
    });
    it("Should return TUiEvaluationObject[] with status message indicating empty, if datum undefined and is required.", () => {
      const evaluator = new TestSubfieldEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects(undefined);
      expect(actual).toStrictEqual([
        {
          uiid: "_ABSTRACT_",
          fieldId: "148008076",
          fieldType: "text",
          value: "_ABSTRACT_",
          statusMessages: [
            {
              severity: "info",
              message: "Stored value: '__NO_SUBMISSION_DATA__'.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
  });
});

const fieldJson = Object.freeze({
  id: "148008076",
  label: "Short Answer - Copy",
  hide_label: "0",
  description: "",
  name: "short_answer__copy",
  type: "text",
  options: "",
  required: "0",
  uniq: "0",
  hidden: "0",
  readonly: "0",
  colspan: "1",
  sort: "3",
  logic: null,
  calculation: "",
  workflow_access: "write",
  default: "",
  text_size: 50,
  minlength: 0,
  maxlength: 0,
  placeholder: "",
  field_one_calculation: 0,
  field_two_calculation: 0,
  calculation_units: "",
  calculation_operator: "",
  calculation_type: "",
  calculation_allow_negatives: 0,
  hide_input_characters: 0,
  remove_data_from_emails: 0,
  require_confirmation: 0,
  confirmationText: "",
  restrict_data_access: 0,
}) as unknown as TFsFieldAny;
