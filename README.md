# sh-core-ui

[![CI](https://github.com/mahdiporkar/sh-core-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/mahdiporkar/sh-core-ui/actions/workflows/ci.yml)
[![Storybook](https://img.shields.io/badge/Storybook-live-ff4785)](https://mahdiporkar.github.io/sh-core-ui/)

Domain-agnostic Policy-Aware Enterprise UI Platform for React applications and micro-frontends. Stable `SH*` APIs hide the current Ant Design and AG Grid Enterprise implementations.

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
    <SHButton policy={{ resource: 'your.resource', action: 'your.action' }}>Action</SHButton>
  </SHCoreProvider>,
);
```

The Backend or Authorization Engine evaluates identity and policy and returns the Effective Manifest. Backend services must re-authorize protected operations and omit unauthorized data; UI hiding is never a security boundary.

## Package map

Optimized subpaths are `sh-core-ui/components`, `/grid`, `/policy`, `/manifest`, `/tokens`, and `/locales`. Webpack 5 emits ESM, CJS, declarations, source maps, and styles. React 18 and 19 are supported peer ranges. Node 20+ is required for development.

## Development

```bash
npm ci
npm run check
npm run storybook
```

The live catalog is deployed to [GitHub Pages](https://mahdiporkar.github.io/sh-core-ui/). See [architecture](docs/architecture.md), [component support](docs/component-support.md), [security boundary](docs/security-boundary.md), [grid](docs/grid.md), and [tree shaking](docs/tree-shaking.md).

This project begins at `0.1.0`; `1.0.0` requires completion and stabilization of the supported wrapper inventory and manifest schema.
