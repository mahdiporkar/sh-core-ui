# Security and data-governance boundary

The Effective Manifest aligns presentation with evaluated backend decisions. It is not authorization enforcement.

- Backend services or the Go Proxy re-authorize every protected operation.
- Unauthorized rows and fields are omitted or redacted before serialization.
- Hiding a route, action, component, or grid column does not secure data already sent to the browser.
- The core contains no roles, resource names, action enum, policy rules, IAM client, workflow engine, or row-level security engine.
