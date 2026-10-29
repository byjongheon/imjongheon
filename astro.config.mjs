// @ts-check
import { defineConfig, fontProviders, svgoOptimizer } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import sanity from '@sanity/astro';
import siteConfig from './src/site.config';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rawFonts } from "./src/plugins/rawFonts";
import { unified } from '@astrojs/markdown-remark';
import remarkCallouts from './src/plugins/remark-callouts';
import { remarkImageProcessing } from './src/plugins/remark-image-processing';
import { remarkExternalLinks } from './src/plugins/remark-external-links.ts';
import { remarkObsidian } from './src/plugins/remark-obsidian.ts';


// https://astro.build/config
export default defineConfig({
  site: siteConfig.url,

  image: {
    responsiveStyles: true,
  },

  experimental: {
    contentIntellisense: true,
    rustCompiler: true,
    queuedRendering: {
      enabled: true,
    },
    svgOptimizer: svgoOptimizer(),
  },

  security: {
  csp: {
    scriptDirective: {
      resources: [
        "'self'",
        "https://static.cloudflareinsights.com",
      ],
    },
    styleDirective: {
      resources: [
        "'self'",
        "'unsafe-inline'",
      ],
    },
    directives: [
      "connect-src 'self' https://cloudflareinsights.com",
      "worker-src 'self' blob:",
    ],
  },
},

  fonts: [
    {
      name: "Pretendard",
      cssVariable: "--font-lipi-sans",
      provider: fontProviders.fontsource(),
      weights: [300, 400, 500, 600, 700],
      fallbacks: ["sans-serif"],
      formats: ["woff2", "woff"],
    },
    {
      name: "Pretendard",
      cssVariable: "--font-lipi-serif",
      provider: fontProviders.fontsource(),
      weights: [300, 400, 500, 600, 700],
      fallbacks: ["sans-serif"],
      formats: ["woff2", "woff"],
    },
    {
      name: "Fira Code",
      cssVariable: "--font-lipi-mono",
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600, 700],
      fallbacks: ["monospace"],
      formats: ["woff", "ttf"],
    },
    {
      name: "Caveat",
      cssVariable: "--font-lipi-hand",
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600, 700],
      fallbacks: ["serif"],
      formats: ["woff", "ttf"],
    }
  ],
  
  vite: {
    // server: {
    //   watch: {
    //     ignored: ['**/.obsidian/**', '**/_bases/**', '**/bases/**', '**/_home/**', '**/home/**', '**/_base/**', '**/base/**']
    //   }
    // },
    // assetsInclude: ['**/*.base', '**/.obsidian/**', '**/_bases/**'],
    build: {
      // Per-page CSS splitting. Caches better than one giant bundle for
      // return visitors who navigate between pages.
      cssCodeSplit: true,
      // cssMinify: 'lightningcss',
      minify: 'esbuild',
    },
    css: {
      transformer: 'lightningcss',
      lightningcss: {
        // Modern targets — drops legacy prefixes.
        targets: {
          chrome: 110 << 16,
          firefox: 115 << 16,
          safari: 16 << 16,
        },
      },
    },
    optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
    plugins: [
      tailwindcss(),
      rawFonts([".ttf",".otf",]),
    ]
  },

  integrations: [
  mdx(),
  sitemap(),
  sanity({
    projectId: 'u3uzfiys',
    dataset: 'production',
    apiVersion: '2026-10-26',
    useCdn: false,
    injectTypes: true,
  }),
],

  build: {
    // Inline small stylesheets into the HTML (~4KB threshold), keep larger
    // ones as separate files so they're cacheable across pages.
    inlineStylesheets: 'auto',
    assets: '_astro',
  },

  markdown: {
    processor: unified({
      gfm: true,
      smartypants: true,
      remarkPlugins: [
        // remarkObsidianCore,
        // remarkGfm,
        remarkObsidian,
        remarkExternalLinks,
        remarkImageProcessing,
        remarkCallouts,
      ],
      rehypePlugins: [
        rehypeSlug,
        rehypeUnwrapImages,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "append",
            properties: {
              className: [
                "heading-anchor",
              ],
              ariaLabel:
                "Copy heading link",
            },
            content: {
              type: "text",
              value: "↗",
            },
          },
        ],
      ],
    }),
  },
});