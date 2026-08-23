import type { Preview } from '@storybook/react';
import { SHCoreProvider } from '../src/core';
import type { SHDeniedBehavior } from '../src/core';
import { builtinLocales } from '../src/locales';
import { themes } from '../src/tokens';
import '../src/styles.css';
const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Theme',
      defaultValue: 'light',
      toolbar: { icon: 'paintbrush', items: ['light', 'dark', 'compact', 'highContrast'] },
    },
    locale: {
      description: 'Locale and direction',
      defaultValue: 'en-US',
      toolbar: { icon: 'globe', items: ['en-US', 'fa-IR', 'ar'] },
    },
    density: {
      description: 'Interface density',
      defaultValue: 'comfortable',
      toolbar: { icon: 'component', items: ['comfortable', 'compact'] },
    },
    policy: {
      description: 'Effective decision',
      defaultValue: 'allowed',
      toolbar: {
        icon: 'lock',
        items: ['allowed', 'hide', 'disable', 'readOnly', 'missing', 'expired'],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const mode = context.globals.policy as string;
      const deniedBehavior: SHDeniedBehavior =
        mode === 'hide' || mode === 'disable' || mode === 'readOnly' ? mode : 'disable';
      const manifest =
        mode === 'missing'
          ? null
          : {
              schemaVersion: '1.0' as const,
              version: 'storybook',
              issuedAt: new Date().toISOString(),
              ...(mode === 'expired' ? { expiresAt: '2000-01-01T00:00:00.000Z' } : {}),
              decisions: [
                {
                  resource: 'demo.resource',
                  action: 'demo.action',
                  allowed: mode === 'allowed',
                  ui: { deniedBehavior },
                },
              ],
            };
      const selectedTheme =
        context.globals.density === 'compact'
          ? themes.compact
          : themes[context.globals.theme as keyof typeof themes];
      return (
        <SHCoreProvider
          theme={selectedTheme}
          locale={builtinLocales[context.globals.locale as keyof typeof builtinLocales]}
          manifest={manifest}
        >
          <Story />
        </SHCoreProvider>
      );
    },
  ],
  parameters: {
    controls: { expanded: true },
    a11y: { test: 'error' },
    layout: 'padded',
    options: {
      storySort: {
        order: ['Welcome', 'Documentation', 'Foundations', 'Components', 'Grid', 'Architecture'],
      },
    },
  },
};
export default preview;
