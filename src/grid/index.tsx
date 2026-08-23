import { forwardRef, useMemo } from 'react';
import type { SHGridProps, SHGridProviderProps, SHGridRef } from './types';
import { AGGridAdapter } from '../adapters/ag-grid/grid';
import { registerSHGridModules } from '../adapters/ag-grid/modules';
import { useSHPolicy } from '../policy';
export * from './types';

export function SHGridProvider({
  children,
  enterpriseFeatures = [],
  licenseKey,
}: SHGridProviderProps) {
  useMemo(
    () => registerSHGridModules(enterpriseFeatures, licenseKey),
    [enterpriseFeatures, licenseKey],
  );
  return <>{children}</>;
}
export const SHGrid = forwardRef(function SHGrid<T extends object>(
  { policy, columns, actions, ...props }: SHGridProps<T>,
  ref: React.ForwardedRef<SHGridRef>,
) {
  const gridPolicy = useSHPolicy(policy);
  if (!gridPolicy.allowed && gridPolicy.behavior === 'hide') return null;
  return <AGGridAdapter<T> ref={ref} {...props} columns={columns} actions={actions} />;
}) as <T extends object>(
  props: SHGridProps<T> & { ref?: React.ForwardedRef<SHGridRef> },
) => React.ReactElement | null;
