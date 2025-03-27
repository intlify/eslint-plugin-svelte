import { resolve } from 'path'
import rules from './lib/rules.js'
import { writeAndFormat } from './lib/write.js'

// flat/recommended.ts
writeAndFormat(
  resolve(import.meta.dirname, '../lib/configs/flat/recommended.ts'),
  `/** DON'T EDIT THIS FILE; was created by scripts. */
import config from './base.js';
export default [
  ...config,
  {
    name: '@intlify/svelte:recommended:setup',
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  },
  {
    name: '@intlify/svelte:recommended:rules',
    rules: {
      ${rules
        .filter(rule => rule.recommended)
        .map(rule => `'${rule.id}': 'warn',`)
        .join('\n        ')}
    },
  }
]`
)
