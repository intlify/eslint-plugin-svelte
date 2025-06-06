/**
 * @fileoverview Rules loading script library
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * Forked by https://github.com/mysticatea/eslint-plugin-eslint-comments/tree/master/scripts/lib/rules.js
 */
import { readdirSync } from 'fs'
import { resolve, basename } from 'path'

export type RuleInfo = {
  id: string
  name: string
  category: string
  description: string
  recommended: boolean
  fixable: boolean
  deprecated: boolean
  replacedBy: string[] | null
}

const rules: RuleInfo[] = await Promise.all(
  readdirSync(resolve(import.meta.dirname, '../../lib/rules'))
    .map(fileName => basename(fileName, '.ts'))
    .map(async name => {
      const meta = ((await import(`../../lib/rules/${name}`)) as any).default
        .meta
      return {
        id: `@intlify/svelte/${name}`,
        name,
        category: String(meta.docs.category),
        description: String(meta.docs.description),
        recommended: Boolean(meta.docs.recommended),
        fixable: Boolean(meta.fixable),
        deprecated: Boolean(meta.deprecated),
        replacedBy: (meta.docs.replacedBy as string[]) || null
      }
    })
)

export default rules
export const withCategories = [
  'Recommended',
  'Best Practices',
  'Stylistic Issues'
].map(category => ({
  category,
  rules: rules.filter(rule => rule.category === category && !rule.deprecated)
}))
