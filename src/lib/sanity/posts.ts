import {sanityClient} from 'sanity:client'

import {allPostsQuery, postBySlugQuery} from './queries'

export async function getAllPosts() {
  return sanityClient.fetch(allPostsQuery)
}

export async function getPostBySlug(slug: string) {
  return sanityClient.fetch(postBySlugQuery, {slug})
}