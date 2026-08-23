# Applying Manifest policies to components

[فارسی](policy-manifest.fa.md) · [English](policy-manifest.md) · [العربية](policy-manifest.ar.md)

## Responsibility flow

1. The backend or Authorization Engine evaluates identity, roles, tenant, request context, ownership, and business rules.
2. It returns an evaluated **Effective Manifest** for the current session.
3. The application injects that Manifest into `SHCoreProvider`.
4. Each component declares the `resource` and `action` it needs through its `policy` prop.
5. `useSHPolicy` finds the exact matching decision and the component applies `hide`, `disable`, or `readOnly`.
6. The backend independently authorizes every protected API request.

Components never calculate permissions from roles. They only consume decisions already evaluated by a trusted backend.

## Effective Manifest

```ts
const effectiveManifest = {
  schemaVersion: '1.0',
  version: '2026-08-24.1',
  issuedAt: '2026-08-24T08:00:00.000Z',
  expiresAt: '2026-08-24T08:15:00.000Z',
  decisions: [
    { resource: 'orders', action: 'view', allowed: true },
    {
      resource: 'orders',
      action: 'create',
      allowed: false,
      ui: { deniedBehavior: 'disable', reasonCode: 'APPROVAL_REQUIRED' },
    },
    {
      resource: 'orders',
      action: 'edit',
      allowed: false,
      ui: { deniedBehavior: 'readOnly' },
    },
    {
      resource: 'orders',
      action: 'delete',
      allowed: false,
      ui: { deniedBehavior: 'hide' },
    },
  ],
};
```

This is different from a Definition Manifest. A Definition Manifest describes the resources and actions supported by an application; an Effective Manifest contains evaluated decisions for one identity and context.

For production payloads, also include opaque `manifestId`, `issuer`, `audience`, `application`, and
`subject` references; `notBefore`; ambient scalar `context`; deny-only `defaults`; and
`cache.refreshAfter`, `cache.staleAt`, and `cache.etag`. Never include tokens, secrets, raw policy
rules, or unnecessary personal data. See the [authoritative structure](manifests.md).

### Context-specific decisions

A decision can declare scalar `when` constraints. Manifest context and component context are merged;
component values override ambient values. Every constraint must match, and the most specific matching
decision wins. An unconstrained decision acts as fallback.

```tsx
<SHButton
  policy={{
    resource: 'orders',
    action: 'export',
    context: { channel: 'operations' },
  }}
>
  Export
</SHButton>
```

Duplicate `resource + action + when` combinations are invalid.

## Injecting the Manifest

```tsx
<SHCoreProvider manifest={effectiveManifest} manifestLoading={false}>
  <App />
</SHCoreProvider>
```

While fetching it, set `manifestLoading={true}`. A policy can use `pendingBehavior: 'hide'` or `'disable'` to control its loading presentation.

## Binding components

```tsx
<SHButton policy={{ resource: 'orders', action: 'view' }}>View orders</SHButton>

<SHButton policy={{ resource: 'orders', action: 'create' }}>Create order</SHButton>

<SHInput
  label="Order title"
  policy={{ resource: 'orders', action: 'edit' }}
/>

<SHButton
  tone="danger"
  policy={{ resource: 'orders', action: 'delete' }}
>
  Delete order
</SHButton>
```

Matching uses the exact `resource + action` pair.

| Decision            | UI result                                       |
| ------------------- | ----------------------------------------------- |
| `allowed: true`     | Normal behavior                                 |
| denied + `hide`     | Component is not rendered                       |
| denied + `disable`  | Component is visible but disabled               |
| denied + `readOnly` | Inputs become read-only; actions cannot execute |
| missing Manifest    | Fail closed; disabled                           |
| missing decision    | Fail closed; disabled                           |
| expired Manifest    | Fail closed; disabled                           |
| loading             | Uses `pendingBehavior`, otherwise disabled      |

For actions such as buttons, `readOnly` prevents execution and therefore behaves like disabled. For data-entry controls it preserves visibility and value while preventing edits.

## Conditional fragments

```tsx
<SHCan policy={{ resource: 'reports', action: 'view' }} fallback={<p>Reports are unavailable.</p>}>
  <Reports />
</SHCan>
```

## Protected routes

```tsx
<SHRouteGuard
  policy={{ resource: 'reports', action: 'view' }}
  loadingFallback={<PageSkeleton />}
  fallback={<SHAccessDenied />}
>
  <ReportsPage />
</SHRouteGuard>
```

## Direct policy inspection

Use the hook when a custom component needs the decision details:

```tsx
const policy = useSHPolicy({ resource: 'orders', action: 'approve' });

if (!policy.allowed) {
  return <SHAccessDenied reasonCode={policy.reasonCode} />;
}
```

The result contains `allowed`, `status`, `behavior`, optional `reasonCode`, and the matching decision.

## Refresh and failure handling

- Validate the payload and expiry before use.
- Refresh it on login, logout, tenant/context changes, authorization events, or `cache.refreshAfter`.
- Treat missing, invalid, or expired Manifests as denied.
- Do not persist a Manifest beyond its intended session or expiry.

## Security boundary

Manifest policy improves UX; it is not authorization enforcement. Users can modify browser state and call APIs directly. The backend or gateway must re-authorize every operation and remove unauthorized fields and rows before serialization.
