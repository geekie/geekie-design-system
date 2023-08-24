module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['standard-with-typescript', 'plugin:react/recommended', 'prettier'],
  ignorePatterns: ['.eslintrc.js', 'build/**'],
  parserOptions: {
    ecmaVersion: 'latest',
    project: ['tsconfig.json'],
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {},
  settings: {
    react: {
      version: 'detect',
    },
  },
};
