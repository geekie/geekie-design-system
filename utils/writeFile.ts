import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export function writeFile({
  filePath,
  fileName,
  data,
}: {
  filePath: string;
  fileName: string;
  data: string;
}): string {
  console.log('-----------------------------------------------\n');
  console.log(`Gravando o arquivo: ${fileName}\n`);

  const fileNameWithPath = `${filePath}${fileName}`;

  try {
    writeFileSync(join(__dirname, fileNameWithPath), data, {
      flag: 'w',
    });
  } catch (err) {
    console.error(err);
  }
  try {
    const contents = readFileSync(join(__dirname, fileNameWithPath), 'utf-8');
    if (contents.length > 0)
      console.log(`Arquivo salvo: ${fileNameWithPath}\n`);
  } catch (err) {
    console.log(err);
  }
  console.log('-----------------------------------------------\n');
  return fileNameWithPath;
}
