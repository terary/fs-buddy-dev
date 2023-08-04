import { TFsFieldAnyFromJson } from "./TFsFieldAnyFromJson";
import form5389250Json from "../../test-dev-resources/form-json/5389250.json";
import { TFsFieldAnyJson } from "../classes/types";
import { TFsFieldAny } from "../type.field";

describe("TFsFieldAnyFromJson", () => {
  it("Should convert json into TFsFieldAny type", () => {
    const x: TFsFieldAny = TFsFieldAnyFromJson(
      form5389250Json.fields[0] as unknown as TFsFieldAnyJson
    );
    expect(x.id).toEqual("148992040");
    expect(x.readonly).toEqual("0");
    expect(x.calculation).toEqual(
      "[148992238] + [148992061] / [148992069] ( 4 * 2 )"
    );
    expect(x.type).toEqual("text");
  });
});
/**
 * Not sure what to do here.  I think best leave it and implement whatever
 * necessary transformations as they come-up? or better, look at joi
 *
 *
 * Then move on to TApiFormFromJson()
 *
 *  */
