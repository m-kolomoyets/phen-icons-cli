const RGB_TO_HSP_MULTIPLIERS = {
  r: 0.299,
  g: 0.587,
  b: 0.114,
};

const RGB_MATCH_REGEX = /^rgb/;
const RGB_COLORS_EXTRACT_REGEX =
  /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/;

const HSP_LIGHT_THRESHOLD = 127.5;
/**
 * ## Convert RGB to HSP
 * ### HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
 * @param {number} r Red color value (0-255)
 * @param {number} g Green color value (0-255)
 * @param {number} b  Blue color value (0-255)
 * @returns {number} HSP value
 * @example convertRGBToHSP(255, 0, 0) // 76.245039
 */
const convertRGBToHSP = (r, g, b) => {
  const redPartition = RGB_TO_HSP_MULTIPLIERS.r * (r * r);
  const greenPartition = RGB_TO_HSP_MULTIPLIERS.g * (g * g);
  const bluePartition = RGB_TO_HSP_MULTIPLIERS.b * (b * b);

  return Math.sqrt(redPartition + greenPartition + bluePartition);
};

/**
 * ## Convert Hex to RGB
 * @param {string} hex Hex color value
 * @returns {{r: number, g: number, b: number}} RGB color value
 * @example convertHexToRGB("#ff0000") // { r: 255, g: 0, b:
 */
export const convertHexToRGB = (hex) => {
  const rgbRaw = +("0x" + hex.slice(1).replace(hex.length < 5 && /./g, "$&$&"));

  return {
    r: rgbRaw >> 16,
    g: (rgbRaw >> 8) & 255,
    b: rgbRaw & 255,
  };
};

/**
 * ## Check if the color is light or dark
 * @param {string} color
 * @returns {'dark' | 'light'} criteria whether the color is dark or light
 * @example isColorLightOrDark("#ff0000") // "light"
 */
export const isColorLightOrDark = (color) => {
  if (!color || !color.trim()) {
    return false;
  }

  let r;
  let g;
  let b;
  let hsp;

  if (color.match(RGB_MATCH_REGEX)) {
    [, r, g, b] = color.match(RGB_COLORS_EXTRACT_REGEX);
  } else {
    const rgbFromHex = convertHexToRGB(color.toUpperCase());

    [r, g, b] = [rgbFromHex.r, rgbFromHex.g, rgbFromHex.b];
  }

  hsp = convertRGBToHSP(r, g, b);

  if (hsp > HSP_LIGHT_THRESHOLD) {
    return "light";
  } else {
    return "dark";
  }
};
