'use strict'

module.exports = {
  root: true,
  env: {
    node: true,
    mocha: true,
    es2021: true
  },
  extends: [
    'plugin:prettier/recommended',
    'plugin:markdown/recommended',
    'prettier'
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2021
  },
  rules: {
    'accessor-pairs': 2,
    'brace-style': [2, '1tbs', { allowSingleLine: true }],
    camelcase: [2, { properties: 'never' }],
    'comma-dangle': [2, 'never'],
    'constructor-super': 2,
    curly: [2, 'multi-line'],
    eqeqeq: [2, 'allow-null'],
    'handle-callback-err': [2, '^(err|error)$'],
    'new-cap': [2, { newIsCap: true, capIsNew: false }],
    'new-parens': 2,
    'no-array-constructor': 2,
    'no-caller': 2,
    'no-class-assign': 2,
    'no-cond-assign': 2,
    'no-const-assign': 2,
    'no-control-regex': 2,
    'no-delete-var': 2,
    'no-dupe-args': 2,
    'no-dupe-class-members': 2,
    'no-dupe-keys': 2,
    'no-duplicate-case': 2,
    'no-empty-character-class': 2,
    'no-empty-pattern': 2,
    'no-eval': 2,
    'no-ex-assign': 2,
    'no-extend-native': 2,
    'no-extra-bind': 2,
    'no-extra-boolean-cast': 2,
    'no-extra-parens': [2, 'functions'],
    'no-fallthrough': 2,
    'no-floating-decimal': 2,
    'no-func-assign': 2,
    'no-implied-eval': 2,
    'no-inner-declarations': [2, 'functions'],
    'no-invalid-regexp': 2,
    'no-irregular-whitespace': 2,
    'no-iterator': 2,
    'no-label-var': 2,
    'no-labels': [2, { allowLoop: false, allowSwitch: false }],
    'no-lone-blocks': 2,
    'no-mixed-spaces-and-tabs': 2,
    'no-multi-str': 2,
    'no-native-reassign': 2,
    'no-negated-in-lhs': 2,
    'no-new-object': 2,
    'no-new-require': 2,
    'no-new-symbol': 2,
    'no-new-wrappers': 2,
    'no-obj-calls': 2,
    'no-octal': 2,
    'no-octal-escape': 2,
    'no-path-concat': 2,
    'no-proto': 2,
    'no-redeclare': 2,
    'no-regex-spaces': 2,
    'no-return-assign': [2, 'except-parens'],
    'no-self-assign': 2,
    'no-self-compare': 2,
    'no-sequences': 2,
    'no-shadow-restricted-names': 2,
    'no-spaced-func': 2,
    'no-sparse-arrays': 2,
    'no-this-before-super': 2,
    'no-throw-literal': 2,
    'no-trailing-spaces': 2,
    'no-undef': 2,
    'no-undef-init': 2,
    'no-unexpected-multiline': 2,
    'no-unmodified-loop-condition': 2,
    'no-unneeded-ternary': [2, { defaultAssignment: false }],
    'no-unreachable': 2,
    'no-unsafe-finally': 2,
    'no-unused-vars': [2, { vars: 'all', args: 'none' }],
    'no-useless-call': 2,
    'no-useless-computed-key': 2,
    'no-useless-constructor': 2,
    'no-useless-escape': 0,
    'no-whitespace-before-property': 2,
    'no-with': 2,
    'one-var': [2, { initialized: 'never' }],
    'use-isnan': 2,
    'valid-typeof': 2,
    'wrap-iife': [2, 'any'],
    yoda: [2, 'never'],
    'prefer-const': 2,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'object-shorthand': 'error'
  },
  overrides: [
    {
      files: ['*.ts'],
      extends: ['plugin:@typescript-eslint/recommended'],
      parser: '@typescript-eslint/parser',
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/consistent-type-imports': 'error'
      }
    },
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module'
      }
    },
    {
      files: ['**/*.md/*.*'],
      rules: {
        'prettier/prettier': 'off'
      }
    }
  ]
}
