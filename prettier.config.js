/** @type {import('prettier').Config} */
export default {
  trailingComma: 'all',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  printWidth: 100,
  bracketSpacing: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: ['<THIRD_PARTY_MODULES>', '^@/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['jsx', 'classProperties', 'decorators-legacy', 'typescript'],
};
