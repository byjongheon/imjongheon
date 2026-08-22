import type { UserConfig } from "../src/site.config";

const userConfig: UserConfig = {
  title: "임종헌",
  description: "임종헌의 개인 블로그",

  url: "https://imjongheon.com",
  author: "jongheon",

  logo: "/logo.svg",
  avatar: "/avatar.png",

  navigation: [
    { title: "Home", url: "/" },
    { title: "Blog", url: "/posts" },
    { title: "Memo", url: "/memo" },
    { title: "About", url: "/about" },
  ],

  footerLinks: [
    { title: "RSS", url: "/rss.xml" },
    { title: "Archive", url: "/archive" },
    { title: "GitHub", url: "https://github.com/jonghoney" },
  ],

  social: [
    {
      title: "GitHub",
      url: "https://github.com/jonghoney",
      icon: "github",
    },
  ],

  footerCredits: "Built with Astro & Lipi",

  postsPerPage: 8,
  recentPosts: 6,
  relatedPosts: 4,

  showThemeToggle: true,
  showReadingTime: false,

  heroVariant: "studio",

  annotation: "블로그 주인",
};

export default userConfig;