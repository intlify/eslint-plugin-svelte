/**
 * @author Yosuke Ota
 */
import type { AST as SvAST } from 'svelte-eslint-parser'
import type ESTree from 'estree'
import type { RuleContext, RuleListener } from '../types'
import { defineRule } from '../utils'

type LiteralValue = ESTree.Literal['value']
type StaticTemplateLiteral = ESTree.TemplateLiteral & {
  quasis: [ESTree.TemplateElement]
  expressions: [
    /* empty */
  ]
}
type TargetAttrs = { name: RegExp; attrs: Set<string> }
type Config = {
  attributes: TargetAttrs[]
  ignorePattern: RegExp
  ignoreNodes: string[]
  ignoreText: string[]
}
const RE_REGEXP_STR = /^\/(.+)\/(.*)$/u
function toRegExp(str: string): RegExp {
  const parts = RE_REGEXP_STR.exec(str)
  if (parts) {
    return new RegExp(parts[1], parts[2])
  }
  return new RegExp(`^${escape(str)}$`)
}
const hasOnlyWhitespace = (value: string) => /^[\r\n\s\t\f\v]+$/.test(value)

/**
 * Get the attribute to be verified from the element name.
 */
function getTargetAttrs(tagName: string, config: Config): Set<string> {
  const result = []
  for (const { name, attrs } of config.attributes) {
    name.lastIndex = 0
    if (name.test(tagName)) {
      result.push(...attrs)
    }
  }

  return new Set(result)
}

function isStaticTemplateLiteral(
  node: ESTree.Expression | ESTree.Pattern
): node is StaticTemplateLiteral {
  return Boolean(
    node && node.type === 'TemplateLiteral' && node.expressions.length === 0
  )
}

function testValue(value: LiteralValue, config: Config): boolean {
  if (typeof value === 'string') {
    return (
      hasOnlyWhitespace(value) ||
      config.ignorePattern.test(value.trim()) ||
      config.ignoreText.includes(value.trim())
    )
  } else {
    return false
  }
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
    checkExpressionText(context, node.expression, config)
  }
}

function checkExpressionText(
  context: RuleContext,
  expression: ESTree.Expression,
  config: Config
) {
  if (expression.type === 'Literal') {
    checkLiteral(context, expression, config)
  } else if (isStaticTemplateLiteral(expression)) {
    checkLiteral(context, expression, config)
  } else if (expression.type === 'ConditionalExpression') {
    const targets = [expression.consequent, expression.alternate]
    targets.forEach(target => {
      if (target.type === 'Literal') {
        checkLiteral(context, target, config)
      } else if (isStaticTemplateLiteral(target)) {
        checkLiteral(context, target, config)
      }
    })
  }
}

function checkSvelteLiteralOrText(
  context: RuleContext,
  literal: SvAST.SvelteLiteral | SvAST.SvelteText,
  config: Config
) {
  if (testValue(literal.value, config)) {
    return
  }

  const loc = literal.loc!
  context.report({
    loc,
    message: `raw text '${literal.value.trim()}' is used`
  })
}

function checkLiteral(
  context: RuleContext,
  literal: ESTree.Literal | StaticTemplateLiteral,
  config: Config
) {
  const value =
    literal.type !== 'TemplateLiteral'
      ? literal.value
      : literal.quasis[0].value.cooked

  if (testValue(value, config)) {
    return
  }

  const loc = literal.loc!
  context.report({
    loc,
    message: `raw text '${String(value).trim()}' is used`
  })
}
/**
 * Parse attributes option
 */
function parseTargetAttrs(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any
) {
  const regexps: TargetAttrs[] = []
  for (const tagName of Object.keys(options)) {
    const attrs: Set<string> = new Set(options[tagName])
    regexps.push({
      name: toRegExp(tagName),
      attrs
    })
  }
  return regexps
}

function create(context: RuleContext): RuleListener {
  const sourceCode = context.getSourceCode()

  const config: Config = {
    attributes: [],
    ignorePattern: /^$/,
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
  if (context.options[0]?.attributes) {
    config.attributes = parseTargetAttrs(context.options[0].attributes)
  }

  function isIgnore(node: SvAST.SvelteMustacheTag | SvAST.SvelteText) {
    const element = getElement(node)

    if (!element) {
      return false
    }

    if (element.type === 'SvelteStyleElement') {
      return true
    }

    return config.ignoreNodes.includes(
      sourceCode.text.slice(...element.name.range!)
    )
  }
  function getElement(node: SvAST.SvelteMustacheTag | SvAST.SvelteText) {
    let target:
      | SvAST.SvelteText['parent']
      | SvAST.SvelteMustacheTag['parent']
      | SvAST.SvelteElement
      | SvAST.SvelteSpecialElement
      | SvAST.SvelteAwaitBlock
      | SvAST.SvelteElseBlockElseIf = node.parent
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
    if (
      target.type === 'SvelteElement' ||
      target.type === 'SvelteStyleElement'
    ) {
      return target
    }
    return null
  }

  return {
    SvelteAttribute(node: SvAST.SvelteAttribute) {
      if (node.value.length !== 1 || node.value[0].type !== 'SvelteLiteral') {
        return
      }
      const nameNode = node.parent.parent.name
      const tagName = sourceCode.text.slice(...nameNode.range!)
      const attrName = node.key.name
      if (!getTargetAttrs(tagName, config).has(attrName)) {
        return
      }

      checkSvelteLiteralOrText(context, node.value[0], config)
    },
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
      checkSvelteLiteralOrText(context, node, config)
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
          attributes: {
            type: 'object',
            patternProperties: {
              '^(?:\\S+|/.*/[a-z]*)$': {
                type: 'array',
                items: { type: 'string' },
                uniqueItems: true
              }
            },
            additionalProperties: false
          },
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
