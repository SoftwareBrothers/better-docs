module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "mocha"],
  env: {
    es6: true,
    node: true,
    mocha: true,
  },
  extends: [
    "airbnb",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/essential",
  ],
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: "module",
  },
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"],
    semi: ["error", "never"],
    "import/no-unresolved": "off",
    "no-underscore-dangle": "off",
    "guard-for-in": "off",
    "no-restricted-syntax": "off",
    "no-await-in-loop": "off",
    "object-curly-newline": "off",
  },
  overrides: [
    {
      files: [
        "*-test.js",
        "*.spec.js",
        "*-test.ts",
        "*.spec.ts",
        "*.spec.tsx",
        "*.factory.ts",
        "*.factory.js",
      ],
      rules: {
        "no-unused-expressions": "off",
        "func-names": "off",
        "prefer-arrow-callback": "off",
      },
    },
    {
      files: ["*.jsx", "*.js"],
      rules: { "@typescript-eslint/explicit-function-return-type": "off" },
    },
    {
      files: ["*.tsx"],
      rules: { "react/prop-types": "off" },
    },
  ],
  globals: {
    expect: true,
    window: true,
  },
};
