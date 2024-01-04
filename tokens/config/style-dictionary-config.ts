import StyleDictionary from 'style-dictionary';
import { formatLessToken, formatScssToken } from './customFormats';

const customStyleDictionary = StyleDictionary;

// FORMAT

customStyleDictionary.registerFormat({
  name: `scss/variables-with-headers`,
  formatter: function ({ dictionary, file }) {
    return (
      customStyleDictionary.formatHelpers.fileHeader({ file }) +
      ':root {' +
      formatScssToken({
        dictionary,
        platform: 'scss',
      }) +
      '\n}\n'
    );
  },
});

customStyleDictionary.registerFormat({
  name: `less/variables-with-size-unit`,
  formatter: function ({ dictionary, file }) {
    return (
      customStyleDictionary.formatHelpers.fileHeader({ file }) +
      formatLessToken({
        dictionary,
        platform: 'less',
      }) +
      '\n'
    );
  },
});

// TRANSFORMS

customStyleDictionary.registerTransformGroup({
  name: 'custom/js',
  transforms: customStyleDictionary.transformGroup.js
    .filter((transform) => transform !== 'color/hex')
    .concat(['color/css', 'name/cti/constant']),
});

customStyleDictionary.registerTransformGroup({
  name: 'custom/scss',
  transforms: customStyleDictionary.transformGroup.scss.concat([
    'name/cti/constant',
  ]),
});

customStyleDictionary.registerTransformGroup({
  name: 'custom/less',
  transforms: customStyleDictionary.transformGroup.less
    .filter((transform) => transform !== 'color/hex')
    .concat(['color/css', 'name/cti/constant']),
});

export default customStyleDictionary;
