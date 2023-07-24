import { MultipleLogicTreeError } from "./MultipleLogicTreeError";
describe("MultipleLogicTreeError", () => {
  it('Should have "name" field set.', () => {
    const willThrow = () => {
      throw new MultipleLogicTreeError("SOME MULTIPLE LOGIC ERROR MESSAGE.");
    };
    expect(willThrow).toThrow(MultipleLogicTreeError);
    expect(willThrow).toThrow("SOME MULTIPLE LOGIC ERROR MESSAGE.");
  });

  it('Should have "code" and "name" field set.', () => {
    let error: Error;
    try {
      throw new MultipleLogicTreeError("SOME INTERDEPENDENT ERROR MESSAGE.");
    } catch (e) {
      error = e as MultipleLogicTreeError;
    }

    expect(error.name).toStrictEqual("MultipleLogicTreeError");
    // @ts-ignore -- ts doesn't like the use of '.code' and I have not yet figured out why
    expect(error.code).toStrictEqual("ERR_MULTIPLE_LOGIC_TREE");
  });
  it("Should accept a debugObject and return it as a property.", () => {
    let error: MultipleLogicTreeError;
    const someDebugObject = {
      treeA: { fieldId: "1" },
      treeB: { fieldId: "2" },
      interdependentFieldIds: ["1", 2],
    };
    try {
      throw new MultipleLogicTreeError(
        "SOME INTERDEPENDENT ERROR MESSAGE.",
        someDebugObject
      );
    } catch (e) {
      error = e as MultipleLogicTreeError;
    }

    expect(error.debugObject).toBe(someDebugObject);
  });
});
