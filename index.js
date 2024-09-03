import {
  intro,
  outro,
  spinner,
  cancel,
  log,
  text,
  group,
  note,
} from "@clack/prompts";
import color from "picocolors";
import fs from "fs";
import { stringify as svgsonStringify } from "svgson";
import { validateRequiredString } from "./utils/validateRequiredString.js";
import { timer } from "./utils/timer.js";
import {
  readAllFilesInDirectoryByExtension,
  getSvgJSON,
} from "./utils/common.js";

const terminalLoader = spinner();
const executionTimer = timer();

const main = async () => {
  intro(color.bgYellow(color.black("Welcome to Phenomenon Icons CodeGen CLI")));
  note(
    `${color.bold(
      color.white(
        `Uploaded SVG files should be in separate folder in ${color.green(
          "/public"
        )} directory in the root of your project`
      )
    )}\n\n${color.italic(
      color.white(
        "[Hint]: It will let you remove the folder after CLI completes its work"
      )
    )}\n\n${color.bold(
      color.white(
        "If you have not done it yet, please create a folder, upload necessary files there and restart the CLI"
      )
    )}`,
    "How to use:"
  );

  const response = await group(
    {
      svgPath() {
        return text({
          message: "What is the path to the SVG files?",
          placeholder: "public/svg",
          validate(value) {
            const requiredStringValidation = validateRequiredString(
              value,
              "SVG Path"
            );

            if (requiredStringValidation) {
              return requiredStringValidation;
            }

            if (!value.startsWith("public")) {
              return "SVG files should be stored in the public directory";
            }

            if (!fs.existsSync(value)) {
              const availableFolders = fs
                .readdirSync("public", { withFileTypes: true })
                .filter((entry) => {
                  return entry.isDirectory();
                })
                .map((directory) => {
                  return directory.name;
                });

              return `No such directory found. Available folders: ${availableFolders.join(
                ", "
              )}`;
            }
          },
        });
      },
      iconComponentPath() {
        return text({
          message: "Where is the <Icon /> component located?",
          placeholder: "src/components/Icon",
          validate(value) {
            const requiredStringValidation = validateRequiredString(
              value,
              "Icon Component Path"
            );

            if (requiredStringValidation) {
              return requiredStringValidation;
            }
          },
        });
      },
    },
    {
      onCancel() {
        cancel(color.bgRed(color.white("Operation was canceled!")));
        process.exit(0);
      },
    }
  );

  executionTimer.start();

  //   ===
  terminalLoader.start(`🚀 Getting icons from ${response.svgPath}`);

  const fileNames = readAllFilesInDirectoryByExtension(
    response.svgPath,
    ".svg"
  );

  terminalLoader.stop(
    `✅ Found ${color.green(fileNames.length)} files with the ${color.yellow(
      ".svg"
    )} extension`
  );

  //   ===
  terminalLoader.start("🚀 Generating icons mappings");
  const iconsMap = {};
  const possibleIconSizes = new Set();

  const results = await Promise.allSettled(
    fileNames.map(async (fileName) => {
      return await getSvgJSON(fileName);
    })
  );

  console.log(results);

  const fulfilledResults = results.filter(({ status }) => {
    return status === "fulfilled";
  });

  fulfilledResults.forEach(({ value }) => {
    possibleIconSizes.add(value.attributes.size);
    iconsMap[value.attributes.name] = [
      ...(iconsMap?.[value.attributes.name] ?? []),
      value.attributes.size,
    ];
  });

  terminalLoader.stop(
    `✅ Generated ${color.green(fulfilledResults.length)} icons mapping with ${
      possibleIconSizes.size
    } size${possibleIconSizes.size > 1 ? "s" : ""}: [${Array.from(
      possibleIconSizes
    ).join(", ")}]`
  );

  //   ===
  terminalLoader.start(
    `🚀 Generating ${color.green("sprite.svg")} file for ${color.green(
      fulfilledResults.length
    )} icons`
  );
  const spriteSVGFilePath =
    response.svgPath.split("/").slice(0, -1).join("/") + "/sprite.svg";

  if (fs.existsSync(spriteSVGFilePath)) {
    fs.unlink(spriteSVGFilePath, (error) => {
      if (error) {
        log.error("Error deleting sprite.svg file", error);
        log.warning("Please delete the file manually and restart the CLI");
        process.exit(2);
      }

      log.info("Old sprite.svg file was deleted. Creating a new one...");
    });
  }

  const spriteSVGStream = fs.createWriteStream(spriteSVGFilePath);

  spriteSVGStream.once("open", () => {
    spriteSVGStream.write('<svg xmlns="http://www.w3.org/2000/svg">\n');
    spriteSVGStream.write("<defs>\n");

    fulfilledResults.forEach(({ value }) => {
      spriteSVGStream.write(`${svgsonStringify(value)}\n`);
    });

    spriteSVGStream.write("</defs>\n");
    spriteSVGStream.write("</svg>\n");

    spriteSVGStream.end();
  });

  terminalLoader.stop(
    `✅ Sprite was generated at ${color.green(`${spriteSVGFilePath}`)}`
  );

  //   ===
  terminalLoader.start("🚀 Generating <Icon /> component types");

  const iconComponentTypesPath = `${response.iconComponentPath}/types.ts`;

  const iconTypesStream = fs.createWriteStream(iconComponentTypesPath);

  if (fs.existsSync(iconComponentTypesPath)) {
    log.info(
      `${color.blue(
        "types.ts"
      )} file already exists. The content will be extended...`
    );
  }
  const transformedIconsMap = Object.entries(iconsMap).reduce(
    (acc, [iconId, iconSize]) => {
      if (!acc?.[iconSize]) {
        acc[iconSize] = [iconId];
        return acc;
      }

      return {
        ...acc,
        [iconSize]: [...acc[iconSize], iconId],
      };
    },
    {}
  );

  iconTypesStream.once("open", () => {
    let iconSizesTypes = [];
    Object.entries(transformedIconsMap).forEach(([iconSize, iconIds]) => {
      const iconSizeType = `IconsWith${iconSize}Size`;
      iconSizesTypes.push(iconSizeType);

      iconTypesStream.write(`\n\n\nexport type ${iconSizeType} = {`);
      iconTypesStream.write(`\n size: ${iconSize};`);
      iconTypesStream.write("\n id: ");
      iconIds.forEach((iconId) => {
        iconTypesStream.write(`\n  | 'icon-${iconId}_${iconSize}'`);
      });
      iconTypesStream.write(`\n }`);
    });

    iconTypesStream.write(
      `\n\n\nexport type IconSizeAndIdProps = ${iconSizesTypes.join(" | ")}`
    );

    iconTypesStream.close();
  });

  terminalLoader.stop(
    "✅ <Icon /> types.ts file extended with icons IDs and sizes"
  );

  const executionDelta = executionTimer.getDeltaInSeconds();

  outro(
    `${color.bgGreen(`${color.black(`All done!`)}`)} (in ${color.green(
      executionDelta.toFixed(6)
    )} seconds)`
  );
  note(
    `Added Icons: ${fileNames.length};\n\nIcon sizes: [${Object.keys(
      transformedIconsMap
    ).join()}]
      \n\nSprite path: public/sprite.svg;\n\nIcon IDs and sizes types path: ${
        response.iconComponentPath
      }/types.ts`,
    "Summary:"
  );
  note(
    "It will autocomplete the icon names and sizes exist for the icon and vice versa.",
    "You can now use the <Icon /> component in your project."
  );
};

main().catch(console.error);
