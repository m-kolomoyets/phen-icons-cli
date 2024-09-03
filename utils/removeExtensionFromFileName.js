/**
 * ## Removes extension from a file name
 * @param {string} fileName the file name with extension
 * @returns {string} the file name without extension
 */
export const removeExtensionFromFileName = (fileName) => {
  if (!fileName || !fileName.trim()) {
    return "";
  }

  return fileName.trim().split("/").pop().split(".").shift();
};
