import fs from "fs";
import path from "path";
import { parse as svgsonParse } from "svgson";
import { optimize } from "svgo";
import { removeExtensionFromFileName } from "./removeExtensionFromFileName.js";
import { isColorLightOrDark } from "./isColorLightOrDark.js";
import { toKebabCase } from "./toKebabCase.js";
import { SVG_POSSIBLE_CHILD_VALUES_TO_CURRENT_COLOR } from "./../constants.js";

/**
 * ## Reads all the files in a directory by extension
 * @param {string} startPath the path to the directory files should be read from
 * @param {`.{string}`} filter the file extension to filter by
 * @returns {string[]} array of file names (paths from project root)
 * @example readAllFilesInDirectoryByExtension("src/assets/icons", ".svg") // ["src/assets/icons/icon1.svg", "src/assets/icons/icon2.svg"]
 */
export const readAllFilesInDirectoryByExtension = (
  startPath,
  filter = ".svg"
) => {
  if (!fs.existsSync(startPath)) {
    log.error("No such directory found: ", startPath);
    return [];
  }

  const files = fs.readdirSync(startPath);

  const fileNames = [];

  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);

    const stat = fs.lstatSync(filename);

    if (stat.isDirectory()) {
      readAllFilesInDirectoryByExtension(filename, filter);
    } else if (filename.endsWith(filter)) {
      fileNames.push(filename);
    }
  }

  return fileNames;
};

/**
 * ## Converts the color of the children of the SVG element to currentColor
 * @param {import("svgson").INode} child the JSON element parsed from the SVG
 * @returns {import("svgson").INode} the JSON element with the color set to currentColor
 * @example convertChildrenColorToCurrentColor({ name: "path", attributes: { fill: "#000" } }) // { name: "path", attributes: { fill: "currentColor" } }
 */
export const convertChildrenColorToCurrentColor = (child) => {
  if (SVG_POSSIBLE_CHILD_VALUES_TO_CURRENT_COLOR.includes(child.name)) {
    if (
      !!child.attributes?.fill &&
      isColorLightOrDark(child.attributes.fill) === "dark"
    ) {
      child.attributes.fill = "currentColor";
    } else if (
      !!child.attributes?.stroke &&
      isColorLightOrDark(child.attributes.stroke) === "dark"
    ) {
      child.attributes.stroke = "currentColor";
    }
  }

  if (child.children.length) {
    return {
      ...child,
      children: child.children.map(convertChildrenColorToCurrentColor),
    };
  }

  return child;
};

/**
 * ## Gets the JSON representation of the SVG file
 * @param {string} path  the path to the SVG file
 * @returns {Promise<import("svgson").INode>} the JSON representation of the SVG
 */
export const getSvgJSON = async (path) => {
  const svgFolder = path.split("/").slice(0, -1).join("/");
  const svgFileName = path.split("/").pop();

  const svgContent = await fs.readFileSync(path, "utf8");

  const optimizedSvg = await optimize(svgContent, {
    path: `${svgFolder}/compressed/${svgFileName}.svg`,
    multipass: true,
  });

  const json = await svgsonParse(optimizedSvg.data, {
    transformNode(node) {
      const iconIdWithoutSize = toKebabCase(removeExtensionFromFileName(path));
      const iconSize = node.attributes.width;

      node.name = "symbol";
      node.attributes.viewBox = `0 0 ${node.attributes.width} ${node.attributes.height}`;

      delete node.attributes.width;
      delete node.attributes.height;
      delete node.attributes.xmlns;

      node.attributes.name = iconIdWithoutSize;
      node.attributes.size = iconSize;
      node.attributes.id = `icon-${iconIdWithoutSize}_${iconSize}`;

      node.children = node.children.map(convertChildrenColorToCurrentColor);

      return node;
    },
  });

  return json;
};
