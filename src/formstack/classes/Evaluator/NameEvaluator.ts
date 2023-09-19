import { NamedSubfieldEvaluator } from "./NamedSubfieldEvaluator";

class NameEvaluator extends NamedSubfieldEvaluator {
  protected _supportedSubfieldIds = [
    "first",
    "last",
    "initial",
    "prefix",
    "suffix",
    "middle",
  ];

  // protected _supportedSubfieldIds: string[] = [
  //   "address",
  //   "address2",
  //   "city",
  //   "state",
  //   "zip",
  //   "country",
  // ];
}

export { NameEvaluator };
