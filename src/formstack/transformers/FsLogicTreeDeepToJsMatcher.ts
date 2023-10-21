import { FsFormModel, FsLogicTreeDeep } from "../classes/subtrees";
import { Evaluator } from "../classes/Evaluator";
import {
  TFsJunctionOperators,
  TFsLeafOperators,
  TFsLogicNode,
} from "../classes/subtrees/types";
import {
  FsCircularDependencyNode,
  FsCircularMutualExclusiveNode,
  FsCircularMutualInclusiveNode,
  FsLogicBranchNode,
  FsLogicLeafNode,
} from "../classes/subtrees/trees/FsLogicTreeDeep";
import { FsVirtualRootNode } from "../classes/subtrees/trees/FsLogicTreeDeep/LogicNodes/FsVirtualRootNode";
import { TFsFieldType } from "../type.field";

const getParameterCommentBlock = (
  tree: FsLogicTreeDeep,
  formModel: FsFormModel,
  fnParameterName: string
) => {
  const parameterCommentString = tree
    // .getDependentFieldIds()
    .getAllLeafContents()
    .map((leafNodeContent) => {
      const { fieldId } = leafNodeContent;
      const fieldModel = formModel.getFieldTreeByFieldIdOrThrow(fieldId);
      // const evaluator = Evaluator.getEvaluatorWithFieldJson(
      //   fieldModel.fieldJson
      // );
      return `// ${fnParameterName}['${fieldId}'], type: ${
        fieldModel?.fieldType
      }, label '${fieldModel?.label.substring(0, 99)}'`;
    })
    .join("\n");
  return parameterCommentString;
};

const FsLogicTreeDeepToJsMatcher = (
  tree: FsLogicTreeDeep,
  formModel: FsFormModel,
  atNodeId?: string
): Function => {
  let fnBody = "";
  const fnParameterName = "_sd";
  const parameterCommentString = getParameterCommentBlock(
    tree,
    formModel,
    fnParameterName
  );
  let jsExpression = transformTreeAt(
    tree,
    formModel,
    atNodeId || tree.rootNodeId,
    0
  );
  fnBody += `${parameterCommentString}\nreturn(\n ${jsExpression}\n);`;
  // console.log({ fnBody });
  console.log(fnBody);
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
const tabCharacter = " ";
// const tabCharacter = "\t";
const tab = (count: number = 0) => tabCharacter.repeat(count > 0 ? count : 0);

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
    const operator = transformLeafOperator(rootNodeContent.condition);
    return `(_sd['${rootNodeContent.fieldId}'] ${operator} ${value})`;
  }

  if (
    rootNodeContent instanceof FsLogicBranchNode ||
    rootNodeContent instanceof FsVirtualRootNode
  ) {
    const x =
      `${tab(tabCount + 1)}(\n${tab(tabCount + 3)} ` +
      // `\n${tab(tabCount + 2)}(` +
      // `\n${tab(tabCount + 2)}` +
      tree
        .getChildrenNodeIdsOf(nodeId)
        .map((childNodeId, index) =>
          transformTreeAt(tree, formModel, childNodeId, tabCount++)
        )
        .join(
          `\n${tab(tabCount)} ${transformJunctionOperator(
            rootNodeContent.conditional
          )} `
        ) +
      `\n${tab(tabCount - 2)})`;
    return x;
    // return (
    //   `${tab(tabCount)}` +
    //   tree
    //     .getChildrenNodeIdsOf(nodeId)
    //     .map((childNodeId, index) =>
    //       transformTreeAt(tree, formModel, childNodeId, tabCount++)
    //     )
    //     .join(`\n && `)
    // );
  }

  return ""; // what shall we do with virtual and/or error nodes?
};

export { FsLogicTreeDeepToJsMatcher };

const transformJunctionOperator = (
  operator: TFsJunctionOperators
): TFsJsJunctionOperators => {
  if (operator == "any") {
    return "||";
  }
  return "&&";
};
const transformLeafOperator = (
  operator: TFsLeafOperators
): TFsJsLeafOperators => {
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
type TFsJsJunctionOperators = "&&" | "||";
type TFsJsLeafOperators =
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
