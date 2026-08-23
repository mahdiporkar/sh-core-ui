# Manifest architecture and lifecycle

This document defines the authoritative Manifest model. For component tutorials, see
[English](policy-manifest.md), [فارسی](policy-manifest.fa.md), or [العربية](policy-manifest.ar.md).

## Definition and Effective Manifests

A **Definition Manifest** is a developer-owned, version-controlled inventory of application
resources, actions, and routes. It contains no roles, grants, users, or policy rules.

An **Effective Manifest** is a backend-owned, evaluated, short-lived set of decisions for one opaque
subject, application, audience, and context. It is the only Manifest sent to `SHCoreProvider`.

```text
Definition + identity + tenant + context + business policy
                         │
                         ▼
                Authorization Engine
                         │
                         ▼
                 Effective Manifest
                         │
                         ▼
                   SHCoreProvider
```

## Recommended Effective Manifest

```json
{
  "schemaVersion": "1.0",
  "version": "42",
  "manifestId": "01J6MANIFEST42",
  "issuer": "authorization-engine",
  "audience": "operations-web",
  "application": { "id": "operations-web", "version": "3.4.0" },
  "subject": {
    "id": "opaque-subject-id",
    "tenantId": "tenant-north",
    "sessionId": "opaque-session-id"
  },
  "issuedAt": "2026-08-24T08:00:00.000Z",
  "notBefore": "2026-08-24T08:00:00.000Z",
  "expiresAt": "2026-08-24T08:15:00.000Z",
  "context": { "tenantId": "tenant-north", "channel": "web" },
  "defaults": { "deniedBehavior": "disable" },
  "decisions": [
    { "resource": "records", "action": "view", "allowed": true },
    {
      "resource": "records",
      "action": "edit",
      "allowed": false,
      "ui": {
        "deniedBehavior": "readOnly",
        "reasonCode": "APPROVAL_REQUIRED",
        "messageKey": "policy.approvalRequired"
      }
    },
    {
      "resource": "records",
      "action": "export",
      "allowed": true,
      "when": { "channel": "operations" }
    }
  ],
  "cache": {
    "refreshAfter": "2026-08-24T08:10:00.000Z",
    "staleAt": "2026-08-24T08:14:00.000Z",
    "etag": "manifest-42"
  }
}
```

## Field semantics

| Field           | Purpose                                                                               |
| --------------- | ------------------------------------------------------------------------------------- |
| `schemaVersion` | JSON contract version, independent of decision revision                               |
| `version`       | Authorization revision                                                                |
| `manifestId`    | Correlation identifier for diagnostics and audit; never a secret                      |
| `issuer`        | Service that evaluated the decisions                                                  |
| `audience`      | Intended consuming application or channel                                             |
| `application`   | Application identity and optional release version                                     |
| `subject`       | Opaque identity/session references; exclude names, email, tokens, and unnecessary PII |
| `issuedAt`      | Evaluation time                                                                       |
| `notBefore`     | Earliest activation time                                                              |
| `expiresAt`     | Hard validity boundary; expiry fails closed                                           |
| `context`       | Ambient scalar context shared by decision matching                                    |
| `defaults`      | Denied presentation only; it can never default to allow                               |
| `decisions`     | Explicit evaluated resource/action decisions                                          |
| `cache`         | Refresh/staleness hints, never permission extensions                                  |

## Contextual resolution

`when` is an optional set of scalar constraints. Runtime context combines Manifest context with the
component binding context; binding values override ambient values. Every constraint must match. If
multiple decisions match, the one with the greatest number of constraints wins. An unconstrained
decision is therefore a fallback.

```tsx
<SHButton
  policy={{
    resource: 'records',
    action: 'export',
    context: { channel: 'operations' },
  }}
>
  Export
</SHButton>
```

Duplicate `resource + action + when` combinations are invalid. Resolution never depends on array
order.

## Fail-closed rules

- No Manifest or matching decision: deny.
- Invalid, expired, or not-yet-valid Manifest: deny.
- Loading: apply `pendingBehavior`, otherwise disable.
- `defaults.deniedBehavior` changes presentation only and cannot grant access.

## Cache lifecycle

1. Fetch from a trusted authenticated endpoint.
2. Validate JSON Schema and semantic lint rules.
3. Confirm issuer, audience, application, subject/session, and relevant context in the host.
4. Activate only inside the `notBefore`/`expiresAt` window.
5. Revalidate using `etag` around `refreshAfter`.
6. Treat `staleAt` as urgent refresh; never extend use beyond `expiresAt`.
7. Replace Provider state atomically after login/logout, tenant switch, or authorization events.

## Tooling

```bash
node scripts/manifest-cli.mjs validate path/to/manifest.json
node scripts/manifest-cli.mjs lint path/to/manifest.json
node scripts/manifest-cli.mjs generate definition.json generated/capabilities.ts
```

Validation enforces JSON shape and date-time formats. Linting enforces semantic relationships such
as unique decisions and chronological boundaries.

## Evolution

- Adding resources/actions is backward compatible.
- Deprecate an action before removal.
- Removing or renaming identifiers is breaking.
- Change `schemaVersion` only for contract incompatibility, not for a policy revision.
- Keep identifiers stable and domain-owned; core contains no business roles or grants.

## Security boundary

The Effective Manifest is a UX projection, not a bearer token or proof of authorization. The backend
or gateway must authorize every request from trusted server-side facts and remove unauthorized rows
and fields before serialization. Never include raw policy rules, secrets, access tokens, or
unnecessary personal data.
