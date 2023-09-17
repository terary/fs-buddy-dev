import { TFsFieldAny } from "../../type.field";
import { ProductEvaluator } from "./ProductEvaluator";

describe("ProductEvaluator", () => {
  describe(".evaluateWithValues(...)", () => {
    it("Should parse submittedData", () => {
      //
      const evaluator = new ProductEvaluator(fieldJson);
      const actual = evaluator.evaluateWithValues(submissionData.value);
      expect(actual).toStrictEqual({
        charge_type: "fixed_amount",
        quantity: "7",
        unit_price: "3.99",
        total: "27.93",
      });
    });
    it("Should quietly ignore bad data if possible (non parsable string)", () => {
      //
      const evaluator = new ProductEvaluator(fieldJson);
      const testValue =
        "Something that does not belong\n" + submissionData.value;
      const actual = evaluator.evaluateWithValues(testValue);
      expect(actual).toStrictEqual({
        "Something that does not belong": "",
        charge_type: "fixed_amount",
        quantity: "7",
        unit_price: "3.99",
        total: "27.93",
      });
    });
    it("Should quietly ignore bad data if possible (unrecognized subfieldId)", () => {
      //
      const evaluator = new ProductEvaluator(fieldJson);
      const testValue = "unknownSubfield = unknown\n" + submissionData.value;
      const actual = evaluator.evaluateWithValues(testValue);
      expect(actual).toStrictEqual({
        charge_type: "fixed_amount",
        quantity: "7",
        unit_price: "3.99",
        total: "27.93",
        unknownSubfield: "unknown",
      });
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
