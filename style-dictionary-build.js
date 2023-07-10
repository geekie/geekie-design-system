const StyleDictionary = require("style-dictionary");

// these are the tokens we have in our stylesheet
const DESIGN_TOKEN_TYPES = [
  "color"
];

// just get the token name from it, like: color
const extractTokenNameFromDictionaryName = (variable) => {
  if (variable) {
    const [, name] = variable.match(/([^-]+)/);
    return name;
  }
};

// Capitalize first letter to respect the addon parser for finding the right Presenter
const sanitizeString = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Register your own format
StyleDictionary.registerFormat({
  name: `scss/variables-with-headers`,
  formatter: function ({ dictionary, file }) {
    return (
      StyleDictionary.formatHelpers.fileHeader({ file }) +
      ":root {\n" +
      DESIGN_TOKEN_TYPES.map(
        (item) =>
          `\n/**
* @tokens ${sanitizeString(item)}s
* @presenter ${sanitizeString(item)}
*/\n` +
          dictionary.allTokens
            .filter(
              (token) => item === extractTokenNameFromDictionaryName(token.name)
            )
            .map((token) => `--${token.name}: ${token.value};`)
            .join("\n")
      ).join("\n") +
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
