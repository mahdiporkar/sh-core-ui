import type { ReactNode } from 'react';
import type { SHLocalePack } from '../locales';
import type { SHTheme } from '../tokens';

export type SHDeniedBehavior = 'hide' | 'disable' | 'readOnly';
export type SHPolicyContextValue = string | number | boolean | null;
export type SHPolicyContext = Readonly<Record<string, SHPolicyContextValue>>;
export interface SHPolicyBinding {
  resource: string;
  action: string;
  context?: SHPolicyContext;
  pendingBehavior?: 'hide' | 'disable';
}
export interface SHEffectiveDecision {
  resource: string;
  action: string;
  allowed: boolean;
  /** Optional constraints. The most specific matching decision wins. */
  when?: SHPolicyContext;
  ui?: { deniedBehavior?: SHDeniedBehavior; reasonCode?: string; messageKey?: string };
}
export interface SHEffectiveManifest {
  schemaVersion: '1.0';
  version: string;
  manifestId?: string;
  issuer?: string;
  audience?: string;
  application?: { id: string; version?: string };
  subject?: { id: string; tenantId?: string; sessionId?: string };
  issuedAt: string;
  notBefore?: string;
  expiresAt?: string;
  context?: SHPolicyContext;
  defaults?: { deniedBehavior?: SHDeniedBehavior };
  decisions: readonly SHEffectiveDecision[];
  cache?: { refreshAfter?: string; staleAt?: string; etag?: string };
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
