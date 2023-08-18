import path from 'path';
import StyleDictionary from 'style-dictionary';
import type { Dictionary } from 'style-dictionary/types/Dictionary';

// The storybook-design-token plugin expects the tokens to be split in categories separated by
// headers on the SCSS file, so we generate it accordingly. The code based on the suggestion from
// https://github.com/amzn/style-dictionary/issues/344#issuecomment-1200826141.
const DESIGN_TOKEN_CATEGORIES_BY_PREFIX = {
  DSA_COLOR_BRAND: { categoryName: 'Brand Colors', presenterName: 'Color' },
  DSA_COLOR_BUTTON: { categoryName: 'Button Colors', presenterName: 'Color' },
  DSA_COLOR_NEUTRAL: { categoryName: 'Neutral Colors', presenterName: 'Color' },
  DSA_COLOR_FEEDBACK: {
    categoryName: 'Feedback Colors',
    presenterName: 'Color',
  },
  DSA_COLOR_MATERIAS: {
    categoryName: 'Materias Colors',
    presenterName: 'Color',
  },
  DSA_COLOR_HIGHLIGHTS: {
    categoryName: 'Highlights Colors',
    presenterName: 'Color',
  },
  DSA_FONT_FAMILY: {
    categoryName: 'Font families',
    presenterName: 'FontFamily',
  },
  DSA_FONT_SIZE: { categoryName: 'Font sizes', presenterName: 'FontSize' },
  DSA_FONT_WEIGHT: {
    categoryName: 'Font weights',
    presenterName: 'FontWeight',
  },
  DSA_LINE_HEIGHT: {
    categoryName: 'Line heights',
    presenterName: 'LineHeight',
  },
  DSA_LETTER_SPACING: {
    categoryName: 'Letter spacings',
    presenterName: 'LetterSpacing',
  },
};
type TokenCategoryPrefix = keyof typeof DESIGN_TOKEN_CATEGORIES_BY_PREFIX;

const extractTokenCategoryPrefix = (
  tokenName: string
): TokenCategoryPrefix | undefined => {
  return (
    Object.keys(DESIGN_TOKEN_CATEGORIES_BY_PREFIX) as TokenCategoryPrefix[]
  ).find((prefix) => tokenName.startsWith(prefix));
};

const formatCategory = ({ dictionary }: { dictionary: Dictionary }): string[] =>
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
          const unit =
            tokenCategory === 'DSA_FONT_SIZE' ||
            tokenCategory === 'DSA_LINE_HEIGHT' ||
            tokenCategory === 'DSA_LETTER_SPACING'
              ? 'px'
              : '';
          return `$${token.name}: ${token.value as number}${unit};`;
        })
        .join('\n')
  );

StyleDictionary.registerFormat({
  name: `scss/variables-with-headers`,
  formatter: function ({ dictionary, file }) {
    return (
      StyleDictionary.formatHelpers.fileHeader({ file }) +
      ':root {' +
      formatCategory({ dictionary }).join('\n') +
      '\n}\n'
    );
  },
});

StyleDictionary.registerTransformGroup({
  name: 'custom/js',
  transforms: StyleDictionary.transformGroup.js
    .filter((transform) => transform !== 'color/hex')
    .concat(['color/css', 'name/cti/constant']),
});

StyleDictionary.registerTransformGroup({
  name: 'custom/scss',
  transforms: StyleDictionary.transformGroup.scss.concat(['name/cti/constant']),
});

// APPLY THE CONFIGURATION
// IMPORTANT: the registration of custom transforms
// needs to be done _before_ applying the configuration
const StyleDictionaryExtended = StyleDictionary.extend(
  path.join(__dirname, '/style-dictionary-config.json')
);

// FINALLY, BUILD ALL THE PLATFORMS
StyleDictionaryExtended.buildAllPlatforms();

console.log('\n==============================================');
console.log('\nBuild completed!');
