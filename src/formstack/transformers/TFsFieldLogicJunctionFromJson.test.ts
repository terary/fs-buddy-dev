import { TFsFieldLogicJunctionFromJson } from "./TFsFieldLogicJunctionFromJson";
import {
  TFsFieldLogicJunction,
  TFsFieldLogicJunctionJson,
} from "../classes/subtrees/types";

describe("TFsFieldLogicJunctionFromJson", () => {
  let logicJunctionJson: TFsFieldLogicJunctionJson;
  beforeEach(() => {
    logicJunctionJson = {
      logicJson: {},
      //fieldJson: {},
      action: "Show",
      conditional: "any", // TLogicJunctionOperators;
      checks: [],
    };
  });
  it("Should transform json to 'TFsFieldLogicJunction' type.", () => {
    const actual = TFsFieldLogicJunctionFromJson(
      logicJunctionJson,
      "theOwnerId"
    );
    expect(actual.action).toEqual("Show");
    expect(actual.ownerFieldId).toEqual("theOwnerId");
    expect(actual.conditional).toEqual("$or");

    expect(actual.logicJson).toStrictEqual(logicJunctionJson);

    // @ts-ignore - 'checks' not a property of...
    expect(actual.checks).toBeUndefined();
  });
  it("Should convert .json.conditional 'any' to '$or'.", () => {
    const actual = TFsFieldLogicJunctionFromJson(
      logicJunctionJson,
      "theOwnerId"
    );
    expect(actual.conditional).toEqual("$or");
  });
  it("Should convert .json.conditional 'all' to '$and'.", () => {
    const actual = TFsFieldLogicJunctionFromJson(
      { ...logicJunctionJson, ...{ conditional: "all" } },
      "theOwnerId"
    );
    expect(actual.conditional).toEqual("$and");
  });

  it("Should set .json.action to null if missing from json.", () => {
    delete logicJunctionJson["action"];
    const actual = TFsFieldLogicJunctionFromJson(
      logicJunctionJson,
      "theOwnerId"
    );
    expect(actual.action).toBeNull();
  });
  it("Should set .json.action to null anything other than 'show' or 'hide'", () => {
    delete logicJunctionJson["action"];
    const actual = TFsFieldLogicJunctionFromJson(
      logicJunctionJson,
      "theOwnerId"
    );
    expect(actual.action).toBeNull();
    ["showed", "hsow", "hidden", "hid"].forEach((action) => {
      const actual = TFsFieldLogicJunctionFromJson(
        // @ts-ignore - test case
        { ...logicJunctionJson, ...{ action } },
        "theOwnerId"
      );
      expect(actual.action).toBeNull();
    });
  });
  // if .json.action not recognized ('showed')
  it("Should be case insensitive of .json.action ", () => {
    ["show", "Show", "ShOw"].forEach((action) => {
      const actual = TFsFieldLogicJunctionFromJson(
        // @ts-ignore - test case
        { ...logicJunctionJson, ...{ action } },
        "theOwnerId"
      );
      expect(actual.action).toEqual("Show");
    });
    ["hide", "HIDE", "hIdE"].forEach((action) => {
      const actual = TFsFieldLogicJunctionFromJson(
        // @ts-ignore - test case
        { ...logicJunctionJson, ...{ action } },
        "theOwnerId"
      );
      expect(actual.action).toEqual("Hide");
    });
  });
});
