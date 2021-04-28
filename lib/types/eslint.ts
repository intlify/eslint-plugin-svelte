import type { AST as SvAST } from 'svelte-eslint-parser'
import type ESTree from 'estree'
import type { Rule } from 'eslint'
import type { TokenStore } from './types'

export interface Position {
  /** >= 1 */
  line: number
  /** >= 0 */
  column: number
}
export type Range = [number, number]
export interface SourceLocation {
  start: Position
  end: Position
}
export interface NodeWithLoc {
  type: string
  range: Range
  loc: SourceLocation
}
export interface TokenWithLoc extends NodeWithLoc {
  value: string
}

export interface RuleListener {
  onCodePathStart?(codePath: Rule.CodePath, node: never): void
  onCodePathEnd?(codePath: Rule.CodePath, node: never): void
  onCodePathSegmentStart?(segment: Rule.CodePathSegment, node: never): void
  onCodePathSegmentEnd?(segment: Rule.CodePathSegment, node: never): void
  onCodePathSegmentLoop?(
    fromSegment: Rule.CodePathSegment,
    toSegment: Rule.CodePathSegment,
    node: never
  ): void
  [key: string]:
    | ((node: never) => void)
    | ((codePath: Rule.CodePath, node: never) => void)
    | ((segment: Rule.CodePathSegment, node: never) => void)
    | ((
        fromSegment: Rule.CodePathSegment,
        toSegment: Rule.CodePathSegment,
        node: never
      ) => void)
    | undefined
}

export interface RuleContext {
  id: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any[]
  parserPath: string
  parserServices: {
    isSvelte?: true
  }
  getFilename(): string
  getSourceCode(): SourceCode
  getScope(): Scope
  report(descriptor: ReportDescriptor): void
}

interface ReportDescriptorOptionsBase {
  data?: { [key: string]: string }

  fix?:
    | null
    | ((fixer: RuleFixer) => null | Fix | IterableIterator<Fix> | Fix[])
}

type SuggestionDescriptorMessage = { desc: string } | { messageId: string }
type SuggestionReportDescriptor = SuggestionDescriptorMessage &
  ReportDescriptorOptionsBase

interface ReportDescriptorOptions extends ReportDescriptorOptionsBase {
  suggest?: SuggestionReportDescriptor[] | null
}

type ReportDescriptor = ReportDescriptorMessage &
  ReportDescriptorLocation &
  ReportDescriptorOptions
type ReportDescriptorMessage = { message: string } | { messageId: string }
type ReportDescriptorLocation =
  | { node: NodeWithLoc | ESTree.Node }
  | { loc: SourceLocation | { line: number; column: number } }

export interface RuleFixer {
  insertTextAfter(nodeOrToken: NodeWithLoc, text: string): Fix

  insertTextAfterRange(range: Range, text: string): Fix

  insertTextBefore(nodeOrToken: NodeWithLoc, text: string): Fix

  insertTextBeforeRange(range: Range, text: string): Fix

  remove(nodeOrToken: NodeWithLoc): Fix

  removeRange(range: Range): Fix

  replaceText(nodeOrToken: NodeWithLoc, text: string): Fix

  replaceTextRange(range: Range, text: string): Fix
}

export interface Fix {
  range: Range
  text: string
}

export type FilterPredicate = (tokenOrComment: TokenWithLoc) => boolean

export type CursorWithSkipOptions =
  | number
  | FilterPredicate
  | {
      includeComments?: boolean
      filter?: FilterPredicate
      skip?: number
    }

export type CursorWithCountOptions =
  | number
  | FilterPredicate
  | {
      includeComments?: boolean
      filter?: FilterPredicate
      count?: number
    }

export interface SourceCode extends TokenStore {
  text: string
  ast: SvAST.SvelteProgram
  lines: string[]
  hasBOM: boolean
  scopeManager: ScopeManager
  visitorKeys: VisitorKeys

  getText(node?: NodeWithLoc, beforeCount?: number, afterCount?: number): string
  getLines(): string[]
  getAllComments(): TokenWithLoc[]
  getComments(
    node: NodeWithLoc
  ): { leading: TokenWithLoc[]; trailing: TokenWithLoc[] }
  getJSDocComment(node: NodeWithLoc): TokenWithLoc | null
  getNodeByRangeIndex(index: number): NodeWithLoc
  isSpaceBetweenTokens(first: TokenWithLoc, second: TokenWithLoc): boolean
  getLocFromIndex(index: number): Position
  getIndexFromLoc(location: Position): number
}

export interface ScopeManager {
  scopes: Scope[]
  globalScope: Scope | null
  acquire(node: ESTree.Node | ESTree.Program, inner?: boolean): Scope | null
  getDeclaredVariables(node: ESTree.Node): Variable[]
}
export interface Scope {
  type:
    | 'block'
    | 'catch'
    | 'class'
    | 'for'
    | 'function'
    | 'function-expression-name'
    | 'global'
    | 'module'
    | 'switch'
    | 'with'
    | 'TDZ'
  isStrict: boolean
  upper: Scope | null
  childScopes: Scope[]
  variableScope: Scope
  block: ESTree.Node
  variables: Variable[]
  set: Map<string, Variable>
  references: Reference[]
  through: Reference[]
  functionExpressionScope: boolean
}
export interface Variable {
  name: string
  identifiers: ESTree.Identifier[]
  references: Reference[]
  defs: Definition[]
}
export interface Reference {
  identifier: ESTree.Identifier
  from: Scope
  resolved: Variable | null
  writeExpr: ESTree.Node | null
  init: boolean
  isWrite(): boolean
  isRead(): boolean
  isWriteOnly(): boolean
  isReadOnly(): boolean
  isReadWrite(): boolean
}
export type DefinitionType =
  | { type: 'CatchClause'; node: ESTree.CatchClause; parent: null }
  | {
      type: 'ClassName'
      node: ESTree.ClassDeclaration | ESTree.ClassExpression
      parent: null
    }
  | {
      type: 'FunctionName'
      node: ESTree.FunctionDeclaration | ESTree.FunctionExpression
      parent: null
    }
  | { type: 'ImplicitGlobalVariable'; node: ESTree.Program; parent: null }
  | {
      type: 'ImportBinding'
      node:
        | ESTree.ImportSpecifier
        | ESTree.ImportDefaultSpecifier
        | ESTree.ImportNamespaceSpecifier
      parent: ESTree.ImportDeclaration
    }
  | {
      type: 'Parameter'
      node:
        | ESTree.FunctionDeclaration
        | ESTree.FunctionExpression
        | ESTree.ArrowFunctionExpression
      parent: null
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: 'TDZ'; node: any; parent: null }
  | {
      type: 'Variable'
      node: ESTree.VariableDeclarator
      parent: ESTree.VariableDeclaration
    }
export type Definition = DefinitionType & { name: ESTree.Identifier }

export interface VisitorKeys {
  [type: string]: string[]
}
