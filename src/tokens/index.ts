export const SH_THEME_NAMES = ['light', 'dark', 'compact', 'highContrast'] as const;
export type SHThemeName = (typeof SH_THEME_NAMES)[number];

export interface SHPrimitiveTokens {
  colors: {
    white: string;
    black: string;
    blue500: string;
    blue700: string;
    gray50: string;
    gray200: string;
    gray700: string;
    gray950: string;
    green600: string;
    amber600: string;
    red600: string;
  };
  spacing: { xs: string; sm: string; md: string; lg: string; xl: string };
  typography: {
    family: string;
    sizeSm: string;
    sizeMd: string;
    sizeLg: string;
    weightRegular: number;
    weightStrong: number;
  };
  radii: { sm: string; md: string; pill: string };
  shadows: { raised: string };
  motion: { fast: string; normal: string };
  breakpoints: { sm: number; md: number; lg: number; xl: number };
}
export interface SHSemanticTokens {
  surface: string;
  surfaceRaised: string;
  text: string;
  textMuted: string;
  border: string;
  action: string;
  actionHover: string;
  focus: string;
  disabled: string;
  selected: string;
  success: string;
  warning: string;
  information: string;
  error: string;
}
export interface SHComponentTokens {
  button: { radius: string; paddingInline: string; height: string };
  input: { radius: string; height: string };
  card: { radius: string; shadow: string };
}
export interface SHTheme {
  name: string;
  primitives: SHPrimitiveTokens;
  semantic: SHSemanticTokens;
  components: SHComponentTokens;
  density: 'comfortable' | 'compact';
}

export const primitives: SHPrimitiveTokens = {
  colors: {
    white: '#fff',
    black: '#000',
    blue500: '#1677ff',
    blue700: '#0958d9',
    gray50: '#fafafa',
    gray200: '#d9d9d9',
    gray700: '#434343',
    gray950: '#141414',
    green600: '#389e0d',
    amber600: '#d48806',
    red600: '#cf1322',
  },
  spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
  typography: {
    family: 'system-ui, sans-serif',
    sizeSm: '0.875rem',
    sizeMd: '1rem',
    sizeLg: '1.25rem',
    weightRegular: 400,
    weightStrong: 600,
  },
  radii: { sm: '0.25rem', md: '0.5rem', pill: '999rem' },
  shadows: { raised: '0 0.25rem 1rem rgb(0 0 0 / 12%)' },
  motion: { fast: '120ms', normal: '200ms' },
  breakpoints: { sm: 576, md: 768, lg: 992, xl: 1200 },
};
const componentTokens = (compact = false): SHComponentTokens => ({
  button: {
    radius: primitives.radii.md,
    paddingInline: compact ? primitives.spacing.sm : primitives.spacing.md,
    height: compact ? '1.75rem' : '2.25rem',
  },
  input: { radius: primitives.radii.md, height: compact ? '1.75rem' : '2.25rem' },
  card: { radius: primitives.radii.md, shadow: primitives.shadows.raised },
});
export const themes: Record<SHThemeName, SHTheme> = {
  light: {
    name: 'light',
    primitives,
    density: 'comfortable',
    semantic: {
      surface: primitives.colors.white,
      surfaceRaised: primitives.colors.gray50,
      text: primitives.colors.gray950,
      textMuted: primitives.colors.gray700,
      border: primitives.colors.gray200,
      action: primitives.colors.blue500,
      actionHover: primitives.colors.blue700,
      focus: primitives.colors.blue500,
      disabled: primitives.colors.gray200,
      selected: '#e6f4ff',
      success: primitives.colors.green600,
      warning: primitives.colors.amber600,
      information: primitives.colors.blue500,
      error: primitives.colors.red600,
    },
    components: componentTokens(),
  },
  dark: {
    name: 'dark',
    primitives,
    density: 'comfortable',
    semantic: {
      surface: primitives.colors.gray950,
      surfaceRaised: '#1f1f1f',
      text: primitives.colors.white,
      textMuted: '#bfbfbf',
      border: primitives.colors.gray700,
      action: '#4096ff',
      actionHover: '#69b1ff',
      focus: '#4096ff',
      disabled: primitives.colors.gray700,
      selected: '#15325b',
      success: '#49aa19',
      warning: '#d89614',
      information: '#4096ff',
      error: '#dc4446',
    },
    components: componentTokens(),
  },
  compact: {
    name: 'compact',
    primitives,
    density: 'compact',
    semantic: {} as SHSemanticTokens,
    components: componentTokens(true),
  },
  highContrast: {
    name: 'highContrast',
    primitives,
    density: 'comfortable',
    semantic: {
      surface: '#000',
      surfaceRaised: '#000',
      text: '#fff',
      textMuted: '#fff',
      border: '#fff',
      action: '#00ffff',
      actionHover: '#ffff00',
      focus: '#ffff00',
      disabled: '#777',
      selected: '#003b3b',
      success: '#00ff00',
      warning: '#ffff00',
      information: '#00ffff',
      error: '#ff4d4f',
    },
    components: componentTokens(),
  },
};
themes.compact.semantic = themes.light.semantic;

export function mergeSHTheme(
  base: SHTheme,
  override: Partial<Omit<SHTheme, 'semantic' | 'components'>> & {
    semantic?: Partial<SHSemanticTokens>;
    components?: Partial<SHComponentTokens>;
  },
): SHTheme {
  return {
    ...base,
    ...override,
    semantic: { ...base.semantic, ...override.semantic },
    components: { ...base.components, ...override.components } as SHComponentTokens,
  };
}
export function themeToCSSVariables(theme: SHTheme): Record<string, string> {
  return Object.fromEntries(
    Object.entries(theme.semantic).map(([key, value]) => [
      `--sh-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
      value,
    ]),
  );
}
