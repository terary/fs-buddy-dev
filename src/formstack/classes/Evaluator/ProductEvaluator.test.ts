import { TFsFieldAny } from "../../type.field";
import { ProductEvaluator } from "./ProductEvaluator";
describe("ProductEvaluator", () => {
  describe(".getUiPopulateObjects(...)", () => {
    it("Should return array of TUiEvaluationObject object when there is submission data.(ideal)", () => {
      const evaluator = new ProductEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects(submissionData.value);
      expect(actual).toStrictEqual([
        {
          uiid: "field147738171",
          fieldId: "147738171",
          fieldType: "product",
          value: "7",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738171",
              message:
                "Stored value: 'charge_type = fixed_amount\\nquantity = 7\\nunit_price = 3.99\\ntotal = 27.93'.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should return TUiEvaluationObject[], including status message for empty (undefined) submission data.", () => {
      const evaluator = new ProductEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects(undefined);
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738171",
          fieldType: "product",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738171",
              message: "Stored value: '__NO_SUBMISSION_DATA__'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738171",
              message:
                "Failed to parse field. Product did not parse correctly. submissionDatum: 'undefined'.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should return TUiEvaluationObject[], including status message for empty and require submission data.", () => {
      const fieldJsonRequired = { ...fieldJson, ...{ required: "1" } };
      const evaluator = new ProductEvaluator(fieldJsonRequired);
      const actual = evaluator.getUiPopulateObjects(undefined);
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738171",
          fieldType: "product",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738171",
              message: "Stored value: '__EMPTY_AND_REQUIRED__'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738171",
              message:
                "Failed to parse field. Product did not parse correctly. submissionDatum: 'undefined'.",
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738171",
              message:
                "Submission data missing and required.  This is not an issue if the field is hidden by logic.",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
    it("Should return TUiEvaluationObject[], including status message corrupt/broken submission data.", () => {
      const evaluator = new ProductEvaluator(fieldJson);
      const actual = evaluator.getUiPopulateObjects({
        something: "that is not shaped like a product",
      });
      expect(actual).toStrictEqual([
        {
          uiid: null,
          fieldId: "147738171",
          fieldType: "product",
          value: "",
          statusMessages: [
            {
              severity: "info",
              fieldId: "147738171",
              message:
                'Stored value: \'{"something":"that is not shaped like a product"}\'.',
              relatedFieldIds: [],
            },
            {
              severity: "warn",
              fieldId: "147738171",
              message:
                "_BAD_DATA_TYPE_' type: 'object', value: '{\"something\":\"that is not shaped like a product\"}'",
              relatedFieldIds: [],
            },
          ],
        },
      ]);
    });
  });
});

const submissionData = {
  field: "147738171",
  value:
    "charge_type = fixed_amount\nquantity = 7\nunit_price = 3.99\ntotal = 27.93",
};
const fieldJson = {
  id: "147738171",
  label: "Event/Product",
  hide_label: "0",
  description: "Event description goes here...",
  name: "eventproduct",
  type: "product",
  options: "",
  required: "0",
  uniq: "0",
  hidden: "0",
  readonly: "0",
  colspan: "1",
  sort: "20",
  logic: null,
  calculation: "",
  workflow_access: "write",
  default: "",
  charge_type: "fixed_amount",
  currency: "local",
  image: "",
  inventory: "",
  inventory_mode: "unlimited",
  unit_price: "3.99",
  min_quantity: 1,
  max_quantity: 10,
  soldout_action: "message",
  is_soldout: false,
  display: "default",
} as unknown as TFsFieldAny;
