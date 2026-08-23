import type { CSSProperties, ChangeEvent, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import type { SHPolicyBinding } from '../core';

export interface SHBaseProps {
  id?: string;
  className?: string;
  style?: CSSProperties;
  testId?: string;
  policy?: SHPolicyBinding;
}
export interface SHButtonProps extends SHBaseProps {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'text' | 'link';
  tone?: 'neutral' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  htmlType?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
  ariaLabel?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}
export interface SHInputRef {
  focus(): void;
  blur(): void;
  select(): void;
  input: HTMLInputElement | null;
}
export interface SHInputProps extends SHBaseProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  label?: string;
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  errorMessage?: string;
  multiline?: boolean;
  rows?: number;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
}
export interface SHSelectOption {
  value: string | number;
  label: ReactNode;
  disabled?: boolean;
}
export interface SHSelectLoadContext {
  cursor?: string;
  signal: AbortSignal;
}
export interface SHSelectLoadResult {
  options: readonly SHSelectOption[];
  nextCursor?: string;
}
export interface SHSelectProps extends SHBaseProps {
  value?: string | number | readonly (string | number)[];
  defaultValue?: string | number | readonly (string | number)[];
  options?: readonly SHSelectOption[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  loading?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  debounceMs?: number;
  loadOptions?: (search: string, context: SHSelectLoadContext) => Promise<SHSelectLoadResult>;
  onSearch?: (search: string) => void;
  onLoadError?: (error: Error) => void;
  onChange?: (value: string | number | readonly (string | number)[] | undefined) => void;
}

export type SHFormValue = string | number | boolean | readonly (string | number)[] | undefined;
export type SHFormValues = Record<string, SHFormValue>;
export interface SHFormValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message?: string;
  validate?: (
    value: SHFormValue,
    values: SHFormValues,
  ) => string | undefined | Promise<string | undefined>;
}
export interface SHFormFieldDefinition {
  name: string;
  label: ReactNode;
  kind: 'input' | 'multiline' | 'select' | 'checkbox' | 'custom';
  placeholder?: string;
  options?: readonly SHSelectOption[];
  rules?: readonly SHFormValidationRule[];
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  policy?: SHPolicyBinding;
  render?: (value: SHFormValue, setValue: (value: SHFormValue) => void) => ReactNode;
}
export interface SHFormProps extends SHBaseProps {
  name: string;
  fields?: readonly SHFormFieldDefinition[];
  children?: ReactNode;
  initialValues?: SHFormValues;
  values?: SHFormValues;
  layout?: 'vertical' | 'horizontal' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  readOnly?: boolean;
  showRequiredMark?: boolean;
  onValuesChange?: (changed: SHFormValues, values: SHFormValues) => void;
  onSubmit?: (values: SHFormValues) => void | Promise<void>;
  onSubmitFailed?: (errors: readonly { name: string; messages: readonly string[] }[]) => void;
}

export type SHNotificationTone = 'success' | 'info' | 'warning' | 'error';
export type SHNotificationPlacement =
  'top' | 'topStart' | 'topEnd' | 'bottom' | 'bottomStart' | 'bottomEnd';
export interface SHNotificationOptions {
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: SHNotificationTone;
  durationMs?: number;
  placement?: SHNotificationPlacement;
  role?: 'alert' | 'status';
  action?: ReactNode;
  closable?: boolean;
  onClick?: () => void;
  onClose?: () => void;
}
export interface SHNotificationApi {
  open(options: SHNotificationOptions): void;
  success(options: Omit<SHNotificationOptions, 'tone'>): void;
  info(options: Omit<SHNotificationOptions, 'tone'>): void;
  warning(options: Omit<SHNotificationOptions, 'tone'>): void;
  error(options: Omit<SHNotificationOptions, 'tone'>): void;
  close(id: string): void;
  closeAll(): void;
}
export interface SHNotificationProps {
  children: ReactNode;
  maxVisible?: number;
  defaultPlacement?: SHNotificationPlacement;
}
export interface SHCheckboxProps extends SHBaseProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  children?: ReactNode;
  onChange?: (checked: boolean) => void;
}
export interface SHSwitchProps extends SHBaseProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
}
export interface SHAlertProps extends SHBaseProps {
  title: ReactNode;
  description?: ReactNode;
  severity?: 'info' | 'success' | 'warning' | 'error';
  closable?: boolean;
  onClose?: () => void;
}
export interface SHCardProps extends SHBaseProps {
  title?: ReactNode;
  extra?: ReactNode;
  children?: ReactNode;
  loading?: boolean;
}
export interface SHModalProps extends SHBaseProps {
  open: boolean;
  title?: ReactNode;
  children?: ReactNode;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  confirmLoading?: boolean;
  destructive?: boolean;
  onConfirm?: () => void;
  onCancel: () => void;
}
export interface SHTabItem {
  key: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
  policy?: SHPolicyBinding;
}
export interface SHTabsProps extends SHBaseProps {
  items: readonly SHTabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
}
export interface SHTableColumn<T> {
  id: string;
  header: ReactNode;
  value: keyof T | ((row: T) => ReactNode);
  width?: number;
  align?: 'start' | 'center' | 'end';
  policy?: SHPolicyBinding;
}
export interface SHTableProps<T extends object> extends SHBaseProps {
  rows: readonly T[];
  columns: readonly SHTableColumn<T>[];
  rowKey: keyof T | ((row: T) => string);
  loading?: boolean;
  emptyContent?: ReactNode;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
}
