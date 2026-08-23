# Storybook and GitHub Pages

Run `npm run storybook` locally or `npm run build-storybook` for static output. Global toolbar controls switch theme, density, locale/direction, and Effective Manifest state. GitHub Pages deployment uses official artifact actions, enables the Pages site for GitHub Actions on its first authorized run, and derives the repository base path automatically.

The repository owner must allow Actions to create Pages deployments. If organization policy prevents automatic enablement, open **Settings → Pages**, set **Source** to **GitHub Actions**, and rerun the `Storybook Pages` workflow.
