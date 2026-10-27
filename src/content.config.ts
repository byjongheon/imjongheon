import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

export const PAGES_PATH = "src/content/pages/";

const pagesCollection = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: `./${PAGES_PATH}`,
  }),

  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    updated: z.coerce.date(),
    draft: z.boolean().default(false),
    lang: z.string().optional(),
    annotation: z.string().optional(),
  }),
});

export const collections = {
  pages: pagesCollection,
};