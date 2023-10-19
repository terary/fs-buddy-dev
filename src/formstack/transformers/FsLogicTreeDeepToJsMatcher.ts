import { FsFormModel, FsLogicTreeDeep } from "../classes/subtrees";
import { Evaluator } from "../classes/Evaluator";
// import { TransformToJsVisitor } from "./TransformToJsVisitor";
import { AbstractLogicNode } from "../classes/subtrees/trees/FsLogicTreeDeep/LogicNodes/AbstractLogicNode";
import { TFsFieldLogicNode, TFsLogicNode } from "../classes/subtrees/types";
import { ITreeVisitor } from "predicate-tree-advanced-poc/dist/src";

const FsLogicTreeDeepToJsMatcher = (
  tree: FsLogicTreeDeep,
  formModel: FsFormModel
): Function => {
  let fnBody = "";
  const parameterCommentString = tree
    .getDependentFieldIds()
    .map((fieldId) => {
      const fieldModel = formModel.getFieldTreeByFieldIdOrThrow(fieldId);
      const evaluator = Evaluator.getEvaluatorWithFieldJson(
        fieldModel.fieldJson
      );
      return `// '${fieldId}', type: ${
        fieldModel?.fieldType
      }, label '${fieldModel?.label.substring(0, 99)}'`;
    })
    .join("\n");

  // need to clone if we're going to use visitor to mutate tree
  //   const jsConverterVisitor = new TransformToJsVisitor<TFsLogicNode>();
  //   tree.visitAll(jsConverterVisitor);

  fnBody += parameterCommentString;
  const fn = new Function("submissionData", fnBody);

  return fn;
};

export { FsLogicTreeDeepToJsMatcher };
