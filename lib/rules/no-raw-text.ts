/**
 * @author Yosuke Ota
 */
import type { AST as SvAST } from 'svelte-eslint-parser'
import type ESTree from 'estree'
import type { RuleContext, RuleListener } from '../types'
import { defineRule } from '../utils'

type AnyValue = ESTree.Literal['value']
type Config = {
  ignorePattern: RegExp
  ignoreNodes: string[]
  ignoreText: string[]
}
const hasOnlyWhitespace = (value: string) => /^[\r\n\s\t\f\v]+$/.test(value)

function isValidValue(value: AnyValue, config: Config) {
  return (
    typeof value !== 'string' ||
    hasOnlyWhitespace(value) ||
    config.ignorePattern.test(value.trim()) ||
    config.ignoreText.includes(value.trim())
  )
}

function checkSvelteMustacheTagText(
  context: RuleContext,
  node: SvAST.SvelteMustacheTag,
  config: Config
) {
  if (!node.expression || !node.parent) {
    return
  }

  if (node.parent.type === 'SvelteElement') {
    // parent is element (e.g. <p>{ ... }</p>)
    if (node.expression.type === 'Literal') {
      const literalNode = node.expression
      if (isValidValue(literalNode.value, config)) {
        return
      }

      context.report({
        node: literalNode,
        message: `raw text '${literalNode.value}' is used`
      })
    } else if (node.expression.type === 'ConditionalExpression') {
      for (const target of [
        node.expression.consequent,
        node.expression.alternate
      ]) {
        if (target.type !== 'Literal') {
          continue
        }
        if (isValidValue(target.value, config)) {
          continue
        }

        context.report({
          node: target,
          message: `raw text '${target.value}' is used`
        })
      }
    }
  }
}

function create(context: RuleContext): RuleListener {
  const config: Config = {
    ignorePattern: /^[^\S\s]$/,
    ignoreNodes: [],
    ignoreText: []
  }

  if (context.options[0]?.ignorePattern) {
    config.ignorePattern = new RegExp(context.options[0].ignorePattern, 'u')
  }

  if (context.options[0]?.ignoreNodes) {
    config.ignoreNodes = context.options[0].ignoreNodes
  }

  if (context.options[0]?.ignoreText) {
    config.ignoreText = context.options[0].ignoreText
  }

  function isIgnore(node: SvAST.SvelteMustacheTag | SvAST.SvelteText) {
    const element = getElement(node)

    return !element || config.ignoreNodes.includes(element.name.name)
  }
  function getElement(node: SvAST.SvelteMustacheTag | SvAST.SvelteText) {
    let target:
      | SvAST.SvelteText['parent']
      | SvAST.SvelteElement
      | SvAST.SvelteAwaitBlock = node.parent
    while (
      target.type === 'SvelteIfBlock' ||
      target.type === 'SvelteElseBlock' ||
      target.type === 'SvelteEachBlock' ||
      target.type === 'SvelteAwaitBlock' ||
      target.type === 'SvelteAwaitPendingBlock' ||
      target.type === 'SvelteAwaitThenBlock' ||
      target.type === 'SvelteAwaitCatchBlock' ||
      target.type === 'SvelteKeyBlock'
    ) {
      target = target.parent
    }
    if (target.type === 'SvelteElement') {
      return target
    }
    return null
  }

  return {
    SvelteMustacheTag(node: SvAST.SvelteMustacheTag) {
      if (isIgnore(node)) {
        return
      }
      checkSvelteMustacheTagText(context, node, config)
    },

    SvelteText(node: SvAST.SvelteText) {
      if (isIgnore(node)) {
        return
      }

      if (isValidValue(node.value, config)) {
        return
      }

      context.report({
        node,
        message: `raw text '${node.value}' is used`
      })
    }
  }
}

export = defineRule('no-raw-text', {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow to string literal in template',
      category: 'Recommended',
      recommended: true
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignoreNodes: {
            type: 'array'
          },
          ignorePattern: {
            type: 'string'
          },
          ignoreText: {
            type: 'array'
          }
        }
      }
    ]
  },
  create
})
