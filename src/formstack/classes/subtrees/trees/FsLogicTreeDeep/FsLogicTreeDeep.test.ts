import { FsLogicTreeDeep } from "./FsLogicTreeDeep";
import formJson5375703 from "../../../../../test-dev-resources/form-json/5375703.json";
import formJson5469299 from "../../../../../test-dev-resources/form-json/5469299.json";
import formJson5487084 from "../../../../../test-dev-resources/form-json/5487084.json";
import formJson5488291 from "../../../../../test-dev-resources/form-json/5488291.json";
import expectSnapshotJson from "./FsLogicTreeDeep.snapshot.json";
import { FsLogicBranchNode } from "./LogicNodes/FsLogicBranchNode";
import { FsLogicLeafNode } from "./LogicNodes/FsLogicLeafNode";
import { TApiFormJson } from "../../../../type.form";
import { FsFormModel } from "../../FsFormModel";
import { transformers } from "../../../../transformers";
import { FsVirtualRootNode } from "./LogicNodes/FsVirtualRootNode";
import { TTreePojo } from "predicate-tree-advanced-poc/dist/src";
import { AbstractLogicNode } from "./LogicNodes/AbstractLogicNode";

describe("FsLogicTreeDeep", () => {
  // maybe action should be on vRoot and not children
  // the children labels are confusing 'show'/'hide' is not applicable on descendent branches

  describe("Pojo Smoke test.", () => {
    it.only("Smoke Test II", () => {
      const tree5469299 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5469299 as unknown as TApiFormJson)
      );
      const tree5375703 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );

      const agTree153051795 = tree5375703.aggregateLogicTree("153051795"); //Conflict with show/hide, panel/field (parent panel)
      const pojo153051795 = agTree153051795.toPojoAt(undefined, false);
      const d3FieldTable153051795 = transformers.pojoToD3TableData(
        agTree153051795.toPojoAt(undefined, false),
        tree5375703
      );

      const agTrees: { [fieldId: string]: FsLogicTreeDeep } = {};
      const pojos: { [fieldId: string]: TTreePojo<AbstractLogicNode> | null } =
        {};
      const d3Mappings: { [fieldId: string]: any } = {};
      tree5469299.getAllFieldIds().forEach((fieldId) => {
        agTrees[fieldId] = tree5469299.aggregateLogicTree(fieldId);

        if (agTrees[fieldId] === null) {
          pojos[fieldId] = null;
          d3Mappings[fieldId] = null;
        } else {
          pojos[fieldId] = agTrees[fieldId].toPojoAt(undefined, false);
          d3Mappings[fieldId] = transformers.pojoToD3TableData(
            pojos[fieldId] as TTreePojo<AbstractLogicNode>,
            tree5469299
          );
        }
      });
      tree5375703.getAllFieldIds().forEach((fieldId) => {
        agTrees[fieldId] = tree5375703.aggregateLogicTree(fieldId);
        if (agTrees[fieldId] === null) {
          pojos[fieldId] = null;
          d3Mappings[fieldId] = null;
        } else {
          pojos[fieldId] = agTrees[fieldId].toPojoAt(undefined, false);
          d3Mappings[fieldId] = transformers.pojoToD3TableData(
            pojos[fieldId] as TTreePojo<AbstractLogicNode>,
            tree5375703
          );
        }
      });

      const actualSnapshotJson = {
        // agTrees,
        pojos,
        d3Mappings,
      };

      expect(actualSnapshotJson).toStrictEqual(expectSnapshotJson);
    });
    it("Smoke Test", () => {
      const tree5469299 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5469299 as unknown as TApiFormJson)
      );
      const tree5375703 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );

      `
        newest version of circular reference is missing source/target stuff, I think?
        Doesn't work see error messages

`;

      // const agTree152290544 = tree5469299.aggregateLogicTree("152290544"); // (A) Big Dipper A->B->C->D->(B ^ E)
      // const pojo152290544 = agTree152290544.toPojoAt(undefined, false);
      // const d3FieldTable152290544 = transformers.pojoToD3TableData(
      //   agTree152290544.toPojoAt(undefined, false),
      //   tree5375703
      // );

      const agTree148604161 = tree5375703.aggregateLogicTree("148604161"); // (A) Big Dipper A->B->C->D->(B ^ E)
      const pojo148604161 = agTree148604161.toPojoAt(undefined, false);
      const d3FieldTable148604161 = transformers.pojoToD3TableData(
        agTree148604161.toPojoAt(undefined, false),
        tree5375703
      );

      const agTrees: { [fieldId: string]: FsLogicTreeDeep } = {};
      const pojos: { [fieldId: string]: TTreePojo<AbstractLogicNode> | null } =
        {};
      const d3Mappings: { [fieldId: string]: any } = {};
      tree5469299.getAllFieldIds().forEach((fieldId) => {
        agTrees[fieldId] = tree5469299.aggregateLogicTree(fieldId);

        if (agTrees[fieldId] === null) {
          pojos[fieldId] = null;
          d3Mappings[fieldId] = null;
        } else {
          pojos[fieldId] = agTrees[fieldId].toPojoAt(undefined, false);
          d3Mappings[fieldId] = transformers.pojoToD3TableData(
            pojos[fieldId] as TTreePojo<AbstractLogicNode>,
            tree5469299
          );
        }
      });
      tree5375703.getAllFieldIds().forEach((fieldId) => {
        agTrees[fieldId] = tree5375703.aggregateLogicTree(fieldId);
        if (agTrees[fieldId] === null) {
          pojos[fieldId] = null;
          d3Mappings[fieldId] = null;
        } else {
          pojos[fieldId] = agTrees[fieldId].toPojoAt(undefined, false);
          d3Mappings[fieldId] = transformers.pojoToD3TableData(
            pojos[fieldId] as TTreePojo<AbstractLogicNode>,
            tree5375703
          );
        }
      });

      const actualSnapshotJson = {
        // agTrees,
        pojos,
        d3Mappings,
      };

      expect(actualSnapshotJson).toStrictEqual(expectSnapshotJson);

      //

      const agTree152290553 = tree5469299.aggregateLogicTree("152290553"); //  "A" - Inter-dependent (fixed with 'any')
      const agTree148604236 = tree5375703.aggregateLogicTree("148604236"); // (B) Big Dipper A->B->C->D->(B ^ E)
      const agTree153413615 = tree5469299.aggregateLogicTree("153413615"); // Short Answer (non-conflict with 'any')
      const agTree152293116 = tree5469299.aggregateLogicTree("152293116"); // Mutually Exclusive
      const agTree152297010 = tree5469299.aggregateLogicTree("152297010"); // Mutually Inclusive
      const agTree152290548 = tree5469299.aggregateLogicTree("152290548"); // (D) A->B->C-D->E->A (logic)
      const agTree152586428 = tree5469299.aggregateLogicTree("152586428"); // Non conflict - short answer
      const agTree152290549 = tree5469299.aggregateLogicTree("152290549"); // (E) A->B->C-D->E->A (logic)
      const agTree152290546 = tree5469299.aggregateLogicTree("152290546"); // (B) A->B->C-D->E->A (logic)
      const agTree148509470 = tree5375703.aggregateLogicTree("148509470"); // A Inter-dependent (not so much circular)
      const agTree148456742 = tree5375703.aggregateLogicTree("148456742"); // (B) A->B->C-D->E->A (logic)

      // 148509470 - two nodes without labels

      // this appears to connect branc to leaf? sometimes circular node will have label sometimes not?

      // d3 looks ok but needs this to be fixed before it can go furhter.
      // circularNode always uses root?? I as source (or ) terget  I dont think that is correct
      const pojo152290553 = agTree152290553.toPojoAt(undefined, false);
      const d3FieldTable152290553 = transformers.pojoToD3TableData(
        agTree152290553.toPojoAt(undefined, false),
        tree5469299
      );

      const d3FieldTable148456742 = transformers.pojoToD3TableData(
        agTree148456742.toPojoAt(undefined, false),
        tree5375703
      );

      const d3FieldTable148509470 = transformers.pojoToD3TableData(
        agTree148509470.toPojoAt(undefined, false),
        tree5375703
      );

      const d3Map148604161 = transformers.pojoToD3TableData(
        agTree148604161.toPojoAt(undefined, false),
        tree5375703
      );

      const pojo = {
        pojo148604236: agTree148604236.toPojoAt(undefined, false),
        pojo152290553: agTree152290553.toPojoAt(undefined, false),
        pojo153413615: agTree153413615.toPojoAt(undefined, false),
        pojo152293116: agTree152293116.toPojoAt(undefined, false),
        pojo152297010: agTree152297010.toPojoAt(undefined, false),
        pojo152290548: agTree152290548.toPojoAt(undefined, false),
        pojo152586428: agTree152586428.toPojoAt(undefined, false),
        pojo152290549: agTree152290549.toPojoAt(undefined, false),
        pojo152290546: agTree152290546.toPojoAt(undefined, false),
        pojo148509470: agTree148509470.toPojoAt(undefined, false),
        pojo148456742: agTree148456742.toPojoAt(undefined, false),
      };

      expect(smoke_test_pojo_many_forms.pojo152290553).toStrictEqual(
        pojo.pojo152290553
      );
      expect(smoke_test_pojo_many_forms.pojo148604236).toStrictEqual(
        pojo.pojo148604236
      );
      expect(smoke_test_pojo_many_forms.pojo153413615).toStrictEqual(
        pojo.pojo153413615
      );
      expect(smoke_test_pojo_many_forms.pojo152293116).toStrictEqual(
        pojo.pojo152293116
      );
      expect(smoke_test_pojo_many_forms.pojo152297010).toStrictEqual(
        pojo.pojo152297010
      );
      expect(smoke_test_pojo_many_forms.pojo152290548).toStrictEqual(
        pojo.pojo152290548
      );
      expect(smoke_test_pojo_many_forms.pojo152586428).toStrictEqual(
        pojo.pojo152586428
      );
      expect(smoke_test_pojo_many_forms.pojo152290549).toStrictEqual(
        pojo.pojo152290549
      );
      expect(smoke_test_pojo_many_forms.pojo152290546).toStrictEqual(
        pojo.pojo152290546
      );

      expect(smoke_test_pojo_many_forms.pojo148456742).toStrictEqual(
        pojo.pojo148456742
      );

      expect(smoke_test_pojo_many_forms.pojo148509470).toStrictEqual(
        pojo.pojo148509470
      );

      expect(pojo).toStrictEqual(smoke_test_pojo_many_forms);
    });
  });

  describe("dev / debug", () => {
    it.skip("dev/debug.", () => {
      // const tree5488291 = FsFormModel.fromApiFormJson(
      //   transformers.formJson(formJson5488291 as unknown as TApiFormJson)
      // );
      const tree5469299 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5469299 as unknown as TApiFormJson)
      );

      const deepTree153413615 = tree5469299.aggregateLogicTree("153413615");
      const allStatusMessages = deepTree153413615.getStatusMessage();
      const allStatusMessagesFiltered = allStatusMessages.filter(
        (message) => message.severity != "debug"
      );

      // const logicStatusMessage = tree5469299.getAllLogicStatusMessages();
      // const pojo = deepTree153413615.toPojoAt(undefined, false);
      // 5487084
    });

    it.skip("dev/debug.", () => {
      // const tree5488291 = FsFormModel.fromApiFormJson(
      //   transformers.formJson(formJson5488291 as unknown as TApiFormJson)
      // );
      const tree5469299 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5469299 as unknown as TApiFormJson)
      );

      const deepTree153413615 = tree5469299.aggregateLogicTree("153413615");
      const allStatusMessages = deepTree153413615.getStatusMessage();
      const allStatusMessagesFiltered = allStatusMessages.filter(
        (message) => message.severity != "debug"
      );

      const logicStatusMessage = tree5469299.getAllLogicStatusMessages();
      const pojo = deepTree153413615.toPojoAt(undefined, false);
      expect(pojo).toStrictEqual({
        "153413615": {
          parentId: "153413615",
          nodeContent: {
            nodeType: "FsVirtualRootNode",
            fieldId: "153413615",
            conditional: "all",
          },
        },
        "153413615:0": {
          parentId: "153413615",
          nodeContent: {
            nodeType: "FsLogicBranchNode",
            ownerFieldId: "153413615",
            action: "show",
            conditional: "all",
          },
        },
        "153413615:0:1": {
          parentId: "153413615:0",
          nodeContent: {
            nodeType: "FsLogicLeafNode",
            fieldId: "152290551",
            condition: "equals",
            option: "Neutral",
          },
        },
        "153413615:2": {
          parentId: "153413615",
          nodeContent: {
            nodeType: "FsLogicBranchNode",
            ownerFieldId: "153413614",
            action: "show",
            conditional: "any",
          },
        },
        "153413615:2:3": {
          parentId: "153413615:2",
          nodeContent: {
            nodeType: "_CIRCULAR_NODE_",
            ruleConflict: {
              conditionalB: {
                condition: "equals",
                option: "Neutral",
                fieldId: "152290551",
              },
              conditionalA: {
                option: "Neutral",
                condition: "equals",
                fieldId: "152290551",
              },
            },
            sourceFieldId: "153413615",
            targetSourceId: "152290551",
            dependentChainFieldIds: ["153413615", "152290551", "153413614"],
          },
        },
        "153413615:2:4": {
          parentId: "153413615:2",
          nodeContent: {
            nodeType: "FsLogicLeafNode",
            fieldId: "152293117",
            condition: "equals",
            option: "Zero",
          },
        },
        "153413615:2:5": {
          parentId: "153413615:2",
          nodeContent: {
            nodeType: "_CIRCULAR_NODE_",
            ruleConflict: {
              conditionalB: {
                condition: "equals",
                option: "Zero",
                fieldId: "152293117",
              },
              conditionalA: {
                option: "One",
                condition: "equals",
                fieldId: "152293117",
              },
            },
            sourceFieldId: "153413615",
            targetSourceId: "152293117",
            dependentChainFieldIds: [
              "153413615",
              "152290551",
              "153413614",
              "152290551",
              "152293117",
            ],
          },
        },
      });
      // 5487084
    });
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
        "153112633:0:1": {
          parentId: "153112633:0",
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
        nodeType: "_CIRCULAR_NODE_",
        ruleConflict: {
          conditionalB: {
            condition: "equals",
            option: "Zero",
            fieldId: "152293117",
          },
          conditionalA: {
            option: "Zero",
            condition: "equals",
            fieldId: "152293117",
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
    "152290546:0:1": {
      parentId: "152290546:0",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290547",
        action: "show",
        conditional: "all",
      },
    },
    "152290546:0:1:2": {
      parentId: "152290546:0:1",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290548",
        action: "show",
        conditional: "all",
      },
    },
    "152290546:0:1:2:3": {
      parentId: "152290546:0:1:2",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290549",
        action: "show",
        conditional: "all",
      },
    },
    "152290546:0:1:2:3:4": {
      parentId: "152290546:0:1:2:3",
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
    "148456742:0:1": {
      parentId: "148456742:0",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148456741",
        action: "show",
        conditional: "all",
      },
    },
    "148456742:0:1:2": {
      parentId: "148456742:0:1",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148456740",
        action: "show",
        conditional: "all",
      },
    },
    "148456742:0:1:2:3": {
      parentId: "148456742:0:1:2",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148456739",
        action: "show",
        conditional: "all",
      },
    },
    "148456742:0:1:2:3:4": {
      parentId: "148456742:0:1:2:3",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148456734",
        action: "show",
        conditional: "all",
      },
    },
    "148456742:0:1:2:3:4:5": {
      parentId: "148456742:0:1:2:3:4",
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
    "148509470:3:5": {
      parentId: "148509470:3",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148509476",
        action: "show",
        conditional: "all",
      },
    },
    "148509470:3:5:6": {
      parentId: "148509470:3:5",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148509477",
        condition: "equals",
        option: "True",
      },
    },
    "148509470:3:5:7": {
      parentId: "148509470:3:5",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148509474",
        condition: "equals",
        option: "True",
      },
    },
    "148509470:3:8": {
      parentId: "148509470:3",
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
    "148509470:3:9": {
      parentId: "148509470:3",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "151678347",
        condition: "equals",
        option: "Neutral",
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
        nodeType: "_CIRCULAR_NODE_",
        ruleConflict: {
          conditionalB: {
            condition: "equals",
            option: "Neutral",
            fieldId: "153055010",
          },
          conditionalA: {
            option: "Neutral",
            condition: "equals",
            fieldId: "153055010",
          },
        },
        sourceFieldId: "153055077",
        targetSourceId: "153055010",
        dependentChainFieldIds: ["153055077", "153055010", "153055041"],
      },
    },
  },
};

const smoke_test_pojo_many_forms = {
  pojo148604236: {
    "148604236": {
      parentId: "148604236",
      nodeContent: {
        nodeType: "FsVirtualRootNode",
        fieldId: "148604236",
        conditional: "all",
      },
    },
    "148604236:0": {
      parentId: "148604236",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148604236",
        action: "show",
        conditional: "all",
      },
    },
    "148604236:0:1": {
      parentId: "148604236:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148604235",
        condition: "equals",
        option: "True",
      },
    },
    "148604236:0:2": {
      parentId: "148604236:0",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148604235",
        action: "show",
        conditional: "any",
      },
    },
    "148604236:0:2:3": {
      parentId: "148604236:0:2",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148604234",
        condition: "equals",
        option: "True",
      },
    },
    "148604236:0:2:4": {
      parentId: "148604236:0:2",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148604234",
        action: "show",
        conditional: "any",
      },
    },
    "148604236:0:2:4:5": {
      parentId: "148604236:0:2:4",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148604236",
        condition: "equals",
        option: "True",
      },
    },
    "148604236:0:2:4:6": {
      parentId: "148604236:0:2:4",
      nodeContent: {
        nodeType: "_CIRCULAR_NODE_",
        ruleConflict: {
          conditionalA: {
            option: "True",
            condition: "equals",
            fieldId: "148604236",
          },
          conditionalB: {
            option: undefined,
            condition: undefined,
            fieldId: undefined,
          },
        },
        sourceFieldId: "148604234",
        sourceNodeId: "148604236:0:2:4",
        targetFieldId: "148604236",
        targetNodeId: "148604236:0:2:4:6",
        dependentChainFieldIds: ["148604236", "148604235", "148604234"],
      },
    },
    "148604236:0:2:4:7": {
      parentId: "148604236:0:2:4",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148604239",
        condition: "greaterthan",
        option: 10,
      },
    },
  },
  pojo152290553: {
    "152290553": {
      parentId: "152290553",
      nodeContent: {
        nodeType: "FsVirtualRootNode",
        fieldId: "152290553",
        conditional: "all",
      },
    },
    "152290553:0": {
      parentId: "152290553",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290553",
        action: "show",
        conditional: "all",
      },
    },
    "152290553:0:1": {
      parentId: "152290553:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290554",
        condition: "equals",
        option: "True",
      },
    },
    "152290553:0:2": {
      parentId: "152290553:0",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290552",
        action: "show",
        conditional: "any",
      },
    },
    "152290553:0:2:3": {
      parentId: "152290553:0:2",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290553",
        condition: "equals",
        option: "True",
      },
    },
    "152290553:0:2:4": {
      parentId: "152290553:0:2",
      nodeContent: {
        nodeType: "_CIRCULAR_NODE_",
        ruleConflict: {
          conditionalA: {
            option: "True",
            condition: "equals",
            fieldId: "152290553",
          },
          conditionalB: {
            option: undefined,
            condition: undefined,
            fieldId: undefined,
          },
        },
        sourceFieldId: "152290552",
        sourceNodeId: "152290553:0:2",
        targetFieldId: "152290553",
        targetNodeId: "152290553:0:2:4",
        dependentChainFieldIds: ["152290553", "152290552"],
      },
    },
    "152290553:0:2:5": {
      parentId: "152290553:0:2",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290556",
        condition: "equals",
        option: "True",
      },
    },
    "152290553:0:2:6": {
      parentId: "152290553:0:2",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290556",
        action: "show",
        conditional: "all",
      },
    },
    "152290553:0:2:6:7": {
      parentId: "152290553:0:2:6",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290555",
        condition: "equals",
        option: "True",
      },
    },
    "152290553:0:2:6:8": {
      parentId: "152290553:0:2:6",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "152290552",
        sourceNodeId: "152290553:0:2",
        targetFieldId: "152290552",
        targetNodeId: "152290553:0:2:6:8",
        ruleConflict: {
          conditionalA: {
            condition: "any",
            action: "show",
            option: undefined,
          },
          conditionalB: {
            condition: "any",
            action: "show",
            option: undefined,
          },
        },
        dependentChainFieldIds: ["152290553", "152290552", "152290556"],
      },
    },
    "152290553:0:2:6:9": {
      parentId: "152290553:0:2:6",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290558",
        condition: "equals",
        option: "True",
      },
    },
    "152290553:0:2:6:10": {
      parentId: "152290553:0:2:6",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "152290552",
        sourceNodeId: "152290553:0:2",
        targetFieldId: "152290552",
        targetNodeId: "152290553:0:2:6:10",
        ruleConflict: {
          conditionalA: {
            condition: "any",
            action: "show",
            option: undefined,
          },
          conditionalB: {
            condition: "any",
            action: "show",
            option: undefined,
          },
        },
        dependentChainFieldIds: ["152290553", "152290552", "152290556"],
      },
    },
    "152290553:0:2:11": {
      parentId: "152290553:0:2",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "152290552",
        sourceNodeId: "152290553:0:2",
        targetFieldId: "152290552",
        targetNodeId: "152290553:0:2:11",
        ruleConflict: {
          conditionalA: {
            condition: "any",
            action: "show",
            option: undefined,
          },
          conditionalB: {
            condition: "any",
            action: "show",
            option: undefined,
          },
        },
        dependentChainFieldIds: ["152290553", "152290552", "152290556"],
      },
    },
    "152290553:0:2:12": {
      parentId: "152290553:0:2",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290551",
        condition: "equals",
        option: "Neutral",
      },
    },
    "152290553:0:13": {
      parentId: "152290553:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290557",
        condition: "equals",
        option: "True",
      },
    },
    "152290553:0:14": {
      parentId: "152290553:0",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "152290552",
        sourceNodeId: "152290553:0:2",
        targetFieldId: "152290552",
        targetNodeId: "152290553:0:14",
        ruleConflict: {
          conditionalA: {
            condition: "any",
            action: "show",
            option: undefined,
          },
          conditionalB: {
            condition: "any",
            action: "show",
            option: undefined,
          },
        },
        dependentChainFieldIds: ["152290553", "152290552", "152290556"],
      },
    },
    "152290553:15": {
      parentId: "152290553",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "152290552",
        sourceNodeId: "152290553:0:2",
        targetFieldId: "152290552",
        targetNodeId: "152290553:15",
        ruleConflict: {
          conditionalA: {
            condition: "any",
            action: "show",
            option: undefined,
          },
          conditionalB: {
            condition: "any",
            action: "show",
            option: undefined,
          },
        },
        dependentChainFieldIds: ["152290553", "152290552", "152290556"],
      },
    },
  },
  pojo153413615: {
    "153413615": {
      parentId: "153413615",
      nodeContent: {
        nodeType: "FsVirtualRootNode",
        fieldId: "153413615",
        conditional: "all",
      },
    },
    "153413615:0": {
      parentId: "153413615",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "153413615",
        action: "show",
        conditional: "all",
      },
    },
    "153413615:0:1": {
      parentId: "153413615:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290551",
        condition: "equals",
        option: "Neutral",
      },
    },
    "153413615:2": {
      parentId: "153413615",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "153413614",
        action: "show",
        conditional: "any",
      },
    },
    "153413615:2:3": {
      parentId: "153413615:2",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290551",
        condition: "equals",
        option: "Neutral",
      },
    },
    "153413615:2:4": {
      parentId: "153413615:2",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152293117",
        condition: "equals",
        option: "Zero",
      },
    },
    "153413615:2:5": {
      parentId: "153413615:2",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152293117",
        condition: "equals",
        option: "One",
      },
    },
  },
  pojo152293116: {
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
        nodeType: "FsLogicLeafNode",
        fieldId: "152293117",
        condition: "equals",
        option: "One",
      },
    },
  },
  pojo152297010: {
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
        nodeType: "FsLogicLeafNode",
        fieldId: "152293117",
        condition: "equals",
        option: "Zero",
      },
    },
  },
  pojo152290548: {
    "152290548": {
      parentId: "152290548",
      nodeContent: {
        nodeType: "FsVirtualRootNode",
        fieldId: "152290548",
        conditional: "all",
      },
    },
    "152290548:0": {
      parentId: "152290548",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290548",
        action: "show",
        conditional: "all",
      },
    },
    "152290548:0:1": {
      parentId: "152290548:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290549",
        condition: "equals",
        option: "OptionA",
      },
    },
    "152290548:0:2": {
      parentId: "152290548:0",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290549",
        action: "show",
        conditional: "all",
      },
    },
    "152290548:0:2:3": {
      parentId: "152290548:0:2",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290545",
        condition: "equals",
        option: "OptionA",
      },
    },
  },
  pojo152586428: {
    "152586428": {
      parentId: "152586428",
      nodeContent: {
        nodeType: "FsVirtualRootNode",
        fieldId: "152586428",
        conditional: "all",
      },
    },
    "152586428:0": {
      parentId: "152586428",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152586428",
        action: "show",
        conditional: "all",
      },
    },
    "152586428:0:1": {
      parentId: "152586428:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290551",
        condition: "equals",
        option: "Neutral",
      },
    },
    "152586428:2": {
      parentId: "152586428",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152586401",
        action: "show",
        conditional: "any",
      },
    },
    "152586428:2:3": {
      parentId: "152586428:2",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152293117",
        condition: "equals",
        option: "Zero",
      },
    },
  },
  pojo152290549: {
    "152290549": {
      parentId: "152290549",
      nodeContent: {
        nodeType: "FsVirtualRootNode",
        fieldId: "152290549",
        conditional: "all",
      },
    },
    "152290549:0": {
      parentId: "152290549",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290549",
        action: "show",
        conditional: "all",
      },
    },
    "152290549:0:1": {
      parentId: "152290549:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290545",
        condition: "equals",
        option: "OptionA",
      },
    },
  },
  pojo152290546: {
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
    "152290546:0:1": {
      parentId: "152290546:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290547",
        condition: "equals",
        option: "OptionA",
      },
    },
    "152290546:0:2": {
      parentId: "152290546:0",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290547",
        action: "show",
        conditional: "all",
      },
    },
    "152290546:0:2:3": {
      parentId: "152290546:0:2",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290548",
        condition: "equals",
        option: "OptionA",
      },
    },
    "152290546:0:2:4": {
      parentId: "152290546:0:2",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290548",
        action: "show",
        conditional: "all",
      },
    },
    "152290546:0:2:4:5": {
      parentId: "152290546:0:2:4",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290549",
        condition: "equals",
        option: "OptionA",
      },
    },
    "152290546:0:2:4:6": {
      parentId: "152290546:0:2:4",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "152290549",
        action: "show",
        conditional: "all",
      },
    },
    "152290546:0:2:4:6:7": {
      parentId: "152290546:0:2:4:6",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "152290545",
        condition: "equals",
        option: "OptionA",
      },
    },
  },
  pojo148509470: {
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
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148509465",
        action: "show",
        conditional: "all",
      },
    },
    "148509470:0:2:3": {
      parentId: "148509470:0:2",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148509470",
        condition: "equals",
        option: "True",
      },
    },
    "148509470:0:2:4": {
      parentId: "148509470:0:2",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "148509465",
        sourceNodeId: "148509470:0:2",
        targetFieldId: "148509470",
        targetNodeId: "148509470:0:2:4",
        ruleConflict: {
          conditionalA: {
            condition: "all",
            action: "show",
            option: undefined,
          },
          conditionalB: {
            condition: undefined,
            action: undefined,
            option: "True",
          },
        },
        dependentChainFieldIds: ["148509470", "148509465"],
      },
    },
    "148509470:0:2:5": {
      parentId: "148509470:0:2",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148509476",
        condition: "equals",
        option: "True",
      },
    },
    "148509470:0:2:6": {
      parentId: "148509470:0:2",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148509476",
        action: "show",
        conditional: "all",
      },
    },
    "148509470:0:2:6:7": {
      parentId: "148509470:0:2:6",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148509477",
        condition: "equals",
        option: "True",
      },
    },
    "148509470:0:2:6:8": {
      parentId: "148509470:0:2:6",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "148509465",
        sourceNodeId: "148509470:0:2",
        targetFieldId: "148509465",
        targetNodeId: "148509470:0:2:6:8",
        ruleConflict: {
          conditionalA: {
            condition: "all",
            action: "show",
            option: undefined,
          },
          conditionalB: {
            condition: "all",
            action: "show",
            option: undefined,
          },
        },
        dependentChainFieldIds: ["148509470", "148509465", "148509476"],
      },
    },
    "148509470:0:2:6:9": {
      parentId: "148509470:0:2:6",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148509474",
        condition: "equals",
        option: "True",
      },
    },
    "148509470:0:2:6:10": {
      parentId: "148509470:0:2:6",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "148509465",
        sourceNodeId: "148509470:0:2",
        targetFieldId: "148509465",
        targetNodeId: "148509470:0:2:6:10",
        ruleConflict: {
          conditionalA: {
            condition: "all",
            action: "show",
            option: undefined,
          },
          conditionalB: {
            condition: "all",
            action: "show",
            option: undefined,
          },
        },
        dependentChainFieldIds: ["148509470", "148509465", "148509476"],
      },
    },
    "148509470:0:2:11": {
      parentId: "148509470:0:2",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "148509465",
        sourceNodeId: "148509470:0:2",
        targetFieldId: "148509465",
        targetNodeId: "148509470:0:2:11",
        ruleConflict: {
          conditionalA: {
            condition: "all",
            action: "show",
            option: undefined,
          },
          conditionalB: {
            condition: "all",
            action: "show",
            option: undefined,
          },
        },
        dependentChainFieldIds: ["148509470", "148509465", "148509476"],
      },
    },
    "148509470:0:2:12": {
      parentId: "148509470:0:2",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "151678347",
        condition: "equals",
        option: "Neutral",
      },
    },
    "148509470:0:13": {
      parentId: "148509470:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148509475",
        condition: "equals",
        option: "True",
      },
    },
    "148509470:0:14": {
      parentId: "148509470:0",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "148509465",
        sourceNodeId: "148509470:0:2",
        targetFieldId: "148509465",
        targetNodeId: "148509470:0:14",
        ruleConflict: {
          conditionalA: {
            condition: "all",
            action: "show",
            option: undefined,
          },
          conditionalB: {
            condition: "all",
            action: "show",
            option: undefined,
          },
        },
        dependentChainFieldIds: ["148509470", "148509465", "148509476"],
      },
    },
    "148509470:15": {
      parentId: "148509470",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "148509465",
        sourceNodeId: "148509470:0:2",
        targetFieldId: "148509465",
        targetNodeId: "148509470:15",
        ruleConflict: {
          conditionalA: {
            condition: "all",
            action: "show",
            option: undefined,
          },
          conditionalB: {
            condition: "all",
            action: "show",
            option: undefined,
          },
        },
        dependentChainFieldIds: ["148509470", "148509465", "148509476"],
      },
    },
  },
  pojo148456742: {
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
    "148456742:0:1": {
      parentId: "148456742:0",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148456741",
        condition: "equals",
        option: "OptionA",
      },
    },
    "148456742:0:2": {
      parentId: "148456742:0",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148456741",
        action: "show",
        conditional: "all",
      },
    },
    "148456742:0:2:3": {
      parentId: "148456742:0:2",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148456740",
        condition: "equals",
        option: "OptionA",
      },
    },
    "148456742:0:2:4": {
      parentId: "148456742:0:2",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148456740",
        action: "show",
        conditional: "all",
      },
    },
    "148456742:0:2:4:5": {
      parentId: "148456742:0:2:4",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148456739",
        condition: "equals",
        option: "OptionA",
      },
    },
    "148456742:0:2:4:6": {
      parentId: "148456742:0:2:4",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148456739",
        action: "show",
        conditional: "all",
      },
    },
    "148456742:0:2:4:6:7": {
      parentId: "148456742:0:2:4:6",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148456734",
        condition: "equals",
        option: "OptionA",
      },
    },
    "148456742:0:2:4:6:8": {
      parentId: "148456742:0:2:4:6",
      nodeContent: {
        nodeType: "FsLogicBranchNode",
        ownerFieldId: "148456734",
        action: "show",
        conditional: "all",
      },
    },
    "148456742:0:2:4:6:8:9": {
      parentId: "148456742:0:2:4:6:8",
      nodeContent: {
        nodeType: "FsLogicLeafNode",
        fieldId: "148456742",
        condition: "equals",
        option: "OptionA",
      },
    },
    "148456742:0:2:4:6:8:10": {
      parentId: "148456742:0:2:4:6:8",
      nodeContent: {
        nodeType: "FsCircularDependencyNode",
        sourceFieldId: "148456734",
        sourceNodeId: "148456742:0:2:4:6:8",
        targetFieldId: "148456742",
        targetNodeId: "148456742:0:2:4:6:8:10",
        ruleConflict: {
          conditionalA: {
            condition: "all",
            action: "show",
            option: undefined,
          },
          conditionalB: {
            condition: undefined,
            action: undefined,
            option: "OptionA",
          },
        },
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
};
