<div align="center">

# sh-core-ui

### Policy-Aware Enterprise UI Platform

Vendor-neutral React components, Manifest-driven UX, enterprise grids, multilingual RTL/LTR, and verifiable Tree Shaking.

[English](README.md) · [فارسی](README.fa.md) · [العربية](README.ar.md)

[![CI](https://github.com/mahdiporkar/sh-core-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/mahdiporkar/sh-core-ui/actions/workflows/ci.yml)
[![Storybook](https://img.shields.io/badge/Live%20Demo-Storybook-ff4785?logo=storybook&logoColor=white)](https://mahdiporkar.github.io/sh-core-ui/)
[![Webpack 5](https://img.shields.io/badge/Bundler-Webpack%205-8DD6F9?logo=webpack&logoColor=black)](https://webpack.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

### [Open the interactive Live Demo →](https://mahdiporkar.github.io/sh-core-ui/)

</div>

`sh-core-ui` is a domain-agnostic foundation for regulated and data-heavy React applications and micro-frontends. Stable `SH*` contracts hide Ant Design and AG Grid Enterprise, while an evaluated Effective Manifest aligns the interface with backend authorization decisions.

> The Manifest controls user experience only. Backend services or the Go Proxy must re-authorize every protected operation and omit unauthorized rows and fields before sending data to the browser.

## Highlights

- Organization-owned, vendor-neutral `SH*` component contracts.
- Generic `SHGrid<T>` backed by an isolated AG Grid Enterprise adapter.
- Effective Manifest behaviors: `hide`, `disable`, and `readOnly`.
- Typed primitive, semantic, and component Design Tokens.
- English, Persian, and Arabic locale packs with runtime RTL/LTR switching.
- Strict TypeScript and Webpack 5 ESM/CJS/declaration outputs.
- Automated consumer fixtures and bundle budgets for Tree Shaking.
- Storybook controls for theme, locale, direction, density, and policy states.

## Install and quick start

```bash
npm install sh-core-ui react react-dom antd ag-grid-community ag-grid-react ag-grid-enterprise
```

```tsx
import { SHButton, SHCoreProvider } from 'sh-core-ui';
import 'sh-core-ui/styles.css';

const effectiveManifest = await loadEffectiveManifest();

root.render(
  <SHCoreProvider manifest={effectiveManifest}>
    <SHButton policy={{ resource: 'your.resource', action: 'your.action' }}>Run action</SHButton>
  </SHCoreProvider>,
);
```

The Backend or Authorization Engine evaluates identity, context, and business policy, then returns the Effective Manifest. Resource and action names remain business-owned; the core contains no domain-specific roles or permissions.

## Live Storybook

The [interactive catalog](https://mahdiporkar.github.io/sh-core-ui/) demonstrates component variants, accessibility, Design Tokens, Persian/Arabic RTL, and allowed, hidden, disabled, read-only, missing, and expired policy decisions.

```bash
npm ci
npm run storybook       # local development on port 6006
npm run build-storybook # production static build
```

GitHub Actions deploys the verified static build to GitHub Pages after default-branch CI succeeds.

## Package map

| Import                  | Purpose                                            |
| ----------------------- | -------------------------------------------------- |
| `sh-core-ui`            | Convenient public meta entry                       |
| `sh-core-ui/components` | Vendor-neutral `SH*` components                    |
| `sh-core-ui/grid`       | `SHGrid<T>` and grid contracts                     |
| `sh-core-ui/policy`     | Policy hooks, guards, and denied states            |
| `sh-core-ui/manifest`   | Schemas, validation, linting, diff, and generation |
| `sh-core-ui/tokens`     | Typed tokens and themes                            |
| `sh-core-ui/locales`    | Locale packs, formatting, and digit normalization  |

React 18 and 19 are supported peer ranges. Node.js 20+ is required for development.

## Verification

```bash
npm ci
npm run check
```

This runs formatting, ESLint, strict TypeScript, Jest, Manifest checks, dual Webpack builds, Tree Shaking fixtures, and the static Storybook build.

## Documentation

[Architecture](docs/architecture.md) · [Components](docs/component-support.md) · [Manifests](docs/manifests.md) · [Security](docs/security-boundary.md) · [Grid](docs/grid.md) · [Localization](docs/localization-theming.md) · [Tree Shaking](docs/tree-shaking.md) · [Contributing](docs/contributing.md)

The project starts at `0.1.0`; `1.0.0` requires completion and stabilization of the wrapper inventory and Manifest schema.
