import { FieldLogicService } from "./FieldLogicService";
import circularAndInterdependentJson from "../test-dev-resources/form-json/5375703.json";
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
    it.only("Should return all fieldIds for fields with logic", () => {
      const fieldLogic = new FieldLogicService(
        circularAndInterdependentJson.fields as unknown as TFsFieldAnyJson[]
      );
      expect(
        fieldLogic.getFieldIdsExtendedLogicOf("148509465").sort()
      ).toStrictEqual(
        [
          "148509470",
          "148509478",
          "148509475",
          "148509476",
          "148509477",
          "148509474",
          "151678347",
        ].sort()
      );
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
