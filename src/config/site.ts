export const SITE = {
  title: 'Blog by Jongheon',
  description: '임종헌의 블로그',
  url: 'https://example.com',
  author: 'jongheon',
} as const;

export const NAV_ITEMS = [
  {
    label: 'Blog',
    href: '/blog',
  },
  {
    label: 'Memo',
    href: '/memo',
  },
  {
    label: 'About',
    href: '/about',
  },
] as const;