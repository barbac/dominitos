module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
  },
  parser: 'babel-eslint',
  rules: {
    'no-console': 0,
    quotes: ['error', 'single'],
    semi: ['error', 'always'],

    'react/prop-types': [0],
    'react/display-name': [0],
  },
};
