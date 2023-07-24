import { FsTreeField } from "../FsTreeField";
import { FsTreeLogic } from "../FsTreeLogic";

type TVisibilityFunction = (values: { [fieldId: string]: any }) => boolean;

class FsFieldVisibilityLinkNode {
  private _isUltimatelyFn: TVisibilityFunction;
  private _parentNode?: FsTreeField;
  constructor(
    isUltimatelyFn: TVisibilityFunction,
    parentSection?: FsTreeField
  ) {
    this._isUltimatelyFn = isUltimatelyFn;
    this._parentNode = parentSection;
  }

  get parentNode() {
    return this._parentNode;
  }
  get isUltimately() {
    // *tmc* this is vector to create/traverse
    // infinite-loop/circular logic.
    //
    // Need to put dependancy guard, throws error 'ErrorCircularLogic'
    return this._isUltimatelyFn;
  }
}

export { FsFieldVisibilityLinkNode };
