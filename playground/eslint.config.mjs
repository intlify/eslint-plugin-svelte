import js from '@eslint/js'
import intlifySvelte from '@intlify/eslint-plugin-svelte'
export default [
  js.configs.recommended,
  ...intlifySvelte.configs.recommended,
  {
    files: ['**/*.svelte', '*.svelte'],
    rules: {
      '@intlify/svelte/no-raw-text': 'warn'
    }
  }
]
