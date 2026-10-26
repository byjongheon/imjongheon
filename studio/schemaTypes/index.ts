
import type {SchemaTypeDefinition} from 'sanity'

import {blockContentType} from './blockContent'
import {categoryType} from './category'
import {postType} from './post'
import {tagType} from './tag'

export const schemaTypes: SchemaTypeDefinition[] = [
  postType,
  categoryType,
  tagType,
  blockContentType,
]