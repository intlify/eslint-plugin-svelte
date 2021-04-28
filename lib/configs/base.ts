export = {
  plugins: ['@intlify/svelte'],
  overrides: [
    {
      files: ['*.svelte'],
      parser: require.resolve('svelte-eslint-parser')
    }
  ]
}
