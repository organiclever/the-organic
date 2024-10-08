import { hello } from "../index";

describe("hello function", () => {
  it("should return a greeting with the given name", () => {
    expect(hello("World")).toBe("Hello, World!");
    expect(hello("ayokoding-web")).toBe("Hello, ayokoding-web!");
  });

  it("should handle empty string", () => {
    expect(hello("")).toBe("Hello, !");
  });

  it("should handle special characters", () => {
    expect(hello("John Doe!")).toBe("Hello, John Doe!!");
  });
});
