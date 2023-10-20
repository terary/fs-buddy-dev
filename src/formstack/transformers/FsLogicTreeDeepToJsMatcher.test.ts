import { FsLogicTreeDeepToJsMatcher } from "./FsLogicTreeDeepToJsMatcher";
import formJson5469299 from "../../test-dev-resources/form-json/5469299.json";
import { FsFormModel } from "../classes/subtrees";
import { transformers } from ".";
import { TApiFormJson } from "../type.form";

describe("FsLogicTreeDeepToJsMatcher", () => {
  it.only("Should return branch with leafs.", () => {
    const formModel5469299 = FsFormModel.fromApiFormJson(
      transformers.formJson(formJson5469299 as unknown as TApiFormJson)
    );

    const agTree152290560 = formModel5469299.aggregateLogicTree("152290560"); // A) Ideal - two children
    const pojo = agTree152290560.toPojoAt(undefined, false);

    const matcherFunction = FsLogicTreeDeepToJsMatcher(
      agTree152290560,
      formModel5469299
    );
    // const y = x.toString();
    // console.log(x.toString());
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

    console.log(matcherFunction.toString());
    const x = matcherFunction.toString();
    expect(matcherFunction.toString()).not.toEqual(
      `function anonymous(submissionData
) {
// '152290560', type: checkbox, label 'A (ideal)'
// '152290561', type: checkbox, label 'A.0 (ideal)'
// '152290564', type: checkbox, label 'B.0 (ideal)'
}`
    );
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
