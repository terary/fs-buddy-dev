import {
  TFsFieldLogicCheckLeaf,
  TFsFieldLogicCheckLeafJson,
} from "../classes/subtrees/types";
import { TFsFieldLogicCheckLeafFromJson } from "./TFsFieldLogicCheckLeafFromJson";
describe("TFsFieldLogicCheckLeafFromJson", () => {
  it("It should transform input TFsFieldLogicCheckLeafJson[] output clean TFsFieldLogicCheckLeaf[]. (ideal)", () => {
    const checks: TFsFieldLogicCheckLeafJson[] = [
      { field: "148456734", condition: "equals", option: "OptionA" },
    ];

    expect(TFsFieldLogicCheckLeafFromJson(checks)).toStrictEqual([
      { fieldId: "148456734", condition: "equals", option: "OptionA" },
    ]);
  });
  it("It should convert numeric fieldIds into strings.", () => {
    const checks: TFsFieldLogicCheckLeafJson[] = [
      // @ts-ignore
      { field: 148456734, condition: "equals", option: "OptionA" },
    ];

    expect(TFsFieldLogicCheckLeafFromJson(checks)).toStrictEqual([
      { fieldId: "148456734", condition: "equals", option: "OptionA" },
    ]);
  });
  it("It should return empty array for undefined parameter.", () => {
    // @ts-ignore
    expect(TFsFieldLogicCheckLeafFromJson(undefined)).toStrictEqual([]);
  });
  it("It should return empty array for empty string as parameter.", () => {
    // @ts-ignore
    expect(TFsFieldLogicCheckLeafFromJson("")).toStrictEqual([]);
  });
  it("It should return empty array invalid parameter.", () => {
    // @ts-ignore
    expect(TFsFieldLogicCheckLeafFromJson({})).toStrictEqual([]);
  });
});
