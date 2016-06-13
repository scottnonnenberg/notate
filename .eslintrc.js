/* eslint-disable import/no-commonjs */

module.exports = {
  settings: {
    'import/resolver': {
      node: {
        paths: [__dirname],
      },
    },
  },

  plugins: [
    'thehelp',
  ],
  extends: [
    'thehelp/core',
    'thehelp/es2015',
    // no functional because, at its core, this project is about modifying error objects!
  ],

  rules: {
    'complexity': 'off',
    'max-statements': 'off',
    'no-console': 'off',

    'security/detect-object-injection': 'off',
  },
};
