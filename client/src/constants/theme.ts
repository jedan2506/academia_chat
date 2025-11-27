export const THEME = {
    LIGHT: 'light',
    DARK: 'dark',
} as const;

export type Theme = typeof THEME[keyof typeof THEME];

export const DEFAULT_THEME = THEME.LIGHT;

export const THEME_STORAGE_KEY = 'theme';

export const THEME_CLASS = 'dark';

