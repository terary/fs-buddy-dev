import { TFsFieldAny } from "../../type.field";
import { AddressEvaluator } from "./AddressEvaluator";
import { GenericEvaluator } from "./GenericEvaluator";
import { IEValuator } from "./IEvaluator";
import { MultiSelectEvaluator } from "./MultiSelectEvaluator";
import { NumericOnlyEvaluator } from "./NumericOnlyEvaluator";
import { NameEvaluator } from "./NameEvaluator";
import { FieldTypeUnknownError } from "../../errors/FieldTypeUnknownError";
import { MatrixEvaluator } from "./MatrixEvaluator";
import { NonValueEvaluator } from "./NonValueEvaluator";
import { ProductEvaluator } from "./ProductEvaluator";
import { DateEvaluator } from "./DateEvaluator";
import { CheckboxEvaluator } from "./CheckboxEvaluator";

class Evaluator {
  static getEvaluatorWithFieldJson(fieldJson: TFsFieldAny): IEValuator {
    switch (fieldJson.type) {
      case "address":
        return new AddressEvaluator(fieldJson);
      case "name":
        return new NameEvaluator(fieldJson);
      case "matrix":
        return new MatrixEvaluator(fieldJson);
      case "product":
        return new ProductEvaluator(fieldJson);

      case "number":
      case "rating":
        return new NumericOnlyEvaluator(fieldJson);

      case "checkbox":
        return new CheckboxEvaluator(fieldJson);
      case "radio":
      case "select":
        return new MultiSelectEvaluator(fieldJson);

      case "datetime":
        return new DateEvaluator(fieldJson);

      case "email":
      case "file":
      case "phone":
      case "signature":
      case "text":
      case "textarea":
        return new GenericEvaluator(fieldJson);

      case "creditcard":
      case "embed":
      case "richtext":
      case "section":
        return new NonValueEvaluator(fieldJson);

      default:
        throw new FieldTypeUnknownError(
          `Unknown field type: '${fieldJson.type}'.`
        );
    }
  }
}
export { Evaluator };
