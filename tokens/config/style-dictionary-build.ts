import StyleDictionary from 'style-dictionary';
import type { Dictionary } from 'style-dictionary/types/Dictionary';
import { formatTokenToWeb } from '../../utils/formatTokenToWeb';
import config from './style-dictionary-config.json';

const modes = [`light`, `dark`];

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

const formatTokens = ({
  dictionary,
  addCategoryAnnotation,
  platform,
}: {
  dictionary: Dictionary;
  addCategoryAnnotation: boolean;
  platform: string;
}): string => {
  let content = '';
  Object.entries(DESIGN_TOKEN_CATEGORIES_BY_PREFIX).map(([prefix, names]) => {
    content =
      content +
      `${
        addCategoryAnnotation
          ? `\n/**
* @tokens ${names.categoryName}
* @presenter ${names.presenterName}
*/\n`
          : ''
      }`;
    dictionary.allTokens
      .filter((token) => prefix === extractTokenCategoryPrefix(token.name))
      .map((token) => {
        const tokenCategory = extractTokenCategoryPrefix(token.name);
        content =
          content +
          `${formatTokenToWeb({
            styleOrCategory: tokenCategory as string,
            useVariables: true,
            value: `${token.value as number}`,
            platform,
            tokenName: token.name,
          })}` +
          '\n';
        return content;
      });

    return content;
  });
  return content;
};

const formatScssToken = ({
  dictionary,
  platform,
}: {
  dictionary: Dictionary;
  platform: string;
}): string =>
  formatTokens({ dictionary, addCategoryAnnotation: true, platform });

const formatLessToken = ({
  dictionary,
  platform,
}: {
  dictionary: Dictionary;
  platform: string;
}): string =>
  formatTokens({ dictionary, addCategoryAnnotation: false, platform });

StyleDictionary.registerFormat({
  name: `scss/variables-with-headers`,
  formatter: function ({ dictionary, file }) {
    return (
      StyleDictionary.formatHelpers.fileHeader({ file }) +
      ':root {' +
      formatScssToken({
        dictionary,
        platform: 'scss',
      }) +
      '\n}\n'
    );
  },
});

StyleDictionary.registerFormat({
  name: `less/variables-with-size-unit`,
  formatter: function ({ dictionary, file }) {
    return (
      StyleDictionary.formatHelpers.fileHeader({ file }) +
      formatLessToken({
        dictionary,
        platform: 'less',
      }) +
      '\n'
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

StyleDictionary.registerTransformGroup({
  name: 'custom/less',
  transforms: StyleDictionary.transformGroup.less
    .filter((transform) => transform !== 'color/hex')
    .concat(['color/css', 'name/cti/constant']),
});

// APPLY THE CONFIGURATION
// IMPORTANT: the registration of custom transforms
// needs to be done _before_ applying the configuration

// light/default mode
StyleDictionary.extend({
  ...config,
  source: [
    // this is saying find any files in the tokens folder
    // that does not have .dark or .light, but ends in .json5
    `tokens/**/**/!(*.${modes.join(`|*.`)}).json`,
  ],
  platforms: {
    ...config.platforms,
    ts: {
      transformGroup: `custom/js`,
      prefix: "dsa",
      buildPath: 'built-tokens/js/',
      files: [
        {
          format: "javascript/es6",
          destination: "tokens.ts",
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
}).buildAllPlatforms();

// dark mode
StyleDictionary.extend({
  ...config,
  include: [
    `tokens/**/**/!(*.${modes.join(`|*.`)}).json`,
  ],
  source: [
    `tokens/**/**/*.dark.json`,
  ],
  platforms: {
    ...config.platforms,
    ts: {
      transformGroup: `custom/js`,
      prefix: "dsa",
      buildPath: 'built-tokens/js/',
      files: [
        {
          format: "javascript/es6",
          destination: "dark-tokens.ts",
          filter: (token) => token.filePath.includes(`.dark`),
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
}).buildAllPlatforms();

console.log('\n==============================================');
console.log('\nBuild completed!');
