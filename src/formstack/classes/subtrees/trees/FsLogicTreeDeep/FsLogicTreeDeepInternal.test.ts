import { FsLogicTreeDeepInternal } from "./FsLogicTreeDeepInternal";
import formJson5375703 from "../../../../../test-dev-resources/form-json/5375703.json";
import formJson5469299 from "../../../../../test-dev-resources/form-json/5469299.json";
import { FsLogicBranchNode } from "./LogicNodes/FsLogicBranchNode";
import { FsLogicLeafNode } from "./LogicNodes/FsLogicLeafNode";

describe("FsLogicTreeDeepInternal", () => {
  describe(".getDependantFieldIds()", () => {
    it("Should be empty array for dependancy list of single node tree (new without root node).", () => {
      const tree = new FsLogicTreeDeepInternal("root");
      expect(tree.getDependantFieldIds()).toStrictEqual([]);
    });
    it("Should be empty array for dependancy list of single node tree (new with root node).", () => {
      const b = new FsLogicBranchNode("fieldId", "$not", "Hide", [], {});
      const tree = new FsLogicTreeDeepInternal("root", b);

      expect(tree.getDependantFieldIds()).toStrictEqual([]);
    });
    it.skip("Should be empty array for dependancy list of single node tree (new with root node).", () => {
      const b = new FsLogicBranchNode("fieldId", "$not", "Hide", [], {});
      const tree = new FsLogicTreeDeepInternal("root", b);
      tree.appendChildNodeWithContent(
        tree.rootNodeId,
        new FsLogicLeafNode("l0", "dateAfter", "_OPTION_")
      );

      expect(tree.getDependantFieldIds()).toStrictEqual(["l0"]);
    });
    it.skip("Should maintain order.", () => {
      const root = new FsLogicBranchNode(
        "fieldId_root",
        "$not",
        "Hide",
        [],
        {}
      );
      const b0 = new FsLogicBranchNode("fieldId_b0", "$not", "Hide", [], {});
      const b1 = new FsLogicBranchNode("fieldId_b1", "$not", "Hide", [], {});
      const l0 = new FsLogicLeafNode("fieldId_l0", "dateAfter", "_OPTION_");
      const l1 = new FsLogicLeafNode("fieldId_l1", "dateAfter", "_OPTION_");
      const l2 = new FsLogicLeafNode("fieldId_l2", "dateAfter", "_OPTION_");
      const l3 = new FsLogicLeafNode("fieldId_l3", "dateAfter", "_OPTION_");
      const l4 = new FsLogicLeafNode("fieldId_l4", "dateAfter", "_OPTION_");
      const l5 = new FsLogicLeafNode("fieldId_l5", "dateAfter", "_OPTION_");

      const tree = new FsLogicTreeDeepInternal("root", root);
      const nodeId_b0 = tree.appendChildNodeWithContent(tree.rootNodeId, b0);
      const nodeId_b1 = tree.appendChildNodeWithContent(tree.rootNodeId, b1);
      tree.appendChildNodeWithContent(nodeId_b0, l0);
      tree.appendChildNodeWithContent(nodeId_b0, l1);
      tree.appendChildNodeWithContent(nodeId_b0, l2);
      tree.appendChildNodeWithContent(nodeId_b1, l3);
      tree.appendChildNodeWithContent(nodeId_b1, l4);
      tree.appendChildNodeWithContent(nodeId_b1, l5);
      expect(tree.getDependantFieldIds()).toStrictEqual([
        "fieldId_b0",
        "fieldId_b1",
        "fieldId_l0",
        "fieldId_l1",
        "fieldId_l2",
        "fieldId_l3",
        "fieldId_l4",
        "fieldId_l5",
      ]);
    });
  });
});
