/** DON'T EDIT THIS FILE; was created by scripts. */
import config from './base'
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
      '@intlify/svelte/no-raw-text': 'warn'
    }
  }
]
