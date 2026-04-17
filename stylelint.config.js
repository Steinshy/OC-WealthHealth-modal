export default {
  extends: ['stylelint-config-standard', 'stylelint-config-css-modules'],
  plugins: ['stylelint-order'],
  rules: {
    'order/properties-alphabetical-order': true,
    'selector-class-pattern': null,
    'custom-property-pattern': null,
    'keyframes-name-pattern': null,
    'selector-id-pattern': null,
    'no-descending-specificity': null,
    'declaration-block-single-line-max-declarations': null,
    'rule-empty-line-before': null,
    'no-empty-source': null,
  },
  ignoreFiles: ['**/node_modules/**', '**/dist/**', '**/coverage/**', '**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', 'public/**'],
};
