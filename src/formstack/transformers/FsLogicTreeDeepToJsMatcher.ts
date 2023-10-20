import { FsFormModel, FsLogicTreeDeep } from "../classes/subtrees";
import { Evaluator } from "../classes/Evaluator";
import { TFsLeafOperators } from "../classes/subtrees/types";
import {
  FsCircularDependencyNode,
  FsCircularMutualExclusiveNode,
  FsCircularMutualInclusiveNode,
  FsLogicBranchNode,
  FsLogicLeafNode,
} from "../classes/subtrees/trees/FsLogicTreeDeep";
import { FsVirtualRootNode } from "../classes/subtrees/trees/FsLogicTreeDeep/LogicNodes/FsVirtualRootNode";
import { TFsFieldType } from "../type.field";

const FsLogicTreeDeepToJsMatcher = (
  tree: FsLogicTreeDeep,
  formModel: FsFormModel
): Function => {
  let fnBody = "";
  const fnParameterName = "_sd";
  const parameterCommentString = tree
    .getDependentFieldIds()
    .map((fieldId) => {
      const fieldModel = formModel.getFieldTreeByFieldIdOrThrow(fieldId);
      const evaluator = Evaluator.getEvaluatorWithFieldJson(
        fieldModel.fieldJson
      );
      return `// ${fnParameterName}['${fieldId}'], type: ${
        fieldModel?.fieldType
      }, label '${fieldModel?.label.substring(0, 99)}'`;
    })
    .join("\n");

  let jsExpression = transformTreeAt(tree, formModel, tree.rootNodeId, 0);
  fnBody += `${parameterCommentString}\nreturn(\n ${jsExpression} \n);`;
  // console.log({ fnBody });
  // console.log(fnBody);
  const fn = new Function(fnParameterName, fnBody);

  return fn;
};

const quoteEnclose = (value: string, fieldType: TFsFieldType) => {
  switch (fieldType) {
    case "datetime":
      return "new Date(value)"; // this may be a bad idea

    default:
      return `'${value}'`;
  }
};
const tab = (count: number) => "\t".repeat(count);
const transformTreeAt = (
  tree: FsLogicTreeDeep,
  formModel: FsFormModel,
  nodeId: string,
  tabCount: number
): string => {
  const rootNodeContent = tree.getChildContentAt(nodeId);
  if (rootNodeContent instanceof FsLogicLeafNode) {
    const { fieldType } = formModel.getFieldTreeByFieldIdOrThrow(
      rootNodeContent.fieldId
    );
    const value = quoteEnclose(rootNodeContent.option, fieldType);
    const operator = transformOperator(rootNodeContent.condition);
    return `(_sd['${rootNodeContent.fieldId}'] ${operator} ${value})`;
  }

  if (
    rootNodeContent instanceof FsLogicBranchNode ||
    rootNodeContent instanceof FsVirtualRootNode
  ) {
    const x = tree.getChildrenNodeIdsOf(nodeId);
    return (
      `(\n` +
      tree
        .getChildrenNodeIdsOf(nodeId)
        .map(
          (childNodeId) =>
            `\n${tab(tabCount)}` +
            transformTreeAt(tree, formModel, childNodeId, tabCount++)
        )
        .join(`\n && `) +
      `\n)`
    );
  }

  return ""; // what shall we do with virtual and/or error nodes?
};

export { FsLogicTreeDeepToJsMatcher };

const transformOperator = (operator: TFsLeafOperators): TFsJsOperators => {
  switch (operator) {
    case "lessthan":
    case "lt": // numeric operators
    case "$lte":
      return "<";

    case "$gte":
    case "greaterthan":
    case "gt": // numeric operators
      return ">";

    case "dateIsEqual":
    case "equals":
    case "==": // numeric operators
      return "==";

    case "dateIsNotEqual":
    case "notequals":
    case "!=": // numeric operators
      return "!=";

    case "dateAfter":
    case "dateBefore":
    case "dateIsNotBetween": // (range)
    case "dateIsBetween": // (range);
      return "?";
  }
};

type TFsJsOperators =
  // these probably need to be confirmed
  | "<" // numeric operators
  | ">" // numeric operators
  | "==" // numeric operators
  | "!=" // numeric operators
  | "dateIsNotBetween" // (range)
  | "dateIsBetween" // (range);
  //   | "dateIsEqual"  I guess '=='
  // | "dateIsNotEqual"
  // | "dateAfter"
  // | "dateBefore"
  // | "equals"
  // | "notequals"
  // | "lessthan"
  // | "$gte"
  // | "greaterthan"
  // | "$lte";
  | "?"; // unknown operator, place filler until dates get worked out
