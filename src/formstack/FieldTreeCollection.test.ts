import { FieldTreeCollection } from "./FieldTreeCollection";
// import form5358473Json from "../test-dev-resources/form-json/5358473.json";
import form5368371Json from "../test-dev-resources/form-json/5368371.json";

import { TFsFieldAny } from "./type.field";
const fieldsWithLogicIds = ["148149764", "148151439", "148151438"];
const fieldsWithoutLogicIds = [
  "148149762",
  "148149763",
  "148149765",
  "148149767",
  "148149771",
  "148149772",
  "148149773",
  "148149774",
  "148149776",
  "148149778",
  "148151433",
];

describe("FieldTreeCollection", () => {
  describe(".fromEmpty(...)", () => {
    it("should create empty collection if json is empty array", () => {
      const collection = FieldTreeCollection.fromEmpty();
      // const collection = FieldTreeCollection.fromJson([]);
      expect(collection.count).toEqual(1);
      expect(collection.getFieldJson("_ANY_")).toBeNull();
    });
  });
  describe(".fromJson(...)", () => {
    it("should create empty collection if json is empty array", () => {
      const collection = FieldTreeCollection.fromJson(
        // @ts-ignore - json is incompatible
        form5368371Json.fields as Partial<TFsFieldAny>[]
      );

      const c = collection.dev_debug_get_tree();
      console.log({ c });
      // const collection = FieldTreeCollection.fromJson([]);
      expect(collection.count).toEqual(17);
      expect(collection.getFieldJson("_ANY_")).toBeNull();
    });
  });
  describe(".getDependancyList(...)", () => {
    let fieldCollection: FieldTreeCollection;
    beforeEach(() => {
      fieldCollection = FieldTreeCollection.fromJson(
        form5368371Json.fields as unknown as Partial<TFsFieldAny>[]
      );
    });
    it.only("Should be able to pull first degree dependancy", () => {
      // no dependencies
      ["148149763", "148149765", "148149778", "148149762"].forEach(
        (fieldId) => {
          expect(fieldCollection.getDependancyList(fieldId)).toStrictEqual([]);
        }
      );

      // field with calculations
      expect(fieldCollection.getDependancyList("148149773")).toStrictEqual([
        "148149774",
        "148149776",
      ]);

      // I think hidden by logic
      ["148149776", "148149771"].forEach((fieldId) => {
        expect(fieldCollection.getDependancyList(fieldId)).toStrictEqual([
          "148149765",
        ]);
      });
      // I think hidden by logic
      ["148151433", "148149772"].forEach((fieldId) => {
        expect(fieldCollection.getDependancyList(fieldId)).toStrictEqual([
          "148149763",
        ]);
      });

      // next two indicate interdependency. 148151438:148151439
      expect(fieldCollection.getDependancyList("148151438")).toStrictEqual([
        "148151439",
      ]);
      expect(fieldCollection.getDependancyList("148151439")).toStrictEqual([
        "148151438",
      ]);

      // sectional (fieldId: 148149764) has two underlying fields: 148149767 and 148149774
      expect(
        fieldCollection.getDependancyList("148149767").includes("148149764")
      ).toBe(true);
      expect(
        fieldCollection.getDependancyList("148149774").includes("148149764")
      ).toBe(true);

      expect(fieldCollection.getDependancyList("148149764")).toStrictEqual([
        "148149778",
      ]);
      expect(
        fieldCollection.getDependancyList("148149773").sort()
      ).toStrictEqual(["148149776", "148149774"].sort());
    });
  });
  describe("sections", () => {
    let fieldCollection: FieldTreeCollection;
    beforeEach(() => {
      fieldCollection = FieldTreeCollection.fromJson(
        form5368371Json.fields as unknown as Partial<TFsFieldAny>[]
      );
    });
    it("Should have 3", () => {
      expect(fieldCollection.getSectionFieldIds().sort()).toStrictEqual(
        ["148149763", "148149765", "148149764"].sort()
      );
    });
    it(".getSectionChildrenFieldIds(...)", () => {
      expect(
        fieldCollection.getSectionChildrenFieldIds("148149764")
      ).toStrictEqual(["148149767", "148149774"]);
      expect(
        fieldCollection.getSectionChildrenFieldIds("148149763")
      ).toStrictEqual(["148151439", "148149772", "148151433"]);
      expect(
        fieldCollection.getSectionChildrenFieldIds("148149765")
      ).toStrictEqual(["148149771", "148149776", "148151438"]);
    });
  });
  describe(".getAllFieldIds(...)", () => {
    it("Should return all formIds", () => {
      const collection = FieldTreeCollection.fromJson(
        form5368371Json.fields as unknown as Partial<TFsFieldAny>[]
      );
      const jsonFields = form5368371Json.fields.slice();
      const jsonFieldById = jsonFields.reduce((prev: any, cur) => {
        prev[cur.id] = cur;
        return prev;
      }, {}) as { [fieldId: string]: TFsFieldAny };

      fieldsWithoutLogicIds.forEach((fieldId) => {
        expect(jsonFieldById[fieldId]).toStrictEqual(
          collection.getFieldJson(fieldId)
        );
      });

      fieldsWithLogicIds.forEach((fieldId) => {
        expect({
          ...jsonFieldById["148149764"],
          ...{ action: "show", conditional: "all" },
        }).toStrictEqual(collection.getFieldJson("148149764"));
      });

      expect(fieldsWithLogicIds.concat(fieldsWithoutLogicIds).length).toEqual(
        14
      );
      expect(collection.getAllFieldIds().length).toEqual(14);
      expect(collection.getAllFieldIds().length).toEqual(
        form5368371Json.fields.length
      );
      const allFields = collection.getAllFieldIds();
      expect(allFields.sort()).toStrictEqual(Object.keys(jsonFieldById).sort());
    });
  });
});
