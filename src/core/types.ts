import type { ReactNode } from 'react';
import type { SHLocalePack } from '../locales';
import type { SHTheme } from '../tokens';

export type SHDeniedBehavior = 'hide' | 'disable' | 'readOnly';
export interface SHPolicyBinding {
  resource: string;
  action: string;
  context?: Record<string, unknown>;
  pendingBehavior?: 'hide' | 'disable';
}
export interface SHEffectiveDecision {
  resource: string;
  action: string;
  allowed: boolean;
  ui?: { deniedBehavior?: SHDeniedBehavior; reasonCode?: string };
}
export interface SHEffectiveManifest {
  schemaVersion: '1.0';
  version: string;
  issuedAt: string;
  expiresAt?: string;
  decisions: SHEffectiveDecision[];
  cache?: { refreshAfter?: string; etag?: string };
}
export interface SHAuditEvent {
  type: string;
  resource?: string;
  action?: string;
  outcome: 'intent' | 'success' | 'failure' | 'denied';
  metadata?: Record<string, unknown>;
}
export interface SHAuditAdapter {
  emit(event: SHAuditEvent): void | Promise<void>;
}
export interface SHCoreProviderProps {
  children: ReactNode;
  manifest?: SHEffectiveManifest | null;
  manifestLoading?: boolean;
  theme?: SHTheme;
  locale?: SHLocalePack;
  audit?: SHAuditAdapter;
}
