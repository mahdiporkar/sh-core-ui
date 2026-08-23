# Definition and Effective Manifests

Definition Manifests are developer-owned inventories. Effective Manifests are evaluated, time-bounded decisions returned by a Backend or Authorization Engine. The browser should receive decisions rather than raw policy rules. The host may replace the manifest prop at runtime.

```bash
node scripts/manifest-cli.mjs validate path/to/manifest.json
node scripts/manifest-cli.mjs lint path/to/definition.json
node scripts/manifest-cli.mjs generate definition.json generated/capabilities.ts
```

Missing, expired, and unknown decisions fail closed in the UI. Resource hierarchy is structural only and never grants inherited permission.
