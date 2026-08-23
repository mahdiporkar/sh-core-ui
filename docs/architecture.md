# Architecture

Dependency direction is `tokens/locales/core → policy → public components → internal adapters`. Public contracts contain no vendor types. Definition Manifests describe application structure; Effective Manifests contain evaluated decisions injected by the host. Resources and actions are arbitrary business-owned strings.

Themes expose typed primitive, semantic, and component tiers plus runtime CSS variables. Locale packs can change direction at runtime. Ant Design token and direction mapping stays internal.

See the ADRs for package, build, and policy decisions. Public changes require a Changeset and Semantic Versioning. Deprecations ship before removal; manifest schema and token breaking changes are major releases.
