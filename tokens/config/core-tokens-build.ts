import { themes } from '../../themes/themes';
import customStyleDictionary from './style-dictionary-config';

// not themed tokens
// These are all the tokens that are not changed by themes
customStyleDictionary
  .extend({
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
  })
  .buildAllPlatforms();

console.log('\n==============================================');
console.log('\nBuild completed!');
