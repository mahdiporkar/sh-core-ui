import { forwardRef } from 'react';
import {
  AntAlertAdapter,
  AntButtonAdapter,
  AntCardAdapter,
  AntCheckboxAdapter,
  AntInputAdapter,
  AntModalAdapter,
  AntSelectAdapter,
  AntSwitchAdapter,
  AntTableAdapter,
  AntTabsAdapter,
} from '../adapters/antd/components';
import { useSHPolicy } from '../policy';
import type {
  SHAlertProps,
  SHButtonProps,
  SHCardProps,
  SHCheckboxProps,
  SHInputProps,
  SHInputRef,
  SHModalProps,
  SHSelectProps,
  SHSwitchProps,
  SHTableProps,
  SHTabsProps,
} from './types';

function usePresentation(policy: SHButtonProps['policy']) {
  const result = useSHPolicy(policy);
  return {
    hidden: !result.allowed && result.behavior === 'hide',
    disabled:
      !result.allowed &&
      (result.behavior === 'disable' ||
        result.status === 'loading' ||
        result.status === 'missing' ||
        result.status === 'expired'),
    readOnly: !result.allowed && result.behavior === 'readOnly',
  };
}
export const SHButton = forwardRef<HTMLButtonElement, SHButtonProps>(function SHButton(
  { policy, ...props },
  ref,
) {
  const state = usePresentation(policy);
  if (state.hidden) return null;
  return (
    <AntButtonAdapter
      ref={ref}
      {...props}
      disabled={props.disabled || state.disabled || state.readOnly}
    />
  );
});
export const SHInput = forwardRef<SHInputRef, SHInputProps>(function SHInput(
  { policy, ...props },
  ref,
) {
  const state = usePresentation(policy);
  if (state.hidden) return null;
  return (
    <AntInputAdapter
      ref={ref}
      {...props}
      disabled={props.disabled || state.disabled}
      readOnly={props.readOnly || state.readOnly}
    />
  );
});
export function SHSelect({ policy, ...props }: SHSelectProps) {
  const state = usePresentation(policy);
  if (state.hidden) return null;
  return (
    <AntSelectAdapter
      {...props}
      disabled={props.disabled || state.disabled || state.readOnly}
      readOnly={props.readOnly || state.readOnly}
    />
  );
}
export function SHCheckbox({ policy, ...props }: SHCheckboxProps) {
  const state = usePresentation(policy);
  if (state.hidden) return null;
  return (
    <AntCheckboxAdapter
      {...props}
      disabled={props.disabled || state.disabled}
      readOnly={props.readOnly || state.readOnly}
    />
  );
}
export function SHSwitch({ policy, ...props }: SHSwitchProps) {
  const state = usePresentation(policy);
  if (state.hidden) return null;
  return (
    <AntSwitchAdapter
      {...props}
      disabled={props.disabled || state.disabled}
      readOnly={props.readOnly || state.readOnly}
    />
  );
}
export function SHAlert({ policy, ...props }: SHAlertProps) {
  const state = usePresentation(policy);
  return state.hidden || state.disabled || state.readOnly ? null : <AntAlertAdapter {...props} />;
}
export function SHCard({ policy, ...props }: SHCardProps) {
  const state = usePresentation(policy);
  return state.hidden ? null : (
    <AntCardAdapter
      {...props}
      className={[props.className, state.readOnly ? 'sh-readonly' : ''].filter(Boolean).join(' ')}
    />
  );
}
export function SHModal({ policy, ...props }: SHModalProps) {
  const state = usePresentation(policy);
  if (state.hidden) return null;
  return (
    <AntModalAdapter
      {...props}
      onConfirm={state.disabled || state.readOnly ? undefined : props.onConfirm}
    />
  );
}
export function SHTabs({ policy, items, ...props }: SHTabsProps) {
  const state = usePresentation(policy);
  if (state.hidden) return null;
  return <AntTabsAdapter {...props} items={items} />;
}
export function SHTable<T extends object>({ policy, columns, ...props }: SHTableProps<T>) {
  const state = usePresentation(policy);
  if (state.hidden) return null;
  return <AntTableAdapter<T> {...props} columns={columns} />;
}
