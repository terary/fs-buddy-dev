import { TFsFieldAny } from "../../type.field";
import { AddressEvaluator } from "./AddressEvaluator";
import { ScalarEvaluator } from "./ScalarEvaluator";
import { NameEvaluator } from "./NameEvaluator";
import { FieldTypeUnknownError } from "../../errors/FieldTypeUnknownError";
import { MatrixEvaluator } from "./MatrixEvaluator";
import { CheckboxEvaluator } from "./CheckboxEvaluator";
import { RadioEvaluator } from "./RadioEvaluator";
import { SelectEvaluator } from "./SelectEvaluator";
import { DateEvaluator } from "./DateEvaluator";
import { ProductEvaluator } from "./ProductEvaluator";
import { NumberEvaluator } from "./NumberEvaluator";
import { NonValueEvaluator } from "./NonValueEvaluator";
import { IEValuator } from "./IEvaluator";
//

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
        return new NumberEvaluator(fieldJson);

      case "checkbox":
        return new CheckboxEvaluator(fieldJson);
      case "radio":
        return new RadioEvaluator(fieldJson);
      case "select":
        return new SelectEvaluator(fieldJson);

      case "datetime":
        return new DateEvaluator(fieldJson);

      case "email":
      case "file":
      case "phone":
      case "signature":
      case "text":
      case "textarea":
        return new ScalarEvaluator(fieldJson);

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
