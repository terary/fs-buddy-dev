import { FieldLogicService } from "./FieldLogicService";
import circularAndInterdependentJson from "../test-dev-resources/form-json/5375703.json";
import { TFsFieldAnyJson } from "../formstack";
import { transformers } from "../formstack/transformers";
import { TApiFormJson } from "../formstack/type.form";

// getFieldIdsAll
// getFieldIdsWithLogic
// getFieldIdsWithoutLogic

describe.skip("FieldLogicService", () => {
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
        transformers.formJson(
          circularAndInterdependentJson as unknown as TApiFormJson
        )
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
        transformers.formJson(
          circularAndInterdependentJson as unknown as TApiFormJson
        )
      );
      expect(
        fieldLogicService.getCircularReferenceFieldIds("148456739")
      ).toStrictEqual(["148456740", "148456739"]);
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
          label: "(section) Inter-dependent (not so much circular)",
          value: "148509465",
        },
        { label: "A.0", value: "148509478" },
      ]);
    });
  });
});
