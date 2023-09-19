import { NamedSubfieldEvaluator } from "./NamedSubfieldEvaluator";

class AddressEvaluator extends NamedSubfieldEvaluator {
  protected _supportedSubfieldIds: string[] = [
    "address",
    "address2",
    "city",
    "state",
    "zip",
    "country",
  ];
}

export { AddressEvaluator };
