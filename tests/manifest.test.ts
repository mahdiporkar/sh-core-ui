import {
  diffSHDefinitionManifests,
  generateSHManifestConstants,
  lintSHDefinitionManifest,
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
test('classifies changes and generates constants', () => {
  const after = {
    ...base,
    resources: [{ key: 'items', actions: [{ key: 'read' }, { key: 'custom' }] }],
  };
  expect(diffSHDefinitionManifests(base, after).additive).toContain('action:items/custom');
  expect(generateSHManifestConstants(after)).toContain('custom');
});
