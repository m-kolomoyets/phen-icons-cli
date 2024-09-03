/**
 * ## Removes extension from a file name
 * @param {string} fileName the file name with extension
 * @returns {string} the file name without extension
 */
export const removeExtensionFromFileName = (fileName) => {
  return fileName.split("/").pop().split(".").shift();
};
