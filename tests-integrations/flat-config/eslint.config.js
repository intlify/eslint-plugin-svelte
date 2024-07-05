import intlifySvelte from '@intlify/eslint-plugin-svelte'
import svelteParser from 'svelte-eslint-parser'

export default [
  ...intlifySvelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte', '*.svelte'],
    languageOptions: {
      parser: svelteParser
    },
    rules: {
      //Using warn instead of error as running eslint using execSync causes tests to fail.
      '@intlify/svelte/no-raw-text': 'warn'
    }
  }
]
