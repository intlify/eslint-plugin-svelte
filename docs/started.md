# Getting Started

## :cd: Installation

Use [npm](https://www.npmjs.com/) or a compatible tool.

```sh
npm install --save-dev eslint @intlify/eslint-plugin-svelte
```

::: tip Requirements

- ESLint v7.0.0 or later
- Node.js v12.x, v14.x or later

:::

## :rocket: Usage

### Configuration

Configure your `.eslintrc.*` file.

For example:

```js
module.export = {
  overrides: [
    {
      files: ['*.svelte'],
      extends: [
        // Recommended
        'plugin:@intlify/svelte/recommended'
      ],
      rules: {
        // Optional.
        '@intlify/svelte/no-raw-text': 'error'
        // ...
      }
    }
  ]
}
```

See [the rule list](./rules/README.md)

::: warning ❗ Attention

The `@intlify/eslint-plugin-svelte` can not be used with the [eslint-plugin-svelte3].
If you are using [eslint-plugin-svelte3] you need to remove it.

```diff
  "plugins": [
-   "svelte3"
  ]
```

:::

[eslint-plugin-svelte3]: https://github.com/sveltejs/eslint-plugin-svelte3

#### Parser Configuration

If you have specified a parser, you need to configure a parser for `.svelte`.

For example, if you are using the `"@babel/eslint-parser"`, configure it as follows:

```js
module.exports = {
  // ...
  extends: ['plugin:@ota-meshi/svelte/recommended'],
  // ...
  parser: '@babel/eslint-parser',
  // Add an `overrides` section to add a parser configuration for svelte.
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser'
    }
    // ...
  ]
  // ...
}
```

For example, if you are using the `"@typescript-eslint/parser"`, and if you want to use TypeScript in `<script>` of `.svelte`, you need to add more `parserOptions` configuration.

```js
module.exports = {
  // ...
  extends: ['plugin:@ota-meshi/svelte/recommended'],
  // ...
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // ...
    project: 'path/to/your/tsconfig.json',
    extraFileExtensions: ['.svelte'] // This is a required setting in `@typescript-eslint/parser` v4.24.0.
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      // Parse the `<script>` in `.svelte` as TypeScript by adding the following configuration.
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
    // ...
  ]
  // ...
}
```

If you have a mix of TypeScript and JavaScript in your project, use a multiple parser configuration.

```js
module.exports = {
  // ...
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: {
          // Specify a parser for each lang.
          ts: '@typescript-eslint/parser',
          js: 'espree',
          typescript: '@typescript-eslint/parser'
        }
      }
    }
    // ...
  ]
  // ...
}
```

See also [https://github.com/ota-meshi/svelte-eslint-parser#readme](https://github.com/ota-meshi/svelte-eslint-parser#readme).

### Running ESLint from command line

If you want to run `eslint` from command line, make sure you include the `.svelte` extension using [the `--ext` option](https://eslint.org/docs/user-guide/configuring#specifying-file-extensions-to-lint) or a glob pattern because ESLint targets only `.js` files by default.

Examples:

```bash
eslint --ext .js,.svelte src
eslint "src/**/*.{js,svelte}"
```

## :flying_saucer: More Plugins

### [@ota-meshi/eslint-plugin-svelte](https://ota-meshi.github.io/eslint-plugin-svelte/)

ESLint plugin for Svelte compatible with `@intlify/eslint-plugin-svelte`.
Use it if you want ESLint to do more checks on your Svelte files.

## :question: FAQ

### What is the "Use the latest svelte-eslint-parser" error?

The most rules of `@intlify/eslint-plugin-svelte` require `svelte-eslint-parser` to check `<template>` ASTs.

Make sure you have one of the following settings in your **.eslintrc**:

- `"extends": ["plugin:@intlify/svelte/recommended"]`
- `"extends": ["plugin:@intlify/svelte/base"]`

<!-- See also: "[Use together with custom parsers](#use-together-with-custom-parsers)" section. -->

### Why doesn't it work on .svelte file?

1. Make sure you don't have `eslint-plugin-svelte3` in your config. The `eslint-plugin-svelte3` extracts the content from `<script>` tags, but `@intlify/eslint-plugin-svelte` requires `<script>` tags and other element tags in order to distinguish template and script in `*.svelte`.

```diff
  "plugins": [
    "@intlify/svelte",
-   "svelte3"
  ]
```

2. Make sure your tool is set to lint `.svelte` files.

- CLI targets only `.js` files by default. You have to specify additional extensions by `--ext` option or glob patterns. E.g. `eslint "src/**/*.{js,svelte}"` or `eslint src --ext .svelte`.
