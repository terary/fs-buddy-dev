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
    it.only("Should", () => {
      const fieldLogicService = new FieldLogicService(
        transformers.formJson(
          circularAndInterdependentJson as unknown as TApiFormJson
        )
      );

      const statusMessages = fieldLogicService.getFormLogicStatusMessages();
      expect(statusMessages).toStrictEqual([]);
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
