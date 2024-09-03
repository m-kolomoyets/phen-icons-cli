/**
 * ## Validates a string value to be required
 * @param {string} value The value to validate
 * @param {string} fieldName  The name of the field to validate (Default:`This field`)
 * @returns {string | undefined} Error message if the value is empty
 * @example validateRequiredString("Hello World", "Name") // undefined
 * @example validateRequiredString("", "Name") // "Name is required"
 */
export const validateRequiredString = (value, fieldName = "This field") => {
  if (!value) {
    return `${fieldName} is required`;
  }
};
