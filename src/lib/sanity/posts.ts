import {sanityClient} from 'sanity:client'

import {allPostsQuery, postBySlugQuery} from './queries'

export type SanityPost = {
  _id: string;
  slug: string;
  title: string;
  description: string;
  lang: "ko" | "en";
  published: string;
  updated?: string;
  category: string;
  tags: string[];
  cover?: unknown;
  body: unknown;
};

export async function getAllPosts(): Promise<SanityPost[]> {
  return sanityClient.fetch<SanityPost[]>(allPostsQuery);
}

export async function getPostBySlug(slug: string) {
  return sanityClient.fetch(postBySlugQuery, {slug})
}