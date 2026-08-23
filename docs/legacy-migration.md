# Migration from shaparak-core-ui

The legacy `SHSelect`, `SHForm`, `SHNotification`, and `SHGrid` concepts were reviewed rather than copied verbatim.

- `SHSelect` retains debounced remote search and load-more, using `AbortSignal`, owned option types, stale-request cancellation, runtime direction, and localized labels.
- `SHForm` retains config-driven fields with owned validation contracts. Ant Design and `rc-field-form` types are not public.
- `SHNotification` uses a context-aware host and hook so theme, locale, direction, and React context work correctly. Components use `useSHNotification()`; service modules and HTTP interceptors use the vendor-neutral global `SHNotify` facade after one `<SHNotification>` host is mounted. Calls made before mount are retained in a bounded queue.
- The current generic `SHGrid<T>` remains authoritative. The legacy grid eagerly imported all enterprise code, mixed DevExtreme and AG Grid, forced RTL/server-side behavior, and exported vendor types. Server-side loading and useful locale/default-column behavior were integrated into the current adapter without restoring those leaks.

Legacy application authentication services, organization fonts, DevExtreme adapters, Toastify, hard-coded Persian strings, and business-specific examples are intentionally not part of the core package. The useful global-notification behavior was preserved without adding or exposing Toastify.
