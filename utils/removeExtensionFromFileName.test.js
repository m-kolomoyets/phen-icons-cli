import { removeExtensionFromFileName } from "./removeExtensionFromFileName.js";

describe("removeExtensionFromFileName()", () => {
  describe("when value is falsy", () => {
    it("should return an empty string when value is empty string", () => {
      expect(removeExtensionFromFileName("")).toBe("");
    });

    it("should return an empty string when value is undefined", () => {
      expect(removeExtensionFromFileName(undefined)).toBe("");
    });

    it("should return an empty string when value is null", () => {
      expect(removeExtensionFromFileName(null)).toBe("");
    });

    it("should return an empty string when value is 0", () => {
      expect(removeExtensionFromFileName(0)).toBe("");
    });

    it("should return trimmed empty string if empty string with spaces is passed", () => {
      expect(removeExtensionFromFileName(" ")).toBe("");
    });
  });

  describe("when value is defined", () => {
    it("should return the same value if there is no extension", () => {
      expect(removeExtensionFromFileName("Hello")).toBe("Hello");
    });

    it("should return the same string when path is without extension", () => {
      expect(removeExtensionFromFileName("Hello/World")).toBe("World");
    });

    it("should return the file name only, when extension is defined", () => {
      expect(removeExtensionFromFileName("World.txt")).toBe("World");
    });

    it("should return the file name only, when path is defined and extension too", () => {
      expect(removeExtensionFromFileName("Hello/World.txt")).toBe("World");
    });
  });
});
