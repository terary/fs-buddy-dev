import { FsLogicTreeDeep } from "./FsLogicTreeDeep";
import formJson5375703 from "../../../../../test-dev-resources/form-json/5375703.json";
import formJson5469299 from "../../../../../test-dev-resources/form-json/5469299.json";
import formJson5487084 from "../../../../../test-dev-resources/form-json/5487084.json";
import formJson5488291 from "../../../../../test-dev-resources/form-json/5488291.json";
import { FsLogicBranchNode } from "./LogicNodes/FsLogicBranchNode";
import { FsLogicLeafNode } from "./LogicNodes/FsLogicLeafNode";
import { TApiFormJson } from "../../../../type.form";
import { FsFormModel } from "../../FsFormModel";
import { transformers } from "../../../../transformers";
describe("FsLogicTreeDeep", () => {
  describe("dev / debug", () => {
    it("Should return branch with leafs.", () => {
      const tree5488291 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5488291 as unknown as TApiFormJson)
      );
      const tree5469299 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5469299 as unknown as TApiFormJson)
      );

      const deepTree153112633 = tree5488291.aggregateLogicTree("153112633");
      const smField = deepTree153112633.getStatusMessage();
      const smTree = tree5488291.getAllLogicStatusMessages();
      const deepTree152290560 = tree5469299.aggregateLogicTree("152290560"); // A) Ideal - two children
      const pojo = deepTree153112633.toPojoAt(undefined, false);
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
    it("Should convert logic with single child and 'Hide' action.", () => {
      const fieldIds = {
        show_if_switzerland_is_neutral: "153055020",
        show_if_switzerland_is_not_neutral: "153055033",
        hide_if_switzerland_is_neutral: "153055011",
        hide_if_switzerland_is_not_neutral: "153055021",
      };
      const tree5487084 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5487084 as unknown as TApiFormJson)
      );

      const hideIfNeutral = tree5487084.aggregateLogicTree(
        fieldIds.hide_if_switzerland_is_neutral
      );
      const showIfNeutral = tree5487084.aggregateLogicTree(
        fieldIds.show_if_switzerland_is_neutral
      );

      const pojo = hideIfNeutral.toPojoAt(undefined, false);
      expect(hideIfNeutral.toPojoAt(undefined, false)).toStrictEqual(
        formJson5487084Pojo["153055011"]
      );
      // 5487084
    });
    it("Should convert logic with single child and 'Hide' action.", () => {
      const fieldIds = {
        show_if_switzerland_is_neutral: "153055020",
        show_if_switzerland_is_not_neutral: "153055033",
        hide_if_switzerland_is_neutral: "153055011",
        hide_if_switzerland_is_not_neutral: "153055021",
        show_if_switzerland_is_not_neutral_and_is_not_neutral_conflict:
          "153058950",
        hide_if_switzerland_is_neutral_conflict_with_panel: "153055042",
        show_if_switzerland_is_neutral_duplicate_panel_logic: "153055077",
      };

      const tree5487084 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5487084 as unknown as TApiFormJson)
      );

      const conflictingLeaves = tree5487084.aggregateLogicTree(
        fieldIds.show_if_switzerland_is_not_neutral_and_is_not_neutral_conflict
      );
      const conflictingPanel = tree5487084.aggregateLogicTree(
        fieldIds.hide_if_switzerland_is_neutral_conflict_with_panel
      );
      const redundantWithPanel = tree5487084.aggregateLogicTree(
        fieldIds.show_if_switzerland_is_neutral_duplicate_panel_logic
      );

      const conflictingLeavesPojo = conflictingLeaves.toPojoAt(
        undefined,
        false
      );
      const conflictingPanelPojo = conflictingPanel.toPojoAt(undefined, false);
      const redundantWithPanelPojo = redundantWithPanel.toPojoAt(
        undefined,
        false
      );

      expect(conflictingLeavesPojo).toStrictEqual(
        formJson5487084Pojo["153058950"]
      );

      expect(conflictingPanelPojo).toStrictEqual(
        formJson5487084Pojo["153055042"]
      );

      expect(redundantWithPanelPojo).toStrictEqual(
        formJson5487084Pojo["153055077"]
      );
    });
  });
  describe(".getDependantFieldIds()", () => {
    it("Should be empty array for dependancy list of single node tree (new without root node).", () => {
      // const tree5375703 = FsFormModel.fromApiFormJson(
      //   transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      // );
      const tree5375703 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );
      const tree5469299 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5469299 as unknown as TApiFormJson)
      );

      const agTree152297010 = tree5469299.aggregateLogicTree("152297010");
      const pojo = {
        agTree152297010: tree5469299
          .aggregateLogicTree("152297010")
          .toPojoAt(undefined, false), // Mutually Inclusive
        agTree152293116: tree5469299
          .aggregateLogicTree("152293116")
          .toPojoAt(undefined, false), // Mutually Exclusive
        agTree152290546: tree5469299
          .aggregateLogicTree("152290546")
          .toPojoAt(undefined, false), // (B) A->B->C-D->E->A (logic)
        agTree148456742: tree5375703
          .aggregateLogicTree("148456742")
          .toPojoAt(undefined, false), // (B) A->B->C-D->E->A (logic)
        agTree148509470: tree5375703
          .aggregateLogicTree("148509470")
          .toPojoAt(undefined, false), // A (within panel)
      };

      expect(pojo).toStrictEqual(dev_debug_pojo_smoke_test);
    });
  });
});

const dev_debug_pojo_smoke_test = {
  agTree152297010: {
    "152297010": {
      parentId: "152297010",
      nodeContent: {
        nodeType: "FsVirtualRootNode",
        fieldId: "152297010",
        conditional: "all",
      },
    },
    "152297010:0": {
      parentId: "152297010",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152297010",
        action: "show",
        conditional: "all",
      },
    },
    "152297010:0:1": {
      parentId: "152297010:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152293117",
        condition: "equals",
        option: "Zero",
      },
    },
    "152297010:0:2": {
      parentId: "152297010:0",
      nodeContent: {
        nodeType: "FsCircularMutualInclusiveNode",
        ruleConflict: {
          conditionalB: {
            condition: "equals",
            option: "Zero",
            fieldId: "152293117",
          },
          conditionalA: {
            fieldId: "152293117",
            fieldJson: {
              field: 152293117,
              condition: "equals",
              option: "Zero",
            },
            condition: "equals",
            option: "Zero",
          },
        },
        sourceFieldId: "152297010",
        targetSourceId: "152293117",
        dependentChainFieldIds: ["152297010", "152293117"],
      },
    },
  },
  agTree152293116: {
    "152293116": {
      parentId: "152293116",
      nodeContent: {
        nodeType: "FsVirtualRootNode",
        fieldId: "152293116",
        conditional: "all",
      },
    },
    "152293116:0": {
      parentId: "152293116",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152293116",
        action: "show",
        conditional: "all",
      },
    },
    "152293116:0:1": {
      parentId: "152293116:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152293117",
        condition: "equals",
        option: "Zero",
      },
    },
    "152293116:0:2": {
      parentId: "152293116:0",
      nodeContent: {
        nodeType: "FsCircularMutualExclusiveNode",
        ruleConflict: {
          conditionalB: {
            condition: "equals",
            option: "Zero",
            fieldId: "152293117",
          },
          conditionalA: {
            fieldId: "152293117",
            fieldJson: {
              field: "152293117",
              condition: "equals",
              option: "One",
            },
            condition: "equals",
            option: "One",
          },
        },
        sourceFieldId: "152293116",
        targetSourceId: "152293117",
        dependentChainFieldIds: ["152293116", "152293117"],
      },
    },
  },
  agTree152290546: {
    "152290546": {
      parentId: "152290546",
      nodeContent: {
        nodeType: "FsVirtualRootNode",
        fieldId: "152290546",
        conditional: "all",
      },
    },
    "152290546:0": {
      parentId: "152290546",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290546",
        action: "show",
        conditional: "all",
      },
    },
    "152290546:1": {
      parentId: "152290546",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290547",
        action: "show",
        conditional: "all",
      },
    },
    "152290546:2": {
      parentId: "152290546",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290548",
        action: "show",
        conditional: "all",
      },
    },
    "152290546:3": {
      parentId: "152290546",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290549",
        action: "show",
        conditional: "all",
      },
    },
    "152290546:3:4": {
      parentId: "152290546:3",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290545",
        condition: "equals",
        option: "OptionA",
      },
    },
  },
  agTree148456742: {
    "148456742": {
      parentId: "148456742",
      nodeContent: {
        nodeType: "FsVirtualRootNode",
        fieldId: "148456742",
        conditional: "all",
      },
    },
    "148456742:0": {
      parentId: "148456742",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148456742",
        action: "show",
        conditional: "all",
      },
    },
    "148456742:1": {
      parentId: "148456742",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148456741",
        action: "show",
        conditional: "all",
      },
    },
    "148456742:2": {
      parentId: "148456742",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148456740",
        action: "show",
        conditional: "all",
      },
    },
    "148456742:3": {
      parentId: "148456742",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148456739",
        action: "show",
        conditional: "all",
      },
    },
    "148456742:4": {
      parentId: "148456742",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148456734",
        action: "show",
        conditional: "all",
      },
    },
    "148456742:4:5": {
      parentId: "148456742:4",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "148456742",
        targetSourceId: "148456742",
        dependentChainFieldIds: [
          "148456742",
          "148456741",
          "148456740",
          "148456739",
          "148456734",
        ],
      },
    },
  },
  agTree148509470: {
    "148509470": {
      parentId: "148509470",
      nodeContent: {
        nodeType: "FsVirtualRootNode",
        fieldId: "148509470",
        conditional: "all",
      },
    },
    "148509470:0": {
      parentId: "148509470",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148509470",
        action: "show",
        conditional: "all",
      },
    },
    "148509470:0:1": {
      parentId: "148509470:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148509478",
        condition: "equals",
        option: "True",
      },
    },
    "148509470:0:2": {
      parentId: "148509470:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148509475",
        condition: "equals",
        option: "True",
      },
    },
    "148509470:3": {
      parentId: "148509470",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148509465",
        action: "show",
        conditional: "all",
      },
    },
    "148509470:3:4": {
      parentId: "148509470:3",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "148509470",
        targetSourceId: "148509470",
        dependentChainFieldIds: [
          "148509470",
          "148509478",
          "148509475",
          "148509465",
        ],
      },
    },
    "148509470:3:9": {
      parentId: "148509470:3",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "151678347",
        condition: "equals",
        option: "Neutral",
      },
    },
    "148509470:5": {
      parentId: "148509470",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148509476",
        action: "show",
        conditional: "all",
      },
    },
    "148509470:5:6": {
      parentId: "148509470:5",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148509477",
        condition: "equals",
        option: "True",
      },
    },
    "148509470:5:7": {
      parentId: "148509470:5",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148509474",
        condition: "equals",
        option: "True",
      },
    },
    "148509470:8": {
      parentId: "148509470",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "148509470",
        targetSourceId: "148509465",
        dependentChainFieldIds: [
          "148509470",
          "148509478",
          "148509475",
          "148509465",
          "148509470",
          "148509476",
          "148509477",
          "148509474",
        ],
      },
    },
  },
};

const formJson5487084Pojo = {
  "153055011": {
    "153055011": {
      parentId: "153055011",
      nodeContent: {
        nodeType: "FsVirtualRootNode",
        fieldId: "153055011",
        conditional: "all",
      },
    },
    "153055011:0": {
      parentId: "153055011",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "153055011",
        action: "hide",
        conditional: "any",
      },
    },
    "153055011:0:1": {
      parentId: "153055011:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "153055010",
        condition: "notequals",
        option: "Neutral",
      },
    },
  },
  "153058950": {
    "153058950": {
      parentId: "153058950",
      nodeContent: {
        nodeType: "FsVirtualRootNode",
        fieldId: "153058950",
        conditional: "all",
      },
    },
    "153058950:0": {
      parentId: "153058950",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "153058950",
        action: "show",
        conditional: "all",
      },
    },
    "153058950:0:1": {
      parentId: "153058950:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "153055010",
        condition: "notequals",
        option: "Neutral",
      },
    },
    "153058950:0:2": {
      parentId: "153058950:0",
      nodeContent: {
        nodeType: "FsCircularMutualExclusiveNode",
        ruleConflict: {
          conditionalB: {
            condition: "notequals",
            option: "Neutral",
            fieldId: "153055010",
          },
          conditionalA: {
            fieldId: "153055010",
            fieldJson: {
              field: "153055010",
              condition: "equals",
              option: "Neutral",
            },
            condition: "equals",
            option: "Neutral",
          },
        },
        sourceFieldId: "153058950",
        targetSourceId: "153055010",
        dependentChainFieldIds: ["153058950", "153055010"],
      },
    },
  },
  "153055042": {
    "153055042": {
      parentId: "153055042",
      nodeContent: {
        nodeType: "FsVirtualRootNode",
        fieldId: "153055042",
        conditional: "all",
      },
    },
    "153055042:0": {
      parentId: "153055042",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "153055042",
        action: "hide",
        conditional: "any",
      },
    },
    "153055042:0:1": {
      parentId: "153055042:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "153055010",
        condition: "notequals",
        option: "Neutral",
      },
    },
    "153055042:2": {
      parentId: "153055042",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "153055041",
        action: "show",
        conditional: "all",
      },
    },
    "153055042:2:3": {
      parentId: "153055042:2",
      nodeContent: {
        nodeType: "FsCircularMutualExclusiveNode",
        ruleConflict: {
          conditionalB: {
            condition: "notequals",
            option: "Neutral",
            fieldId: "153055010",
          },
          conditionalA: {
            fieldId: "153055010",
            fieldJson: {
              field: "153055010",
              condition: "equals",
              option: "Neutral",
            },
            condition: "equals",
            option: "Neutral",
          },
        },
        sourceFieldId: "153055042",
        targetSourceId: "153055010",
        dependentChainFieldIds: ["153055042", "153055010", "153055041"],
      },
    },
  },
  "153055077": {
    "153055077": {
      parentId: "153055077",
      nodeContent: {
        nodeType: "FsVirtualRootNode",
        fieldId: "153055077",
        conditional: "all",
      },
    },
    "153055077:0": {
      parentId: "153055077",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "153055077",
        action: "show",
        conditional: "all",
      },
    },
    "153055077:0:1": {
      parentId: "153055077:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "153055010",
        condition: "equals",
        option: "Neutral",
      },
    },
    "153055077:2": {
      parentId: "153055077",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "153055041",
        action: "show",
        conditional: "all",
      },
    },
    "153055077:2:3": {
      parentId: "153055077:2",
      nodeContent: {
        nodeType: "FsCircularMutualInclusiveNode",
        ruleConflict: {
          conditionalB: {
            condition: "equals",
            option: "Neutral",
            fieldId: "153055010",
          },
          conditionalA: {
            fieldId: "153055010",
            fieldJson: {
              field: "153055010",
              condition: "equals",
              option: "Neutral",
            },
            condition: "equals",
            option: "Neutral",
          },
        },
        sourceFieldId: "153055077",
        targetSourceId: "153055010",
        dependentChainFieldIds: ["153055077", "153055010", "153055041"],
      },
    },
  },
};
