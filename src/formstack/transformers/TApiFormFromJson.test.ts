import { TApiFormFromJson } from "./TApiFormFromJson";
import form5389250Json from "../../test-dev-resources/form-json/5389250.json";
import { TApiForm, TApiFormJson } from "../type.form";

describe("TApiFormFromJson", () => {
  it("Should be awesome", () => {
    const f: TApiForm = TApiFormFromJson(
      form5389250Json as unknown as TApiFormJson
    );

    expect(f.id).toEqual("5389250");
    expect(f.fields.length).toEqual(7);
    expect(f.fields[0].id).toStrictEqual("148992040");
    // TApiFormFromJson
  });
});
