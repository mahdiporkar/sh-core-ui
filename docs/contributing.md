# Contributing, migration, and releases

Run `npm run check`. A public feature is minor, a compatible fix is patch, and a breaking API, token, behavior, or manifest schema change is major. Add a Changeset for every public change. Deprecate before removal and provide migration notes in the changelog.

Use deterministic `npm ci`. For private Nexus or offline installations, mirror all package tarballs, configure the npm registry in the consuming environment, and retain the lockfile. No runtime CDN is required.
