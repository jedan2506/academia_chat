export const theme = {
    light: 'light',
    dark: 'dark',
} as const;

export type Theme = typeof theme[keyof typeof theme];

export const defaultTheme = theme.light;

export const themeStorageKey = 'theme';

export const themeClass = 'dark';

