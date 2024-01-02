import StyleDictionary from 'style-dictionary';
import type { Dictionary } from 'style-dictionary/types/Dictionary';
import { formatTokenToWeb } from '../../utils/formatTokenToWeb';
import { themes } from '../../themes';

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

// not themed tokens
// These are all the tokens that are not changed by themes
StyleDictionary.extend({
  source: [`tokens/src/core/**/!(*.${themes.join(`|*.`)}).json`],
  platforms: {
    ts: {
      transformGroup: `custom/js`,
      prefix: 'dsa',
      buildPath: 'built-tokens/js/',
      files: [
        {
          format: 'javascript/es6',
          destination: 'tokens.ts',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
    scss: {
      transformGroup: `custom/scss`,
      prefix: 'dsa',
      buildPath: 'built-tokens/scss/',
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables',
          options: {
            outputReferences: true,
          },
        },
        {
          destination: '_variables_with_headers.scss',
          format: 'scss/variables-with-headers',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
    less: {
      transformGroup: `custom/less`,
      prefix: 'dsa',
      buildPath: 'built-tokens/less/',
      files: [
        {
          destination: '_tokens.less',
          format: 'less/variables-with-size-unit',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
}).buildAllPlatforms();

// default mode | semantic tokens
// These are the tokens exported with the token name as value
StyleDictionary.extend({
  source: [`tokens/src/semantic/**/!(*.${themes.join(`|*.`)}).json`],
  platforms: {
    ts: {
      transformGroup: `custom/js`,
      buildPath: 'built-tokens/js/',
      files: [
        {
          format: 'javascript/es6',
          destination: 'semantic-tokens.ts',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
}).buildAllPlatforms();

themes.forEach((theme) => {
  StyleDictionary.extend({
    include: [`tokens/**/**/!(*.${themes.join(`|*.`)}).json`],
    source: [`tokens/**/**/*.${theme}.json`],
    platforms: {
      ts: {
        transformGroup: `custom/js`,
        prefix: 'dsa',
        buildPath: 'built-tokens/js/',
        files: [
          {
            format: 'javascript/es6',
            destination: `${theme}-tokens.ts`,
            filter: (token) => token.filePath.includes(`.${theme}`),
            options: {
              outputReferences: true,
            },
          },
        ],
      },
    },
  }).buildAllPlatforms();
});

console.log('\n==============================================');
console.log('\nBuild completed!');
