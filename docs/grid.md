# SHGrid integration

`SHGrid<T>` owns its public column, query, data-source, action, persistence, export, and ref contracts. AG Grid types are adapter-private. Wrap grids in `SHGridProvider`; pass only required enterprise features. The consuming environment may inject its AG Grid Enterprise license through `licenseKey` at runtime. Never commit the key.

For Module Federation, share React, React DOM, Ant Design, AG Grid packages, and `sh-core-ui` as compatible singletons. Air-gapped deployments use installed packages and emitted assets; there is no CDN dependency.
