/**
 * @fileoverview Utilities for eslint plugin
 * @author Yosuke Ota
 */
import type { Rule } from 'eslint'
import { dirname, extname } from 'path'
import { existsSync } from 'fs'
import type { RuleContext, RuleListener } from '../types'

const UNEXPECTED_ERROR_LOCATION = { line: 1, column: 0 }

export function defineRule(
  ruleName: string,
  rule: {
    meta: {
      type: Required<Rule.RuleMetaData>['type']
      docs: {
        description: string
        category?: 'Recommended'
        recommended: boolean
      }
      fixable?: Rule.RuleMetaData['fixable']
      schema: Required<Rule.RuleMetaData>['schema']
    }
    create(context: RuleContext): RuleListener
  }
): Rule.RuleModule {
  return {
    meta: {
      ...rule.meta,
      docs: {
        ...rule.meta.docs,
        url:
          'https://github.com/intlify/eslint-plugin-svelte/blob/main/docs/rules/' +
          ruleName +
          '.md'
      }
    },
    create(context) {
      if (!context.parserServices.isSvelte) {
        const filename = context.getFilename()
        if (isSvelteFile(filename)) {
          context.report({
            loc: UNEXPECTED_ERROR_LOCATION,
            message:
              'Use the latest svelte-eslint-parser. See also https://github.com/intlify/eslint-plugin-svelte/blob/main/docs/started.md#faq'
          })
        }
        return {}
      }
      return rule.create(context as never) as never
    }
  }
}

function isSvelteFile(filename: string) {
  if (!filename.includes('.svelte')) {
    return false
  }
  let target = filename
  while (!existsSync(target)) {
    const next = dirname(target)
    if (!next || next === target) {
      return false
    }
    target = next
  }
  return extname(target) === '.svelte'
}
