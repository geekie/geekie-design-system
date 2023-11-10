import * as presetsSource from '../..';
import { formatTokenToWeb } from '../../../utils/formatTokenToWeb';
import { writeFile } from '../../../utils/writeFile';

export function toLessPresets(): string {
  console.log('\nConvertendo Presets para classes LESS\n');

  let content = '';
  const presets = Object.keys(presetsSource);
  presets.map((preset) => {
    content = content + `\n.${preset.toLowerCase().replace(/_/g, '-')} {\n`;
    const styles = Object.keys(
      presetsSource[preset as keyof typeof presetsSource]
    );
    styles.map((style) => {
      // @ts-expect-error TSFixMe: Preciso entender como tipar melhor isso aqui
      const value: number | string = presetsSource[preset][style];

      content =
        content +
        `  ${formatTokenToWeb({
          styleOrCategory: style,
          useVariables: false,
          value: `${value}`,
        })}\n`;

      return content;
    });

    content = content + `}\n`;
    return content;
  });

  writeFile({
    fileName: '_presets.less',
    filePath: '../built-presets/less/',
    data: content,
  });

  console.log('Os arquivos compilados estão em /build/less\n');

  return content;
}
