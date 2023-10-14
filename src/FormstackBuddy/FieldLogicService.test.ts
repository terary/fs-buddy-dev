import { FieldLogicService } from "./FieldLogicService";
import circularAndInterdependentJson from "../test-dev-resources/form-json/5375703.json";
import { TFsFieldAnyJson } from "../formstack";
import { transformers } from "../formstack/transformers";
import { TApiFormJson } from "../formstack/type.form";

// getFieldIdsAll
// getFieldIdsWithLogic
// getFieldIdsWithoutLogic

describe("FieldLogicService", () => {
  describe(".getFormLogicStatusMessages()", () => {
    it("Should", () => {
      const fieldLogicService = new FieldLogicService(
        transformers.formJson(
          circularAndInterdependentJson as unknown as TApiFormJson
        )
      );

      const statusMessages = fieldLogicService.getFormLogicStatusMessages();
      expect(statusMessages).toStrictEqual([
        {
          severity: "info",
          fieldId: null,
          message:
            'Logic composition: <pre><code>{\n  "totalNodes": 153,\n  "totalCircularLogicNodes": 24,\n  "totalCircularExclusiveLogicNodes": 0,\n  "totalCircularInclusiveLogicNodes": 0,\n  "totalUnclassifiedNodes": 0,\n  "totalLeafNodes": 43,\n  "totalBranchNodes": 67,\n  "totalRootNodes": 19,\n  "leafToNodeRatio": "0.2810",\n  "branchToNodeRatio": "0.4379",\n  "leafToBranchRatio": "0.6418"\n}</code></pre>\n      <ul>\n        <li>totalNodes - Each time a field involved in a logic expression. If a field is used twice this will be reflected in this number</li>\n        <li>totalCircularLogicNodes - Logic conflict at the branch level.</li>\n        <li>totalCircularExclusiveLogicNodes - Logic conflict at the leaf level, non-resolvable.</li>\n        <li>totalCircularInclusiveLogicNodes - Logic conflict at the leaf level, resolvable.</li>\n        <li>totalLeafNodes - Logic terms (the actual "x equal _SOMETHING_").</li>\n        <li>totalBranchNodes - Logic branch (something like: "Show" if _ANY_...).</li>\n        <li>totalRootNodes - The field that owns the logic expression.</li>\n        <li>Note: Circular nodes indicates invalid logic expression. If an expression is invalid these counts may not be accurate.</li>\n        <li>branchToNodeRatio - higher number indicates need to break into multiple forms.</li>\n        <li>leafToBranchRatio - higher number indicates good usage of logic .</li>\n      </ul>\n    ',
          relatedFieldIds: [],
        },
        {
          severity: "info",
          fieldId: null,
          message: "Number of fields with root logic:  15",
          relatedFieldIds: [],
        },
        {
          severity: "info",
          fieldId: null,
          message: "Number of fields without root logic:  14",
          relatedFieldIds: [],
        },
        {
          severity: "warn",
          fieldId: null,
          message: "Number of fields with circular references:  17",
          relatedFieldIds: [],
        },
      ]);
    });
  });

  describe(".getFieldIdsWithLogic() (aka branches)", () => {
    it("Should return all fieldIds for fields with logic", () => {
      const fieldLogic = new FieldLogicService(
        transformers.formJson(
          circularAndInterdependentJson as unknown as TApiFormJson
        )
      );
      expect(fieldLogic.getFieldIdsWithLogic().sort()).toStrictEqual(
        [
          "148456734",
          "148456739",
          "148456740",
          "148456741",
          "148456742",
          "148509465",
          "148509470",
          "148509476",
          "148604161",
          "148604234",
          "148604235",
          "148604236",
          "151701616",
          "152139062",
          "152139065",
        ].sort()
      );
    });
  });
  describe(".getFieldIdsWithoutLogic() (aka leaves)", () => {
    it("Should return all fieldIds for fields with logic", () => {
      const fieldLogic = new FieldLogicService(
        transformers.formJson(
          circularAndInterdependentJson as unknown as TApiFormJson
        )
      );
      expect(fieldLogic.getFieldIdsWithoutLogic().sort()).toStrictEqual(
        [
          "148456700",
          "148509474",
          "148509475",
          "148509477",
          "148509478",
          "148604159",
          "148604239",
          "151678347",
          "151702085",
          "152139061",
          "152139063",
          "152139064",
          "152139066",
          "152139068",
        ].sort()
      );
    });
  });
  describe(".getFieldIdsAll()", () => {
    it("Should return all fieldIds for fields with logic", () => {
      const fieldLogic = new FieldLogicService(
        transformers.formJson(
          circularAndInterdependentJson as unknown as TApiFormJson
        )
      );
      expect(fieldLogic.getFieldIdsAll().sort()).toStrictEqual(
        [
          "151701616",
          "151702085",
          "148456734",
          "148456742",
          "148456741",
          "148456740",
          "148456739",
          "148456700",
          "151678347",
          "148509465",
          "148509470",
          "148509478",
          "148509477",
          "148509476",
          "148509475",
          "148509474",
          "152139061",
          "152139062",
          "152139063",
          "152139064",
          "152139065",
          "152139066",
          "152139068",
          "148604159",
          "148604161",
          "148604236",
          "148604235",
          "148604234",
          "148604239",
        ].sort()
      );
    });
  });
  describe(".getFieldIdsExtendedLogicOf(fieldId)", () => {
    it("Should return all fieldIds for fields with logic", () => {
      const fieldLogic = new FieldLogicService(
        transformers.formJson(
          circularAndInterdependentJson as unknown as TApiFormJson
        )
      );
      expect(
        fieldLogic.getFieldIdsExtendedLogicOf("148509465").sort()
      ).toStrictEqual(
        [
          "148509465",
          "148509470",
          "148509478",
          "148509475",
          "148509465",
          "148509476",
          "148509477",
          "148509474",
          "148509465",
          "151678347",
        ].sort()
      );
    });
  });

  describe(".getCircularReferenceFieldIds()", () => {
    it("Should return an array of field ids with circular logic", () => {
      const fieldLogicService = new FieldLogicService(
        transformers.formJson(
          circularAndInterdependentJson as unknown as TApiFormJson
        )
      );

      expect(
        fieldLogicService.getCircularReferenceFieldIds("148456739")
      ).toStrictEqual(["148456741", "148456740"]);
    });
  });
  describe(".getFieldIdsWithCircularReferences()", () => {
    it("Should return an array of field ids with circular logic", () => {
      const fieldLogicService = new FieldLogicService(
        transformers.formJson(
          circularAndInterdependentJson as unknown as TApiFormJson
        )
      );
      expect(
        fieldLogicService.getFieldIdsWithCircularReferences()
      ).toStrictEqual([
        "148456734",
        "148456739",
        "148456740",
        "148456741",
        "148456742",
        "148509465",
        "148509470",
        "148509474",
        "148509475",
        "148509476",
        "148509477",
        "148509478",
        "148604161",
        "148604234",
        "148604235",
        "148604236",
        "151701616",
      ]);
    });
  });
  describe(".wrapFieldIdsIntoLabelOptionList(...)", () => {
    it("Should return a list of value/label pairs.", () => {
      const fieldLogic = new FieldLogicService(
        transformers.formJson(
          circularAndInterdependentJson as unknown as TApiFormJson
        )
      );

      const labelValueList = fieldLogic.wrapFieldIdsIntoLabelOptionList([
        "148509465",
        "148509478",
      ]);

      expect(labelValueList).toStrictEqual([
        {
          label: "(cr) (section) Inter-dependent (not so much circular)",
          value: "148509465",
        },
        { label: "(cr) A.0", value: "148509478" },
      ]);
    });
  });
});
