import { FsLogicTreeDeepToJsMatcher } from "./FsLogicTreeDeepToJsMatcher";
import formJson5469299 from "../../test-dev-resources/form-json/5469299.json";
import { FsFormModel } from "../classes/subtrees";
import { transformers } from ".";
import { TApiFormJson } from "../type.form";
import { FsLogicLeafNode } from "../classes/subtrees/trees/FsLogicTreeDeep";

describe("FsLogicTreeDeepToJsMatcher", () => {
  it("Should return a matcher for simple one leaf and panel logic with one leaf.", () => {
    const formModel5469299 = FsFormModel.fromApiFormJson(
      transformers.formJson(formJson5469299 as unknown as TApiFormJson)
    );

    const agTree152586428 = formModel5469299.aggregateLogicTree("152586428"); //Non conflict - short answer
    const childrenId = agTree152586428.getChildrenNodeIdsOf(
      agTree152586428.rootFieldId
    );

    const matcherFunction = FsLogicTreeDeepToJsMatcher(
      agTree152586428,
      formModel5469299,
      agTree152586428.rootFieldId
    );
    const trueValues = {
      "152290551": "Neutral",
      "152293117": "Zero",
    };
    const falseValues = {
      "152290551": "NotNeutral",
      "152293117": "Zero",
    };

    console.log(matcherFunction.toString());
    expect(matcherFunction(trueValues)).toStrictEqual(true);
    expect(matcherFunction(falseValues)).toStrictEqual(false);

    expect(matcherFunction.toString()).not.toEqual(
      `function anonymous(_sd
) {
// _sd['152290561'], type: checkbox, label 'A.0 (ideal)'
// _sd['152290564'], type: checkbox, label 'B.0 (ideal)'
return(
  (
    (_sd['152290561'] == 'True')
   && (_sd['152290564'] == 'True')
)
);
}`
    );
  });
  it("Should return a matcher for simple two leaf, no panel logic.", () => {
    const formModel5469299 = FsFormModel.fromApiFormJson(
      transformers.formJson(formJson5469299 as unknown as TApiFormJson)
    );

    const agTree152290560 = formModel5469299.aggregateLogicTree("152290560"); // A) Ideal - two children
    const childrenId = agTree152290560.getChildrenNodeIdsOf(
      agTree152290560.rootFieldId
    );

    const matcherFunction = FsLogicTreeDeepToJsMatcher(
      agTree152290560,
      formModel5469299,
      childrenId[0]
    );
    const trueValues = {
      "152290561": "True",
      "152290564": "True",
    };
    const falseValues = {
      "152290561": "NotTrue",
      "152290564": "True",
    };

    expect(matcherFunction(trueValues)).toStrictEqual(true);
    expect(matcherFunction(falseValues)).toStrictEqual(false);

    // const x = matcherFunction.toString();
    // console.log(matcherFunction.toString());

    // this is an issue because 'A' is a branch
    expect(matcherFunction.toString()).toEqual(
      `function anonymous(_sd
) {
// _sd['152290561'], type: checkbox, label 'A.0 (ideal)'
// _sd['152290564'], type: checkbox, label 'B.0 (ideal)'
return(
  (
    (_sd['152290561'] == 'True')
   && (_sd['152290564'] == 'True')
)
);
}`
    );
  });
  it.only("Dev/Debug.", () => {
    const formModel5469299 = FsFormModel.fromApiFormJson(
      transformers.formJson(formJson5469299 as unknown as TApiFormJson)
    );

    const agTree153413615 = formModel5469299.aggregateLogicTree("153413615"); // Short Answer / Redundant - non conflict
    // const newLeaf = new FsLogicLeafNode("152290564", "$gte", "one");
    // const childrenId = agTree152290560.getChildrenNodeIdsOf(
    //   agTree152290560.rootFieldId
    // );
    // agTree152290560.appendChildNodeWithContent(childrenId[0], newLeaf);

    // two paths forward:
    // A) Optimize tree
    // B) When encounter single child - duplicate it.  Effectively will have no effect

    // ** More important **
    // Why are the system/error messages not show for panels
    // Why are the circular node errors showing on logic (see 153413615 vs. the tree - there are two circular ref that dont show)
    // Need to resolve circular ref better - if parent is and/or ...

    const matcherFunction = FsLogicTreeDeepToJsMatcher(
      agTree153413615,
      formModel5469299,
      agTree153413615.rootFieldId
    );
    const trueValues = {
      "152290561": "True",
      "152290564": "True",
    };
    const falseValues = {
      "152290561": "NotTrue",
      "152290564": "True",
    };

    console.log(matcherFunction.toString());

    expect(matcherFunction(trueValues)).toStrictEqual(true);
    expect(matcherFunction(falseValues)).toStrictEqual(false);

    const x = matcherFunction.toString();
    const pojo = agTree153413615.toPojoAt(undefined, false);
    expect(pojo).toStrictEqual({
      "152290560": {
        parentId: "152290560",
        nodeContent: {
          nodeType: "FsVirtualRootNode",
          fieldId: "152290560",
          conditional: "all",
        },
      },
      "152290560:0": {
        parentId: "152290560",
        nodeContent: {
          nodeType: "FsLogicBranchNode",
          ownerFieldId: "152290560",
          action: "show",
          conditional: "all",
        },
      },
      "152290560:0:1": {
        parentId: "152290560:0",
        nodeContent: {
          nodeType: "FsLogicLeafNode",
          fieldId: "152290561",
          condition: "equals",
          option: "True",
        },
      },
      "152290560:0:2": {
        parentId: "152290560:0",
        nodeContent: {
          nodeType: "FsLogicLeafNode",
          fieldId: "152290564",
          condition: "equals",
          option: "True",
        },
      },
    });
    // 5487084
  });
});
