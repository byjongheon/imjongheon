import { getCollection, type CollectionEntry } from "astro:content";
import { getAssetPath } from "./url";
import { slugify } from "./text";
import { PAGES_PATH } from "@/content.config";
import { getAllPosts as getSanityPosts } from "@/lib/sanity/posts";

export type Post = {
  id: string;
  slug: string;
  title: string;
  description: string;
  lang: "ko" | "en";
  published: Date;
  updated?: Date;
  category: string;
  tags: string[];
  cover?: unknown;
  body: any[];
};

export type Page = CollectionEntry<"pages">;
export type TagArchive = {
  tag: string;
  slug: string;
  count: number;
  posts: Post[];
};

let postsCache: Post[] | null = null;
let pagesCache: Page[] | null = null;

function isVisiblePage(page: Page): boolean {
  // Show drafts in development
  if (import.meta.env.DEV) {
    return true;
  }

  return !page.data.draft;
}

function isPublicPage(page: Page): boolean {
  return page.id !== "home-intro";
}

function sortPosts(posts: Post[]): Post[] {
  return posts.sort((a, b) => {
    const aDate = a.updated ?? a.published;
    const bDate = b.updated ?? b.published;

    return bDate.getTime() - aDate.getTime();
  });
}

export async function getAllPosts(): Promise<Post[]> {
  if (postsCache) {
    return postsCache;
  }

  const sanityPosts = await getSanityPosts();

  const posts: Post[] = sanityPosts.map((post) => ({
    id: post._id,
    slug: post.slug,
    title: post.title,
    description: post.description,
    lang: post.lang as "ko" | "en",
    published: new Date(post.published),
    updated: post.updated
      ? new Date(post.updated)
      : undefined,
    category: post.category,
    tags: post.tags,
    cover: post.cover ?? undefined,
    body: Array.isArray(post.body) ? post.body : [],
  }));

  postsCache = sortPosts(posts);

  return postsCache;
}

export async function getAllPages(): Promise<Page[]> {
  if (pagesCache) {
    return pagesCache;
  }

  const pages = await getCollection(
    "pages",
    (page) =>
      isVisiblePage(page) &&
      isPublicPage(page)
  );

  pagesCache = pages;

  return pagesCache;
}

export async function getAllTagArchives(): Promise<TagArchive[]> {
  const posts = await getAllPosts();
  const archives = new Map<
    string,
    {
      tag: string;
      slug: string;
      posts: Post[];
      postIds: Set<string>;
    }
  >();

  for (const post of posts) {
  for (const tag of post.tags) {
      const slug = slugify(tag);

      if (!slug) {
        continue;
      }

      const archive =
        archives.get(slug) ??
        {
          tag,
          slug,
          posts: [],
          postIds: new Set<string>(),
        };

      if (!archive.postIds.has(post.id)) {
        archive.posts.push(post);
        archive.postIds.add(post.id);
      }

      archives.set(slug, archive);
    }
  }

  return Array.from(archives.values())
    .map(({ tag, slug, posts }) => ({
      tag,
      slug,
      count: posts.length,
      posts,
    }))
    .sort((a, b) =>
      a.tag.localeCompare(b.tag)
    );
}

/**
 * Remove hidden folders and normalize directory segments.
 *
 * Example:
 * posts/_2026/Japan Beyond Places.md
 * -> []
 *
 * posts/travel/Japan/Tokyo.md
 * -> ["travel", "japan"]
 */

/**
 * Get the final slug segment from Astro content entry ID.
 *
 * Example:
 * "travel/tokyo-beyond-places"
 * -> "tokyo-beyond-places"
 */
export function getPostSlugSegment(id: string): string {
  const segments = id.split("/");

  return segments.at(-1) ?? id;
}

/**
 * Generate nested slug path from file structure.
 *
 * Example:
 * travel/japan/tokyo.md
 * -> "travel/japan/tokyo"
 */

/**
 * Route param slug used in getStaticPaths().
 *
 * Example:
 * "/travel/japan/tokyo"
 */
export function getPostSlug(slug: string): string {
  return `/${slug}`;
}

export function getPagePathSegments(
  filePath?: string
): string[] {
  if (!filePath) {
    return [];
  }

  return filePath
    .replace(PAGES_PATH, "")
    .split("/")
    .filter(Boolean)
    .filter((segment) => !segment.startsWith("_"))
    .slice(0, -1)
    .map(slugify);
}

export function getPageSlugPath(
  id: string,
  filePath?: string
): string {
  const segments = getPagePathSegments(filePath);
  const slug = slugify(getPostSlugSegment(id));

  return segments.length > 0
    ? [...segments, slug].join("/")
    : slug;
}

export function getPageSlug(
  id: string,
  filePath?: string
): string {
  return `/${getPageSlugPath(id, filePath)}`;
}

/**
 * Full post URL.
 *
 * Example:
 * "/posts/travel/japan/tokyo"
 */
export function getPostUrl(slug: string): string {
  return getAssetPath(`posts/${slug}`);
}

/**
 * Get adjacent posts.
 */
export function getAdjacentPosts<
  T extends Post
>(
  posts: T[],
  currentPost: T
) {
  const index = posts.findIndex(
    (post) => post.id === currentPost.id
  );

  return {
    prevPost:
      index < posts.length - 1
        ? posts[index + 1]
        : null,

    nextPost:
      index > 0
        ? posts[index - 1]
        : null,
  };
}

function scorePostSimilarity(
  currentPost: Post,
  candidatePost: Post
): number {
  let score = 0;

  const currentTags = currentPost.tags;
  const candidateTags = candidatePost.tags;

  // Shared tags
  const sharedTags = currentTags.filter((tag) =>
    candidateTags.includes(tag)
  );

  score += sharedTags.length * 10;

  // Same category
  if (
    currentPost.category &&
    candidatePost.category &&
    currentPost.category === candidatePost.category
  ) {
    score += 5;
  }

  // Slight recency boost
  const currentDate =
    currentPost.updated ?? currentPost.published;

  const candidateDate =
    candidatePost.updated ?? candidatePost.published;

  const diffInDays =
    Math.abs(
      currentDate.getTime() -
        candidateDate.getTime()
    ) /
    (1000 * 60 * 60 * 24);

  if (diffInDays < 30) {
    score += 2;
  }

  return score;
}

export function getRelatedPosts(
  currentPost: Post,
  posts: Post[],
  limit: number
): Post[] {
  return posts
    .filter((post) => post.id !== currentPost.id)
    .map((post) => ({
      post,
      score: scorePostSimilarity(
        currentPost,
        post
      ),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}

// ── Grouping ───────────────────────────────────────────────────────────────────

export function getPostsGroupedByYear(
  entries: Post[]
): [string, Post[]][] {
  const grouped = entries.reduce<Record<string, Post[]>>(
    (acc, entry) => {
      const year = entry.published
        .getFullYear()
        .toString();

      (acc[year] ??= []).push(entry);

      return acc;
    },
    {}
  );

  for (const year in grouped) {
    grouped[year].sort(
      (a, b) =>
        b.published.valueOf() -
        a.published.valueOf()
    );
  }

  return Object.entries(grouped).sort(
    ([a], [b]) => Number(b) - Number(a)
  );
}