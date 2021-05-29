import type {
  TokenWithLoc,
  NodeWithLoc,
  CursorWithSkipOptions,
  CursorWithCountOptions
} from './eslint'

export interface TokenStore {
  getTokenByRangeStart(
    offset: number,
    options?: { includeComments: boolean }
  ): TokenWithLoc | null
  getFirstToken(node: NodeWithLoc): TokenWithLoc
  getFirstToken(node: NodeWithLoc, options: number): TokenWithLoc
  getFirstToken(
    node: NodeWithLoc,
    options: CursorWithSkipOptions
  ): TokenWithLoc | null
  getLastToken(node: NodeWithLoc): TokenWithLoc
  getLastToken(node: NodeWithLoc, options: number): TokenWithLoc
  getLastToken(
    node: NodeWithLoc,
    options: CursorWithSkipOptions
  ): TokenWithLoc | null
  getTokenBefore(node: NodeWithLoc): TokenWithLoc
  getTokenBefore(node: NodeWithLoc, options: number): TokenWithLoc
  getTokenBefore(
    node: NodeWithLoc,
    options: { includeComments: boolean }
  ): TokenWithLoc
  getTokenBefore(
    node: NodeWithLoc,
    options: CursorWithSkipOptions
  ): TokenWithLoc | null
  getTokenAfter(node: NodeWithLoc): TokenWithLoc
  getTokenAfter(node: NodeWithLoc, options: number): TokenWithLoc
  getTokenAfter(
    node: NodeWithLoc,
    options: { includeComments: boolean }
  ): TokenWithLoc
  getTokenAfter(
    node: NodeWithLoc,
    options: CursorWithSkipOptions
  ): TokenWithLoc | null
  getFirstTokenBetween(
    left: NodeWithLoc,
    right: NodeWithLoc,
    options?: CursorWithSkipOptions
  ): TokenWithLoc | null
  getLastTokenBetween(
    left: NodeWithLoc,
    right: NodeWithLoc,
    options?: CursorWithSkipOptions
  ): TokenWithLoc | null
  getFirstTokens(
    node: NodeWithLoc,
    options?: CursorWithCountOptions
  ): TokenWithLoc[]
  getLastTokens(
    node: NodeWithLoc,
    options?: CursorWithCountOptions
  ): TokenWithLoc[]
  getTokensBefore(
    node: NodeWithLoc,
    options?: CursorWithCountOptions
  ): TokenWithLoc[]
  getTokensAfter(
    node: NodeWithLoc,
    options?: CursorWithCountOptions
  ): TokenWithLoc[]
  getFirstTokensBetween(
    left: NodeWithLoc,
    right: NodeWithLoc,
    options?: CursorWithCountOptions
  ): TokenWithLoc[]
  getLastTokensBetween(
    left: NodeWithLoc,
    right: NodeWithLoc,
    options?: CursorWithCountOptions
  ): TokenWithLoc[]
  getTokens(
    node: NodeWithLoc,
    beforeCount?: CursorWithCountOptions,
    afterCount?: number
  ): TokenWithLoc[]
  getTokensBetween(
    left: NodeWithLoc,
    right: NodeWithLoc,
    padding?: CursorWithCountOptions
  ): TokenWithLoc[]
  commentsExistBetween(left: NodeWithLoc, right: NodeWithLoc): boolean
  getCommentsBefore(nodeOrToken: NodeWithLoc): TokenWithLoc[]
  getCommentsAfter(nodeOrToken: NodeWithLoc): TokenWithLoc[]
  getCommentsInside(node: NodeWithLoc): TokenWithLoc[]
}
