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

    const x = FsLogicTreeDeepToJsMatcher(agTree152290560, formModel5469299);
    expect(x.toString()).toEqual(`
    
    `);
    expect(pojo).toStrictEqual({
      "153112633": {
        parentId: "153112633",
        nodeContent: {
          nodeType: "FsVirtualRootNode",
          fieldId: "153112633",
          conditional: "all",
        },
      },
      "153112633:0": {
        parentId: "153112633",
        nodeContent: {
          nodeType: "FsLogicBranchNode",
          ownerFieldId: "153112633",
          action: "show",
          conditional: "all",
        },
      },
      "153112633:1": {
        parentId: "153112633",
        nodeContent: {
          nodeType: "FsLogicErrorNode",
          rootFieldId: "153112633",
          parentFieldId: null,
          fieldId: "9153115414",
          message: 'Failed to find fieldId in form. fieldId: "9153115414".',
          dependentChainFieldIds: ["153112633"],
        },
      },
    });
    // 5487084
  });
});
