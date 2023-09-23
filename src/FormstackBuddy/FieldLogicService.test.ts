import { FieldLogicService } from "./FieldLogicService";
import circularAndInterdependentJson from "../test-dev-resources/form-json/5375703.20230922.json";
import goofFormJson from "../test-dev-resources/form-json/5375703-goof.json";
import { TFsFieldAnyJson } from "../formstack";

// getFieldIdsAll
// getFieldIdsWithLogic
// getFieldIdsWithoutLogic

describe("FieldLogicService", () => {
  describe(".getFieldIdsWithLogic() (aka branches)", () => {
    it("Should return all fieldIds for fields with logic", () => {
      const fieldLogic = new FieldLogicService(
        circularAndInterdependentJson.fields as unknown as TFsFieldAnyJson[]
      );
      expect(fieldLogic.getFieldIdsWithLogic()).toStrictEqual([
        "148456734",
        "148456742",
        "148456741",
        "148456740",
        "148456739",
        "148509465",
        "148509470",
        "148509476",
        "148604161",
        "148604236",
        "148604235",
        "148604234",
      ]);
    });
  });
  describe(".getFieldIdsWithoutLogic() (aka leaves)", () => {
    it("Should return all fieldIds for fields with logic", () => {
      const fieldLogic = new FieldLogicService(
        circularAndInterdependentJson.fields as unknown as TFsFieldAnyJson[]
      );
      expect(fieldLogic.getFieldIdsWithoutLogic()).toStrictEqual([
        "148456700",
        "148509721",
        "148509478",
        "148509477",
        "148509475",
        "148509474",
        "148604159",
        "148604239",
      ]);
    });
  });
  describe(".getFieldIdsAll()", () => {
    it("Should return all fieldIds for fields with logic", () => {
      const fieldLogic = new FieldLogicService(
        circularAndInterdependentJson.fields as unknown as TFsFieldAnyJson[]
      );
      expect(fieldLogic.getFieldIdsAll()).toStrictEqual([
        "148456734",
        "148456742",
        "148456741",
        "148456740",
        "148456739",
        "148456700",
        "148509465",
        "148509721",
        "148509470",
        "148509478",
        "148509477",
        "148509476",
        "148509475",
        "148509474",
        "148604159",
        "148604161",
        "148604236",
        "148604235",
        "148604234",
        "148604239",
      ]);
    });
  });
  describe(".getFieldIdsExtendedLogicOf(fieldId)", () => {
    it.only("Should be awesome", () => {
      const fieldLogic = new FieldLogicService(
        goofFormJson.fields as unknown as TFsFieldAnyJson[]
        // circularAndInterdependentJson.fields as unknown as TFsFieldAnyJson[]
      );
      //
      // const x = fieldLogic.getCircularReferenceFieldIds("148456734");

      // 148456734 known to have circular dependencies
      // 148509470 first dependant
      // 148509465 panel containing co dependencies
      // 148509474 (B1) Leaf node
      // 148509476 (B) Branch Node
      const fieldId = "148509476";
      // const x1 = fieldLogic.devDebug_getExtendedTree2(fieldId);
      // const x2 = fieldLogic.getCircularReferenceFieldIds(fieldId);

      const fieldIds = fieldLogic.getFieldIdsExtendedLogicOf(fieldId);
      const counts = fieldIds.reduce((prev, cur, i, a) => {
        if (prev[cur] === undefined) {
          prev[cur] = 0;
        }
        prev[cur]++;
        return prev;
      }, {} as { [fieldId: string]: number });

      const interdependentFieldIds =
        fieldLogic.getCircularReferenceFieldIds(fieldId);

      const response = {
        [fieldId]: {
          dependentFieldIds: fieldIds,
          interdependentFieldIds: interdependentFieldIds,
        },
      };

      // const x1 = fieldLogic.getAggregateTree("148509474");

      const x = fieldLogic.getCircularReferenceFieldIds("148509474");
      // maybe the simple version is get extendTree, visibilitityNode.getExtendedTree, get dependencies chain of each
      const circularRefFieldIds =
        fieldLogic.getCircularReferenceFieldIds("148509470");

      const extLogicFieldIds =
        fieldLogic.getFieldIdsExtendedLogicOf("148509465");

      expect({ extLogicFieldIds, circularRefFieldIds }).toStrictEqual({});
      expect(fieldLogic.getFieldIdsExtendedLogicOf("148509465")).toStrictEqual([
        "148509470",
        "148509478",
        "148509475",
        "148509476",
        "148509477",
        "148509474",
      ]);
    });
    it("Should return all fieldIds for fields with logic", () => {
      const fieldLogic = new FieldLogicService(
        circularAndInterdependentJson.fields as unknown as TFsFieldAnyJson[]
      );
      expect(fieldLogic.getFieldIdsExtendedLogicOf("148509465")).toStrictEqual([
        "148509470",
        "148509478",
        "148509475",
        "148509476",
        "148509477",
        "148509474",
      ]);
    });
  });

  describe(".getCircularReferenceFieldIds()", () => {
    it("Should return an array of field ids with circular logic", () => {
      const fieldLogicService = new FieldLogicService(
        circularAndInterdependentJson.fields as unknown as TFsFieldAnyJson[]
      );
      expect(
        fieldLogicService.getCircularReferenceFieldIds("148456739")
      ).toStrictEqual(["148456740", "148456739"]);
    });
  });
  describe(".getFieldIdsWithCircularReferences()", () => {
    it("Should return an array of field ids with circular logic", () => {
      const fieldLogicService = new FieldLogicService(
        circularAndInterdependentJson.fields as unknown as TFsFieldAnyJson[]
      );
      expect(
        fieldLogicService.getFieldIdsWithCircularReferences()
      ).toStrictEqual([
        "148456734",
        "148456739",
        "148456740",
        "148456741",
        "148456742",
        "148604161",
        "148604234",
        "148604235",
        "148604236",
      ]);
    });
  });
  describe(".wrapFieldIdsIntoLabelOptionList(...)", () => {
    it("Should return a list of value/label pairs.", () => {
      const fieldLogic = new FieldLogicService(
        circularAndInterdependentJson.fields as unknown as TFsFieldAnyJson[]
      );

      const labelValueList = fieldLogic.wrapFieldIdsIntoLabelOptionList([
        "148509465",
        "148509478",
      ]);
      expect(labelValueList).toStrictEqual([
        {
          label: "(section) Inter-dependent (not so much circular)",
          value: "148509465",
        },
        { label: "A.0", value: "148509478" },
      ]);
    });
  });
});
