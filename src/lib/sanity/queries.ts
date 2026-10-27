import {defineQuery} from 'groq'

export const allPostsQuery = defineQuery(`
  *[
    _type == "post" &&
    defined(slug.current)
  ]
  | order(publishedAt desc) {
    "_id": _id,
    "slug": slug.current,
    title,
    description,
    "lang": language,
    "published": publishedAt,
    "updated": _updatedAt,
    "category": category->title,
    "tags": coalesce(tags[]->title, []),
    "cover": mainImage{
      ...,
      alt
    },
    body
  }
`)

export const postBySlugQuery = defineQuery(`
  *[
    _type == "post" &&
    slug.current == $slug
  ][0] {
    "_id": _id,
    "slug": slug.current,
    title,
    description,
    "lang": language,
    "published": publishedAt,
    "updated": _updatedAt,
    "category": category->title,
    "tags": coalesce(tags[]->title, []),
    "cover": mainImage{
      ...,
      alt
    },
    body
  }
`)