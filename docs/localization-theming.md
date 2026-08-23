# Theming, localization, and RTL

Use built-in `en-US`, `fa-IR`, or `ar` packs or supply an `SHLocalePack`. `SHCoreProvider` updates `lang` and `dir` without reload. `normalizeSHDigits` converts Persian and Arabic digits. The date adapter supports Gregorian and Persian calendar presentation through `Intl`.

Light, dark, compact, and high-contrast-ready themes are included. `mergeSHTheme` creates brand overrides and `themeToCSSVariables` exposes semantic values. Supported components target WCAG 2.2 AA; AG Grid and Ant Design upstream behavior must also be reviewed per selected versions.
