import type { ReactElement, ReactNode } from 'react';
import { useSHCore } from '../core';
import type { SHDeniedBehavior, SHEffectiveDecision, SHPolicyBinding } from '../core';

export type SHPolicyStatus = 'allowed' | 'denied' | 'loading' | 'missing' | 'expired';
export interface SHPolicyResult {
  status: SHPolicyStatus;
  allowed: boolean;
  behavior: SHDeniedBehavior;
  reasonCode?: string;
  decision?: SHEffectiveDecision;
}
const matchContext = (): boolean => true;
export function useSHPolicy(binding?: SHPolicyBinding): SHPolicyResult {
  const { manifest, manifestLoading } = useSHCore();
  if (!binding) return { status: 'allowed', allowed: true, behavior: 'disable' };
  if (manifestLoading)
    return { status: 'loading', allowed: false, behavior: binding.pendingBehavior ?? 'disable' };
  if (!manifest) return { status: 'missing', allowed: false, behavior: 'disable' };
  if (manifest.expiresAt && Date.parse(manifest.expiresAt) <= Date.now())
    return { status: 'expired', allowed: false, behavior: 'disable' };
  const decision = manifest.decisions.find(
    (item) =>
      item.resource === binding.resource && item.action === binding.action && matchContext(),
  );
  if (!decision) return { status: 'missing', allowed: false, behavior: 'disable' };
  const reasonCode = decision.ui?.reasonCode;
  return {
    status: decision.allowed ? 'allowed' : 'denied',
    allowed: decision.allowed,
    behavior: decision.ui?.deniedBehavior ?? 'disable',
    decision,
    ...(reasonCode === undefined ? {} : { reasonCode }),
  };
}
export interface SHCanProps {
  policy: SHPolicyBinding;
  children: ReactNode;
  fallback?: ReactNode;
}
export function SHCan({ policy, children, fallback = null }: SHCanProps) {
  const result = useSHPolicy(policy);
  return result.allowed ? <>{children}</> : <>{fallback}</>;
}
export interface SHAccessDeniedProps {
  reasonCode?: string;
  children?: ReactNode;
}
export function SHAccessDenied({ reasonCode, children }: SHAccessDeniedProps) {
  const { t } = useSHCore();
  return (
    <div className="sh-access-denied" role="alert" data-reason-code={reasonCode}>
      {children ?? t('policy.denied')}
    </div>
  );
}
export interface SHRouteGuardProps extends SHCanProps {
  loadingFallback?: ReactNode;
}
export function SHRouteGuard({
  policy,
  children,
  fallback = <SHAccessDenied />,
  loadingFallback = null,
}: SHRouteGuardProps) {
  const result = useSHPolicy(policy);
  if (result.status === 'loading') return <>{loadingFallback}</>;
  return result.allowed ? <>{children}</> : <>{fallback}</>;
}
export interface SHActionProps extends SHCanProps {
  onDenied?: (result: SHPolicyResult) => void;
}
export function SHAction({ policy, children, fallback = null }: SHActionProps): ReactElement {
  const result = useSHPolicy(policy);
  return <>{result.allowed ? children : fallback}</>;
}
