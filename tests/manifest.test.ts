import {
  diffSHDefinitionManifests,
  generateSHManifestConstants,
  lintSHDefinitionManifest,
  lintSHEffectiveManifest,
  validateSHEffectiveManifest,
} from '../src/manifest';
const base = {
  schemaVersion: '1.0' as const,
  application: { id: 'example', version: '1' },
  resources: [{ key: 'items', actions: [{ key: 'read' }] }],
};
test('validates and lints manifests', () => {
  expect(lintSHDefinitionManifest(base).valid).toBe(true);
  expect(
    validateSHEffectiveManifest({
      schemaVersion: '1.0',
      version: '1',
      issuedAt: new Date().toISOString(),
      decisions: [],
    }).valid,
  ).toBe(true);
});
test('lints effective lifecycle and ambiguous duplicate decisions', () => {
  const result = lintSHEffectiveManifest(
    {
      schemaVersion: '1.0',
      version: '1',
      issuedAt: '2026-01-01T00:00:00.000Z',
      expiresAt: '2026-02-01T00:00:00.000Z',
      decisions: [
        { resource: 'items', action: 'read', allowed: true, when: { tenant: 'a' } },
        { resource: 'items', action: 'read', allowed: false, when: { tenant: 'a' } },
      ],
    },
    { now: new Date('2026-01-15T00:00:00.000Z') },
  );
  expect(result.valid).toBe(false);
  expect(result.errors).toContain('duplicate effective decision: items/read/[["tenant","a"]]');
});
test('classifies changes and generates constants', () => {
  const after = {
    ...base,
    resources: [{ key: 'items', actions: [{ key: 'read' }, { key: 'custom' }] }],
  };
  expect(diffSHDefinitionManifests(base, after).additive).toContain('action:items/custom');
  expect(generateSHManifestConstants(after)).toContain('custom');
});
