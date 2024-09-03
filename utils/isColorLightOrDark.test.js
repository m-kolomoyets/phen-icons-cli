import { isColorLightOrDark } from "./isColorLightOrDark.js";

describe("isColorLightOrDark()", () => {
  describe("falsy value", () => {
    it("should return false when value is empty string", () => {
      expect(isColorLightOrDark("")).toBe(false);
    });

    it("should return false when value is undefined", () => {
      expect(isColorLightOrDark(undefined)).toBe(false);
    });

    it("should return false when value is null", () => {
      expect(isColorLightOrDark(null)).toBe(false);
    });

    it("should return false when value is empty trimmed string", () => {
      expect(isColorLightOrDark(" ")).toBe(false);
    });
  });

  describe("when HEX color is passed", () => {
    it("should return true if the color is light for white", () => {
      expect(isColorLightOrDark("#ffffff")).toBe("light");
    });

    it("should return false if the color is dark for black", () => {
      expect(isColorLightOrDark("#000000")).toBe("dark");
    });

    it("should return true if the color is light for light gray", () => {
      expect(isColorLightOrDark("#f0f0f0")).toBe("light");
    });

    it("should return false if the color is dark for dark gray", () => {
      expect(isColorLightOrDark("#0f0f0f")).toBe("dark");
    });

    it("should return true if the color is light for red", () => {
      expect(isColorLightOrDark("#ff0000")).toBe("light");
    });

    it("should return true if the color is light for red with 3 digits", () => {
      expect(isColorLightOrDark("#f00")).toBe("light");
    });
  });

  describe("when RGB color is passed", () => {
    it("should return true if the color is light for white", () => {
      expect(isColorLightOrDark("rgb(255, 255, 255)")).toBe("light");
    });

    it("should return false if the color is dark for black", () => {
      expect(isColorLightOrDark("rgb(0, 0, 0)")).toBe("dark");
    });

    it("should return true if the color is light for light gray", () => {
      expect(isColorLightOrDark("rgb(240, 240, 240)")).toBe("light");
    });

    it("should return false if the color is dark for dark gray", () => {
      expect(isColorLightOrDark("rgb(15, 15, 15)")).toBe("dark");
    });

    it("should return true if the color is light for red", () => {
      expect(isColorLightOrDark("rgb(255, 0, 0)")).toBe("light");
    });

    it("should return true if the color is light for red with spaces", () => {
      expect(isColorLightOrDark("rgb(255, 0, 0)")).toBe("light");
    });
  });
});
