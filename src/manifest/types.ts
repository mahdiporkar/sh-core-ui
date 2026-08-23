export interface SHDefinitionAction {
  key: string;
  deprecated?: boolean;
  description?: string;
}
export interface SHDefinitionResource {
  key: string;
  type?: string;
  parent?: string;
  actions: readonly SHDefinitionAction[];
  metadata?: Record<string, unknown>;
}
export interface SHDefinitionRoute {
  id: string;
  path: string;
  resource?: string;
  action?: string;
  parent?: string;
  navigation?: { labelKey: string; order?: number };
}
export interface SHDefinitionManifest {
  schemaVersion: '1.0';
  application: { id: string; version: string; microFrontend?: { name: string; entry?: string } };
  resources: readonly SHDefinitionResource[];
  routes?: readonly SHDefinitionRoute[];
}
export interface SHManifestValidationResult {
  valid: boolean;
  errors: readonly string[];
}
export interface SHManifestDiff {
  additive: readonly string[];
  deprecated: readonly string[];
  breaking: readonly string[];
}
export interface SHEffectiveManifestLintOptions {
  now?: Date;
  allowExpired?: boolean;
}
