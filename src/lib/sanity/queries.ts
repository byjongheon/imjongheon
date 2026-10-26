import {defineQuery} from 'groq'

export const allPostsQuery = defineQuery(`
  *[
    _type == "post" &&
    defined(slug.current)
  ]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    language,
    publishedAt,
    category->{
      _id,
      title,
      "slug": slug.current
    },
    tags[]->{
      _id,
      title,
      "slug": slug.current
    },
    mainImage,
    body
  }
`)

export const postBySlugQuery = defineQuery(`
  *[
    _type == "post" &&
    slug.current == $slug
  ][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    language,
    publishedAt,
    category->{
      _id,
      title,
      "slug": slug.current
    },
    tags[]->{
      _id,
      title,
      "slug": slug.current
    },
    mainImage,
    body
  }
`)