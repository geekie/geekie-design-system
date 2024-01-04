import { themes } from '../../themes/themes';
import customStyleDictionary from './style-dictionary-config';

// default mode | semantic tokens
// These are the tokens exported with the token name as value
customStyleDictionary
  .extend({
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
  })
  .buildAllPlatforms();

themes.forEach((theme) => {
  customStyleDictionary
    .extend({
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
    })
    .buildAllPlatforms();
});
