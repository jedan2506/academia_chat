export const THEME = {
    LIGHT: 'light',
    DARK: 'dark',
} as const;

export type Theme = typeof THEME[keyof typeof THEME];

export const THEME_VALUES = [THEME.LIGHT, THEME.DARK] as const;

export const DEFAULT_THEME = THEME.LIGHT;

