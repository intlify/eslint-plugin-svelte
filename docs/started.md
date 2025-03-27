# Getting Started

## :cd: Installation

Use [npm](https://www.npmjs.com/) or a compatible tool.

```sh
npm install --save-dev eslint @intlify/eslint-plugin-svelte
```

::: tip Requirements

- ESLint v9.22.0 or later
- Node.js v18.20, v20.10.0, v21.1.0, or later

:::

## :rocket: Usage

### Configuration `eslint.config.js`

See also: <https://eslint.org/docs/latest/use/configure/configuration-files>.

Example `eslint.config.js`:

```js
import intlifySvelte from '@intlify/eslint-plugin-svelte'

export default [
  // add more generic rulesets here, such as:
  //...eslintPluginSvelte.configs.recommended,

  // Recommended
  ...intlifySvelte.configs.recommended,
  {
    rules: {
      // override/add rules settings here, such as:
      '@intlify/svelte/no-raw-text': 'error'
    }
  }
]
```

See [the rule list](./rules/README.md)

#### Bundle Configurations `eslint.config.js`

This plugin provides some predefined configs. You can use the following configs by adding them to `eslint.config.js`. (All configs in this plugin are provided as arrays, so spread syntax is required when combining them with other configs.)

- `*.configs.base`: Settings and rules to enable correct ESlint parsing.
- `*.configs.recommended`: Above, plus rules to enforce subjective community defaults to ensure consistency.

### Configuration `.eslintrc.*`

This plugin no longer supports `.eslintrc.*`.

#### Parser Configuration

If you are using TypeScript, see the documentation for [eslint-plugin-svelte], the official ESLint plugin from Svelte.

<https://sveltejs.github.io/eslint-plugin-svelte/user-guide/#type-script-project>

See also <https://github.com/sveltejs/svelte-eslint-parser#readme>.

[eslint-plugin-svelte]: https://sveltejs.github.io/eslint-plugin-svelte/

## 🛸 More Plugins

### [eslint-plugin-svelte]

ESLint plugin for Svelte compatible with `@intlify/eslint-plugin-svelte`.
Use it if you want ESLint to do more checks on your Svelte files.

## :question: FAQ

TBA
