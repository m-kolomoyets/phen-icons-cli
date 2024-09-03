import { validateRequiredString } from "./validateRequiredString.js";

describe("validateRequiredString()", () => {
  describe("value options, but fieldName is defined", () => {
    it("should return undefined if value is not empty", () => {
      expect(validateRequiredString("Hello World", "Name")).toBeUndefined();
    });

    it("should return error message if value is empty", () => {
      expect(validateRequiredString("", "Name")).toBe("Name is required");
    });

    it("should return error message if value is undefined", () => {
      expect(validateRequiredString(undefined, "Name")).toBe(
        "Name is required"
      );
    });

    it("should return error message if value is null", () => {
      expect(validateRequiredString(null, "Name")).toBe("Name is required");
    });

    it("should return error message if value is 0", () => {
      expect(validateRequiredString(0, "Name")).toBe("Name is required");
    });
  });

  describe("value and fieldName are undefined", () => {
    it("should return error message if value is empty", () => {
      expect(validateRequiredString("")).toBe("This field is required");
    });

    it("should return error message if value is undefined", () => {
      expect(validateRequiredString(undefined)).toBe("This field is required");
    });

    it("should return error message if value is null", () => {
      expect(validateRequiredString(null)).toBe("This field is required");
    });

    it("should return error message if value is 0", () => {
      expect(validateRequiredString(0)).toBe("This field is required");
    });
  });

  describe("value is defined, but fieldName is not", () => {
    it("should return undefined if value is not empty", () => {
      expect(validateRequiredString("Hello World")).toBeUndefined();
    });
  });
});
