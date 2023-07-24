import { InterdependencyError } from "./InterdependencyError";
describe("InterdependencyError", () => {
  it('Should have "name" field set.', () => {
    const willThrow = () => {
      throw new InterdependencyError("SOME INTERDEPENDENT ERROR MESSAGE.");
    };
    expect(willThrow).toThrow(InterdependencyError);
    expect(willThrow).toThrow("SOME INTERDEPENDENT ERROR MESSAGE.");
  });

  it('Should have "code" and "name" field set.', () => {
    let error: Error;
    try {
      throw new InterdependencyError("SOME INTERDEPENDENT ERROR MESSAGE.");
    } catch (e) {
      error = e as InterdependencyError;
    }

    expect(error.name).toStrictEqual("InterdependencyError");
    // @ts-ignore -- ts doesn't like the use of '.code' and I have not yet figured out why
    expect(error.code).toStrictEqual("ERR_INTERDEPENDENCY");
  });
  it("Should accept a debugObject and return it as a property.", () => {
    let error: InterdependencyError;
    const someDebugObject = {
      treeA: { fieldId: "1" },
      treeB: { fieldId: "2" },
      interdependentFieldIds: ["1", 2],
    };
    try {
      throw new InterdependencyError(
        "SOME INTERDEPENDENT ERROR MESSAGE.",
        someDebugObject
      );
    } catch (e) {
      error = e as InterdependencyError;
    }

    expect(error.debugObject).toBe(someDebugObject);
  });
});
