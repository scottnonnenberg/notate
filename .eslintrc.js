module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": true,
    "mocha": true
  },

  "parser": "babel-eslint",
  "plugins": [
    "thehelp"
  ],
  "extends": [
    "eslint:recommended"
  ],

  "rules": {
    "indent": [2, 2, {"SwitchCase": 1}],
    "linebreak-style": [2, "unix"],
    "quotes": [2, "single"],
    "semi": [2, "always"],
    "no-console": [0],
    "thehelp/absolute-or-current-dir": [2]
  }
};
