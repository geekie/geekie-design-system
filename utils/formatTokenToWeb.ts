export function formatTokenToWeb({
  styleOrCategory,
  useVariables,
  value,
  platform,
  tokenName = '',
}: {
  styleOrCategory: string;
  useVariables: boolean;
  value: string;
  platform?: string;
  tokenName?: string;
}): string {
  const formatedStyleOrCategory = styleOrCategory
    .toLowerCase()
    .replaceAll('_', '');

  const formattedValue =
    formatedStyleOrCategory.includes('fontsize') ||
    formatedStyleOrCategory.includes('lineheight') ||
    formatedStyleOrCategory.includes('letterspacing')
      ? `${value}px`
      : formatedStyleOrCategory.includes('fontfamily')
      ? `'${value}'`
      : value;

  const formattedStyle = `${
    useVariables
      ? tokenName
      : styleOrCategory.replace(/[A-Z]/g, '-$&').toLowerCase()
  }`;

  return `${
    platform === 'scss' ? '$' : platform === 'less' ? '@' : ''
  }${formattedStyle}: ${formattedValue};`;
}
