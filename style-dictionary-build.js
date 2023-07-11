const StyleDictionary = require("style-dictionary");

// these are the tokens we have in our stylesheet
const DESIGN_TOKEN_NAMES_BY_TYPE = {
  color: { presenterName: "Color", categoryName: "Colors" },
  "font-family": { presenterName: "FontFamily", categoryName: "Font families" },
  "font-weight": { presenterName: "FontWeight", categoryName: "Font weights" },
  "font-size": { presenterName: "FontSize", categoryName: "Font sizes" },
  "line-height": { presenterName: "LineHeight", categoryName: "Line heights" },
};

// just get the token name from it, like: color
const extractTokenNameFromDictionaryName = (variable) => {
  if (variable) {
    return Object.keys(DESIGN_TOKEN_NAMES_BY_TYPE).find((type) =>
      variable.startsWith(type)
    );
  }
};

// Register your own format
StyleDictionary.registerFormat({
  name: `scss/variables-with-headers`,
  formatter: function ({ dictionary, file }) {
    return (
      StyleDictionary.formatHelpers.fileHeader({ file }) +
      ":root {\n" +
      Object.entries(DESIGN_TOKEN_NAMES_BY_TYPE)
        .map(
          ([type, names]) =>
            `\n/**
* @tokens ${names.categoryName}
* @presenter ${names.presenterName}
*/\n` +
            dictionary.allTokens
              .filter(
                (token) =>
                  type === extractTokenNameFromDictionaryName(token.name)
              )
              .map((token) => `--${token.name}: ${token.value};`)
              .join("\n")
        )
        .join("\n") +
      "}\n"
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
