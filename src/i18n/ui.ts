export const languages = { de: 'Deutsch', en: 'English' } as const;
export const defaultLang = 'de' as const;

export type Lang = keyof typeof languages;

export const ui = {
  de: {
    'nav.home': 'Start',
    'nav.blog': 'Blog',
    'skip.to_content': 'Zum Inhalt springen',
    'blog.reading_time': 'Lesezeit',
    'blog.published': 'Veröffentlicht',
    'blog.updated': 'Aktualisiert',
  },
  en: {
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'skip.to_content': 'Skip to content',
    'blog.reading_time': 'Reading time',
    'blog.published': 'Published',
    'blog.updated': 'Updated',
  },
} as const;

export type UIKey = keyof (typeof ui)[typeof defaultLang];
