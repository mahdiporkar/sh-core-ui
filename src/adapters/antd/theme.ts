import type { ThemeConfig } from 'antd';
import type { SHTheme } from '../../tokens';
export const toAntTheme = (theme: SHTheme): ThemeConfig => ({
  token: {
    colorPrimary: theme.semantic.action,
    colorError: theme.semantic.error,
    colorSuccess: theme.semantic.success,
    colorWarning: theme.semantic.warning,
    colorInfo: theme.semantic.information,
    colorText: theme.semantic.text,
    colorBgContainer: theme.semantic.surface,
    colorBorder: theme.semantic.border,
    borderRadius: Number.parseFloat(theme.primitives.radii.md) * 16,
    fontFamily: theme.primitives.typography.family,
  },
  components: {
    Button: { controlHeight: Number.parseFloat(theme.components.button.height) * 16 },
    Input: { controlHeight: Number.parseFloat(theme.components.input.height) * 16 },
  },
});
