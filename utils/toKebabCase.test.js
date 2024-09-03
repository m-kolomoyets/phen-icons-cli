import { toKebabCase } from "./toKebabCase.js";

describe("toKebabCase()", () => {
  describe("when value is falsy", () => {
    it("should return an empty string when value is empty string", () => {
      expect(toKebabCase("")).toBe("");
    });

    it("should return an empty string when value is undefined", () => {
      expect(toKebabCase(undefined)).toBe("");
    });

    it("should return an empty string when value is null", () => {
      expect(toKebabCase(null)).toBe("");
    });

    it("should return an empty string when value is 0", () => {
      expect(toKebabCase(0)).toBe("");
    });

    it("should return trimmed empty string if empty string with spaces is passed", () => {
      expect(toKebabCase(" ")).toBe("");
    });
  });

  describe("when value is defined", () => {
    it("when one word is passed", () => {
      expect(toKebabCase("Hello")).toBe("hello");
    });

    it("when one word with trimmable spaces is passed", () => {
      expect(toKebabCase("  Hello  ")).toBe("hello");
    });

    it("when two words are passed", () => {
      expect(toKebabCase("Hello World")).toBe("hello-world");
    });

    it("when two words with trimmable spaces are passed", () => {
      expect(toKebabCase("  Hello    World  ")).toBe("hello-world");
    });
  });
});
