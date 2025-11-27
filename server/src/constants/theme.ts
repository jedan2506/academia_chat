export const theme = {
    light: 'light',
    dark: 'dark',
} as const;

export type Theme = typeof theme[keyof typeof theme];

export const themeValues = [theme.light, theme.dark] as const;

export const defaultTheme = theme.light;

