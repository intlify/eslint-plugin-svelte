/**
 * @fileoverview Update docs index script
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * Forked by https://github.com/mysticatea/eslint-plugin-eslint-comments/tree/master/scripts/update-docs-index.js
 */
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import type { RuleInfo } from './lib/rules'
import { withCategories } from './lib/rules'

function toTableRow(rule: RuleInfo) {
  const mark = `${rule.recommended ? ':star:' : ''}${
    rule.fixable ? ':black_nib:' : ''
  }`
  const link = `[@intlify/svelte/<wbr>${rule.name}](./${rule.name}.md)`
  const description = rule.description || '(no description)'
  return `| ${link} | ${description} | ${mark} |`
}

function toCategorySection({
  category,
  rules
}: {
  category: string
  rules: RuleInfo[]
}) {
  return `## ${category}

<!--prettier-ignore-->
| Rule ID | Description |    |
|:--------|:------------|:---|
${rules.map(toTableRow).join('\n')}
`
}

writeFileSync(
  resolve(__dirname, '../docs/rules/README.md'),
  `# Available Rules

- :star: mark: the rule which is enabled by the \`plugin:@intlify/svelte/recommended\` or \`*.configs.["flat/recommended"]\` preset.
- :black_nib: mark: the rule which is fixable by \`eslint --fix\` command.

${withCategories
  .filter(({ rules }) => rules.length)
  .map(toCategorySection)
  .join('\n')}
**If you have any ideas for new rules, please open an [issue](https://github.com/intlify/eslint-plugin-svelte/issues).**
`
)
