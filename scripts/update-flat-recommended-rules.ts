import { resolve } from 'path'
import rules from './lib/rules'
import { writeAndFormat } from './lib/write'

// flat/recommended.ts
writeAndFormat(
  resolve(__dirname, '../lib/configs/flat/recommended.ts'),
  `/** DON'T EDIT THIS FILE; was created by scripts. */
  import config from './base';
  export = [
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
