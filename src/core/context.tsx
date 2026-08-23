import { createContext, useContext, useMemo } from 'react';
import type { SHCoreProviderProps } from './types';
import { enUS } from '../locales';
import { themeToCSSVariables, themes } from '../tokens';

export interface SHCoreContextValue extends Required<
  Pick<SHCoreProviderProps, 'theme' | 'locale'>
> {
  manifest: SHCoreProviderProps['manifest'];
  manifestLoading: boolean;
  audit: SHCoreProviderProps['audit'];
  t(key: string, parameters?: Record<string, string | number>): string;
}
const SHCoreContext = createContext<SHCoreContextValue | null>(null);
export function SHCoreProvider({
  children,
  manifest = null,
  manifestLoading = false,
  theme = themes.light,
  locale = enUS,
  audit,
}: SHCoreProviderProps) {
  const value = useMemo<SHCoreContextValue>(
    () => ({
      theme,
      locale,
      manifest,
      manifestLoading,
      audit,
      t: (key, parameters = {}) =>
        Object.entries(parameters).reduce(
          (message, [name, parameter]) => message.split(`{${name}}`).join(String(parameter)),
          locale.messages[key] ?? key,
        ),
    }),
    [theme, locale, manifest, manifestLoading, audit],
  );
  const style = themeToCSSVariables(theme);
  return (
    <SHCoreContext.Provider value={value}>
      <div
        className="sh-root"
        dir={locale.direction}
        lang={locale.code}
        data-sh-theme={theme.name}
        style={style as React.CSSProperties}
      >
        {children}
      </div>
    </SHCoreContext.Provider>
  );
}
export function useSHCore(): SHCoreContextValue {
  const value = useContext(SHCoreContext);
  if (!value) throw new Error('useSHCore must be used inside SHCoreProvider');
  return value;
}
