import type {
  APIRoute,
} from "astro";

import {
  getAllPosts,
} from "@/utils/content";

import {
  generateOgImage,
} from "@/utils/og";

export async function getStaticPaths() {
  const posts =
    await getAllPosts();

  return posts.map((post) => ({
    params: {
      slug: post.slug,
    },

    props: {
      post,
    },
  }));
}

export const GET: APIRoute =
  async ({ props }) => {
    const { post } = props;

    const png =
      await generateOgImage({
        title: post.title,

        description:
          post.description,

        category:
          post.category,

        published:
          post.updated ??
          post.published,
      });

    return new Response(png, {
      headers: {
        "Content-Type":
          "image/png",
      },
    });
  };