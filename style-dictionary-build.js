const StyleDictionary = require("style-dictionary");

// The storybook-design-token plugin expects the tokens to be split in categories separated by
// headers on the SCSS file, so we generate it accordingly. The code based on the suggestion from
// https://github.com/amzn/style-dictionary/issues/344#issuecomment-1200826141.
const DESIGN_TOKEN_CATEGORIES_BY_PREFIX = {
  "color-brand": { categoryName: "Brand Colors", presenterName: "Color" },
  "color-button": { categoryName: "Button Colors", presenterName: "Color" },
  "color-neutral": { categoryName: "Neutral Colors", presenterName: "Color" },
  "color-feedback": { categoryName: "Feedback Colors", presenterName: "Color" },
  "color-materias": { categoryName: "Materias Colors", presenterName: "Color" },
  "color-highlights": { categoryName: "Highlights Colors", presenterName: "Color" },
  "font-family": { categoryName: "Font families", presenterName: "FontFamily" },
  "font-size": { categoryName: "Font sizes", presenterName: "FontSize" },
  "font-weight": { categoryName: "Font weights", presenterName: "FontWeight" },
  "font-style": { categoryName: "Font styles", presenterName: "FontWeight" },
  "line-height": { categoryName: "Line heights", presenterName: "LineHeight" },
};

const extractTokenCategoryPrefix = (variable) => {
  if (variable) {
    return Object.keys(DESIGN_TOKEN_CATEGORIES_BY_PREFIX).find((prefix) =>
      variable.startsWith(prefix)
    );
  }
};

const formatCategory = ({ dictionary }) =>
  Object.entries(DESIGN_TOKEN_CATEGORIES_BY_PREFIX).map(
    ([prefix, names]) =>
      `\n/**
* @tokens ${names.categoryName}
* @presenter ${names.presenterName}
*/\n` +
      dictionary.allTokens
        .filter((token) => prefix === extractTokenCategoryPrefix(token.name))
        .map((token) => {
          const tokenCategory = extractTokenCategoryPrefix(token.name);
          const unit = tokenCategory == "font-size" ? "px" : "";
          return `--${token.name}: ${token.value}${unit};`;
        })
        .join("\n")
  );

StyleDictionary.registerFormat({
  name: `scss/variables-with-headers`,
  formatter: function ({ dictionary, file }) {
    return (
      StyleDictionary.formatHelpers.fileHeader({ file }) +
      ":root {" +
      formatCategory({ dictionary }).join("\n") +
      "\n}\n"
    );
  },
});

// APPLY THE CONFIGURATION
// IMPORTANT: the registration of custom transforms
// needs to be done _before_ applying the configuration
const StyleDictionaryExtended = StyleDictionary.extend(
  __dirname + "/style-dictionary-config.json"
);

// FINALLY, BUILD ALL THE PLATFORMS
StyleDictionaryExtended.buildAllPlatforms();

console.log("\n==============================================");
console.log("\nBuild completed!");
