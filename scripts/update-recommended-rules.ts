/**
 * @fileoverview Update recommended rules
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * Forked by https://github.com/mysticatea/eslint-plugin-eslint-comments/tree/master/scripts/update-recommended-rules.js
 */
import { resolve } from 'path'
import rules from './lib/rules'
import { writeAndFormat } from './lib/write'

// recommended.ts
writeAndFormat(
  resolve(__dirname, '../lib/configs/recommended.ts'),
  `/** DON'T EDIT THIS FILE; was created by scripts. */
export = {
  extends: [require.resolve('./base')],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    es6: true
  },
  rules: {
    ${rules
      .filter(rule => rule.recommended)
      .map(rule => `'${rule.id}': 'warn',`)
      .join('\n        ')}
  },
}`
)
