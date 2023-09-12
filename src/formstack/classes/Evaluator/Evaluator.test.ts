import { FieldTypeUnknownError } from "../../errors/FieldTypeUnknownError";
import { TFsFieldAny, TFsFieldType } from "../../type.field";
import { AbstractEvaluator } from "./AbstractEvaluator";
import { Evaluator } from "./Evaluator";
import { GenericEvaluator } from "./GenericEvaluator";
import allFieldTypesFormJson from "../../../test-dev-resources/form-json/allFields.json";
import { TFsFieldAnyJson } from "../types";
import { NonValueEvaluator } from "./NonValueEvaluator";
import { ProductEvaluator } from "./ProductEvaluator";
import { TUiEvaluationObject } from "./type";

const allFieldTypes = [
  "address",
  "checkbox",
  "creditcard",
  "datetime",
  "email",
  "embed",
  "file",
  "matrix",
  "section",
  "select",
  "signature",
  "text",
  "textarea",
  "name",
  "number",
  "phone",
  "product",
  "radio",
  "rating",
  "richtext",
];
const fieldIdByType: { [dataType in TFsFieldType]: string } = {
  address: "147738157",
  checkbox: "147738164",
  creditcard: "147738165",
  datetime: "147738166",

  email: "147738158",
  embed: "147738170",
  file: "147738167",

  matrix: "147738168",
  name: "147738156",
  number: "147738160",

  phone: "147738159",
  product: "147738171",
  rating: "147738173",
  radio: "147738163",
  richtext: "147738169",
  section: "149279532",
  select: "147738162",
  signature: "147738172",
  text: "147738154",
  textarea: "147738155",
};

describe("Evaluator", () => {
  describe("Evaluator.getEvaluatorWithFieldJson()", () => {
    it("should return evaluator for any field type.", () => {
      for (let i = 0; i < allFieldTypes.length; i++) {
        let evaluator = Evaluator.getEvaluatorWithFieldJson({
          type: allFieldTypes[i],
        } as TFsFieldAny);

        expect(evaluator).toBeInstanceOf(AbstractEvaluator);
      }
      // const x [keyof TFsFieldType];
    });
    it("should throw error for unknown field type.", () => {
      const willThrow = () => {
        // @ts-ignore - unknown type
        const evaluator = Evaluator.getEvaluatorWithFieldJson({
          type: "unknown-field-type",
        } as TFsFieldAny);
      };
      expect(willThrow).toThrow(
        new FieldTypeUnknownError("Unknown field type: 'unknown-field-type'.")
      );
    });
    it('Should return GenericEvaluator for field type: "file".', () => {
      let evaluator = Evaluator.getEvaluatorWithFieldJson(
        getFieldByType("file")
      );

      expect(evaluator).toBeInstanceOf(GenericEvaluator);
      const actual = evaluator.evaluateWithValues({
        "147738167":
          "https://www.formstack.com/admin/download/file/15008940499",
      });

      const expected = {
        "147738167":
          "https://www.formstack.com/admin/download/file/15008940499",
      };
      expect(actual).toStrictEqual(expected);
    });
    it('Should return GenericEvaluator for field type: "signature".', () => {
      let evaluator = Evaluator.getEvaluatorWithFieldJson(
        getFieldByType("signature")
      );

      expect(evaluator).toBeInstanceOf(GenericEvaluator);
      const actual = evaluator.evaluateWithValues({
        "147738172":
          "https://www.formstack.com/admin/download/file/15031945279",
      });

      const expected = {
        "147738172":
          "https://www.formstack.com/admin/download/file/15031945279",
      };
      expect(actual).toStrictEqual(expected);
    });
    it('Should return GenericEvaluator for field type: "textarea".', () => {
      let evaluator = Evaluator.getEvaluatorWithFieldJson(
        getFieldByType("textarea")
      );

      expect(evaluator).toBeInstanceOf(GenericEvaluator);
      const actual = evaluator.evaluateWithValues({
        "147738155":
          "645 Large Answer field can support big text and multiple lines",
      });

      const expected = {
        "147738155":
          "645 Large Answer field can support big text and multiple lines",
      };
      expect(actual).toStrictEqual(expected);
    });
    it('Should return GenericEvaluator for field type: "phone".', () => {
      let evaluator = Evaluator.getEvaluatorWithFieldJson(
        getFieldByType("phone")
      );

      expect(evaluator).toBeInstanceOf(GenericEvaluator);
      const actual = evaluator.evaluateWithValues({
        "147738159": "(323) 555-1212",
      });

      const expected = {
        "147738159": "(323) 555-1212",
      };
      expect(actual).toStrictEqual(expected);
    });
    //
    it('Should return NonValueEvaluator for field type: "embed".', () => {
      let evaluator = Evaluator.getEvaluatorWithFieldJson(
        getFieldByType("embed")
      );

      expect(evaluator).toBeInstanceOf(NonValueEvaluator);
      const actual = evaluator.evaluateWithValues("Any value will do.");

      const expected = null;
      expect(actual).toStrictEqual(expected);
    });

    it('Should return NonValueEvaluator for field type: "section".', () => {
      let evaluator = Evaluator.getEvaluatorWithFieldJson(
        getFieldByType("section")
      );

      expect(evaluator).toBeInstanceOf(NonValueEvaluator);
      const actual = evaluator.evaluateWithValues("Any value will do.");

      const expected = null;
      expect(actual).toStrictEqual(expected);
    });
    it('Should return NonValueEvaluator for field type: "richtext".', () => {
      let evaluator = Evaluator.getEvaluatorWithFieldJson(
        getFieldByType("richtext")
      );

      expect(evaluator).toBeInstanceOf(NonValueEvaluator);
      const actual = evaluator.evaluateWithValues("Any value will do.");

      const expected = null;
      expect(actual).toStrictEqual(expected);
    });
    it('Should return NonValueEvaluator for field type: "creditcard".', () => {
      let evaluator = Evaluator.getEvaluatorWithFieldJson(
        getFieldByType("creditcard")
      );

      expect(evaluator).toBeInstanceOf(NonValueEvaluator);
      const actual = evaluator.evaluateWithValues("Any value will do.");

      const expected = null;
      expect(actual).toStrictEqual(expected);
    });
    it('Should return xxx for field type: "product".', () => {
      let evaluator = Evaluator.getEvaluatorWithFieldJson(
        getFieldByType("product")
      );

      expect(evaluator).toBeInstanceOf(ProductEvaluator);
      const actual = evaluator.evaluateWithValues(
        "charge_type = fixed_amount\nquantity = 7\nunit_price = 3.99\ntotal = 27.93"
      );

      const expected = {
        charge_type: "fixed_amount",
        quantity: "7",
        unit_price: "3.99",
        total: "27.93",
      };
      expect(actual).toStrictEqual(expected);
    });
  });
  describe("[evaluator].getUiPopulateObject(...)", () => {
    it("Should return status message if required and empty submission data", () => {
      [
        // "address",
        // "checkbox",
        // "creditcard",
        // "datetime",
        // "email",
        // "embed",
        // "file",
        // "matrix",
        // "section",
        // "select",
        // "signature",
        "text",
        "textarea",
        // "name",
        // "number",
        // "phone",
        // "product",
        // "radio",
        // "rating",
        // "richtext",
      ].forEach((fieldType) => {
        const fieldJson = {
          ...getFieldByType(fieldType as TFsFieldType),
          ...{ required: "1" },
        } as unknown as TFsFieldAny;

        const evaluator = Evaluator.getEvaluatorWithFieldJson(fieldJson);
        const uiElements = evaluator.getUiPopulateObject();
        const parentUiElement = uiElements.find(
          (uiElement) =>
            uiElement.uiid === null && uiElement.fieldId === fieldJson.id
        ) as TUiEvaluationObject;

        const missingAndRequiredStatusMessage =
          parentUiElement.statusMessages.find(
            (statusMessage) =>
              statusMessage.message ===
              "Submission data missing and required.  This is not an issue if the field is hidden by logic."
          );
        expect(missingAndRequiredStatusMessage).toStrictEqual({
          fieldId: fieldJson.id,
          severity: "warn",
          message:
            "Submission data missing and required.  This is not an issue if the field is hidden by logic.",
          relatedFieldIds: [],
        });
      });
    });
  });
});

const getFieldByType = (fieldType: keyof typeof fieldIdByType) => {
  return getFieldJsonByIdFromAllFields(fieldIdByType[fieldType]);
};

const getFieldJsonByIdFromAllFields = (fieldId: string): TFsFieldAny => {
  const fieldJson = allFieldTypesFormJson.fields.find(
    (fieldJson) => fieldJson.id === fieldId
  );

  if (fieldJson === undefined) {
    throw Error(`Could not find field with id: '${fieldId}'`);
  }

  return fieldJson as unknown as TFsFieldAny;
};
