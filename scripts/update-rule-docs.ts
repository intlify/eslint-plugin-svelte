/**
 * @fileoverview Update docs headers script
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * Forked by https://github.com/mysticatea/eslint-plugin-eslint-comments/tree/master/scripts/update-docs-headers.js
 */
import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'
import type { RuleInfo } from './lib/rules'
import rules from './lib/rules'
import { getNewVersion } from './lib/changesets-util'
const PLACE_HOLDER = /#[^\n]*\n+> .+\n+(?:- .+\n)*\n*/u

updateRuleDocs()

async function updateRuleDocs(): Promise<void> {
  async function pickSince(content: string) {
    const fileIntro = /^---\n(.*\n)+?---\n*/g.exec(content)
    if (fileIntro) {
      const since = /since: (v\d+\.\d+\.\d+)/.exec(fileIntro[0])
      if (since) {
        return since[1]
      }
    }
    // eslint-disable-next-line no-process-env -- ignore
    if (process.env.IN_VERSION_CI_SCRIPT) {
      return getNewVersion().then(v => `v${v}`)
    }
    return null
  }

  class DocFile {
    private rule: RuleInfo
    private filePath: string
    private content: string
    private since: Promise<string | null>
    constructor(rule: RuleInfo) {
      this.rule = rule
      this.filePath = join(__dirname, `../docs/rules/${rule.name}.md`)
      this.content = readFileSync(this.filePath, 'utf8')
      this.since = pickSince(this.content)
    }

    write() {
      writeFileSync(this.filePath, this.content)
    }
    async updateFileIntro() {
      const rule = this.rule

      const since = await this.since

      const fileIntro = {
        // pageClass: 'rule-details',
        // sidebarDepth: 0,
        title: `'${rule.id}'`,
        description: rule.description,
        ...(since ? { since } : {})
      }
      const computed = `---\n${Object.entries(fileIntro)
        .map(item => `${item[0]}: ${item[1]}`)
        .join('\n')}\n---\n\n`

      const fileIntroPattern = /^---\n(.*\n)+?---\n*/g

      if (fileIntroPattern.test(this.content)) {
        this.content = this.content.replace(fileIntroPattern, computed)
      } else {
        this.content = `${computed}${this.content.trim()}\n`
      }

      return this
    }

    updateHeader() {
      const rule = this.rule
      const headerLines = [`# ${rule.id}`, '', `> ${rule.description}`]

      if (rule.recommended || rule.deprecated || rule.fixable) {
        headerLines.push('')
      }

      if (rule.deprecated) {
        if (rule.replacedBy) {
          headerLines.push(
            `- :warning:️ This rule was **deprecated** and replaced by ${rule.replacedBy
              .map(id => `[${id}](${id}.md) rule`)
              .join(', ')}.`
          )
        } else {
          headerLines.push(`- :warning:️ This rule was **deprecated**.`)
        }
      } else if (rule.recommended) {
        headerLines.push(
          '- :star: The `"extends": "plugin:@intlify/svelte/recommended"` property in a configuration file enables this rule.'
        )
      }

      if (rule.fixable) {
        headerLines.push(
          '- :black_nib:️ The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.'
        )
      }
      headerLines.push('', '')

      this.content = this.content.replace(PLACE_HOLDER, headerLines.join('\n'))

      return this
    }

    updateCodeBlocks() {
      const rule = this.rule
      this.content = this.content
        .replace(/<eslint-code-block(.*?)>/gs, (_ignore, attrs) => {
          attrs = attrs.replace(/\bfix\b/g, '').trim()
          return `<eslint-code-block${rule.fixable ? ' fix' : ''}${
            attrs ? ` ${attrs}` : ''
          }>`
        })
        .replace(
          /\n+(<(?:eslint-code-block|resource-group)([\s\S]*?)>)\n+/gm,
          '\n\n$1\n\n'
        )
        .replace(
          /\n+<\/(eslint-code-block|resource-group)\s*>\n+/gm,
          '\n\n</$1>\n\n'
        )
      return this
    }

    async updateFooter() {
      const { name } = this.rule
      const footerPattern = /## (?::mag: Implementation|:rocket: Version).+$/s
      const since = await this.since
      const footer = `${
        since
          ? `## :rocket: Version

This rule was introduced in \`@intlify/eslint-plugin-svelte\` ${since}

`
          : ''
      }## :mag: Implementation

- [Rule source](https://github.com/intlify/eslint-plugin-svelte/blob/main/lib/rules/${name}.ts)
- [Test source](https://github.com/intlify/eslint-plugin-svelte/tree/main/tests/lib/rules/${name}.ts)
`
      if (footerPattern.test(this.content)) {
        this.content = this.content.replace(footerPattern, footer)
      } else {
        this.content = `${this.content.trim()}\n\n${footer}`
      }

      return this
    }
  }

  for (const rule of rules) {
    const doc = new DocFile(rule)
    await doc.updateFileIntro()
    doc.updateHeader()
    doc.updateCodeBlocks()
    await doc.updateFooter()
    doc.write()
  }
}
