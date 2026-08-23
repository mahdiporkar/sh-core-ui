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
  value: string;
  label: ReactNode;
  disabled?: boolean;
}
export interface SHSelectProps extends SHBaseProps {
  value?: string;
  defaultValue?: string;
  options: readonly SHSelectOption[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  loading?: boolean;
  clearable?: boolean;
  onChange?: (value: string | undefined) => void;
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
