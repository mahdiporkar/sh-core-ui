import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import definitionSchema from './schemas/definition-manifest.schema.json';
import effectiveSchema from './schemas/effective-manifest.schema.json';
import type {
  SHDefinitionManifest,
  SHEffectiveManifestLintOptions,
  SHManifestDiff,
  SHManifestValidationResult,
} from './types';
import type { SHEffectiveManifest } from '../core';
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const definitionValidator = ajv.compile(definitionSchema);
const effectiveValidator = ajv.compile(effectiveSchema);
const result = (
  valid: boolean,
  errors: typeof definitionValidator.errors,
): SHManifestValidationResult => ({
  valid,
  errors: (errors ?? []).map(
    (error) => `${error.instancePath || '/'} ${error.message ?? 'invalid'}`,
  ),
});
export const validateSHDefinitionManifest = (value: unknown): SHManifestValidationResult =>
  result(definitionValidator(value), definitionValidator.errors);
export const validateSHEffectiveManifest = (value: unknown): SHManifestValidationResult =>
  result(effectiveValidator(value), effectiveValidator.errors);
export function lintSHDefinitionManifest(
  manifest: SHDefinitionManifest,
): SHManifestValidationResult {
  const errors: string[] = [];
  const keys = new Set<string>();
  for (const resource of manifest.resources) {
    if (keys.has(resource.key)) errors.push(`duplicate resource: ${resource.key}`);
    keys.add(resource.key);
    const actions = new Set<string>();
    for (const action of resource.actions) {
      if (actions.has(action.key)) errors.push(`duplicate action: ${resource.key}/${action.key}`);
      actions.add(action.key);
    }
  }
  for (const resource of manifest.resources)
    if (resource.parent && !keys.has(resource.parent))
      errors.push(`invalid parent: ${resource.key} -> ${resource.parent ?? ''}`);
  for (const route of manifest.routes ?? []) {
    if (route.resource && !keys.has(route.resource))
      errors.push(`unknown route resource: ${route.resource}`);
    const resource = manifest.resources.find((item) => item.key === route.resource);
    if (route.action && !resource?.actions.some((action) => action.key === route.action))
      errors.push(`unknown route action: ${route.resource ?? ''}/${route.action}`);
  }
  return { valid: errors.length === 0, errors };
}
const stableContext = (value: Record<string, unknown> | undefined): string =>
  JSON.stringify(Object.entries(value ?? {}).sort(([left], [right]) => left.localeCompare(right)));
export function lintSHEffectiveManifest(
  manifest: SHEffectiveManifest,
  options: SHEffectiveManifestLintOptions = {},
): SHManifestValidationResult {
  const errors: string[] = [];
  const issuedAt = Date.parse(manifest.issuedAt);
  const notBefore = manifest.notBefore ? Date.parse(manifest.notBefore) : undefined;
  const expiresAt = manifest.expiresAt ? Date.parse(manifest.expiresAt) : undefined;
  const refreshAfter = manifest.cache?.refreshAfter
    ? Date.parse(manifest.cache.refreshAfter)
    : undefined;
  const staleAt = manifest.cache?.staleAt ? Date.parse(manifest.cache.staleAt) : undefined;
  if (notBefore !== undefined && notBefore < issuedAt)
    errors.push('notBefore must be at or after issuedAt');
  if (expiresAt !== undefined && expiresAt <= issuedAt)
    errors.push('expiresAt must be after issuedAt');
  if (refreshAfter !== undefined && refreshAfter < issuedAt)
    errors.push('cache.refreshAfter must be at or after issuedAt');
  if (staleAt !== undefined && refreshAfter !== undefined && staleAt < refreshAfter)
    errors.push('cache.staleAt must be at or after cache.refreshAfter');
  if (expiresAt !== undefined && staleAt !== undefined && staleAt > expiresAt)
    errors.push('cache.staleAt must not be after expiresAt');
  if (
    !options.allowExpired &&
    expiresAt !== undefined &&
    expiresAt <= (options.now ?? new Date()).getTime()
  )
    errors.push('manifest is expired');
  const decisions = new Set<string>();
  for (const decision of manifest.decisions) {
    const key = `${decision.resource}/${decision.action}/${stableContext(decision.when)}`;
    if (decisions.has(key)) errors.push(`duplicate effective decision: ${key}`);
    decisions.add(key);
    if (decision.allowed && decision.ui?.deniedBehavior)
      errors.push(
        `allowed decision must not define deniedBehavior: ${decision.resource}/${decision.action}`,
      );
  }
  return { valid: errors.length === 0, errors };
}
export function diffSHDefinitionManifests(
  before: SHDefinitionManifest,
  after: SHDefinitionManifest,
): SHManifestDiff {
  const additive: string[] = [];
  const deprecated: string[] = [];
  const breaking: string[] = [];
  const oldResources = new Map(before.resources.map((resource) => [resource.key, resource]));
  const newResources = new Map(after.resources.map((resource) => [resource.key, resource]));
  for (const [key, resource] of newResources) {
    const old = oldResources.get(key);
    if (!old) {
      additive.push(`resource:${key}`);
      continue;
    }
    const oldActions = new Map(old.actions.map((action) => [action.key, action]));
    for (const action of resource.actions) {
      if (!oldActions.has(action.key)) additive.push(`action:${key}/${action.key}`);
      if (action.deprecated && !oldActions.get(action.key)?.deprecated)
        deprecated.push(`action:${key}/${action.key}`);
    }
    for (const action of old.actions)
      if (!resource.actions.some((candidate) => candidate.key === action.key))
        breaking.push(`action:${key}/${action.key}`);
  }
  for (const key of oldResources.keys())
    if (!newResources.has(key)) breaking.push(`resource:${key}`);
  return { additive, deprecated, breaking };
}
export function generateSHManifestConstants(manifest: SHDefinitionManifest): string {
  const resources = manifest.resources
    .map((resource) => `  ${JSON.stringify(resource.key)}: ${JSON.stringify(resource.key)},`)
    .join('\n');
  const actions = manifest.resources
    .flatMap((resource) =>
      resource.actions.map(
        (action) =>
          `  ${JSON.stringify(`${resource.key}.${action.key}`)}: ${JSON.stringify(action.key)},`,
      ),
    )
    .join('\n');
  return `// Generated by sh-core-ui. Do not edit.\nexport const resources = {\n${resources}\n} as const;\nexport const actions = {\n${actions}\n} as const;\n`;
}
export type { SHEffectiveManifest };
