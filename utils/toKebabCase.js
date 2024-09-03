/**
 * ## Transform a string to kebab case
 * @param {string} value  the value to convert to kebab case
 * @returns {string} the value in kebab case
 * @example toKebabCase("Hello World") // hello-world
 */
export const toKebabCase = (value) => {
  return value
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();
};
