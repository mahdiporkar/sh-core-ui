import type { ReactNode } from 'react';
import type { SHPolicyBinding } from '../core';

export type SHGridValue<T> = keyof T | ((row: T) => unknown);
export interface SHGridColumn<T> {
  id: string;
  header: string;
  value: SHGridValue<T>;
  width?: number;
  minWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  editable?: boolean;
  hidden?: boolean;
  pinned?: 'start' | 'end';
  groupable?: boolean;
  aggregate?: 'sum' | 'avg' | 'min' | 'max';
  policy?: SHPolicyBinding;
}
export interface SHGridSort {
  columnId: string;
  direction: 'asc' | 'desc';
}
export interface SHGridFilter {
  columnId: string;
  operator: string;
  value: unknown;
}
export interface SHGridQuery {
  offset: number;
  limit: number;
  sort: readonly SHGridSort[];
  filters: readonly SHGridFilter[];
  groups?: readonly string[];
}
export interface SHGridResult<T> {
  rows: readonly T[];
  total: number;
  partial?: boolean;
}
export interface SHGridDataSource<T> {
  load(query: SHGridQuery, signal: AbortSignal): Promise<SHGridResult<T>>;
}
export interface SHGridAction<T> {
  id: string;
  label: ReactNode;
  policy?: SHPolicyBinding;
  disabled?: (row: T) => boolean;
  run(row: T): void | Promise<void>;
}
export interface SHGridExportOptions {
  format: 'csv' | 'excel';
  fileName?: string;
  selectedOnly?: boolean;
}
export interface SHGridPersistenceState {
  columns: readonly { id: string; width?: number; hidden?: boolean; order: number }[];
  filters: readonly SHGridFilter[];
  sort: readonly SHGridSort[];
}
export interface SHGridPersistenceAdapter {
  load(key: string): SHGridPersistenceState | null | Promise<SHGridPersistenceState | null>;
  save(key: string, state: SHGridPersistenceState): void | Promise<void>;
}
export interface SHGridRef {
  refresh(): void;
  clearSelection(): void;
  getSelectedRowIds(): readonly string[];
  export(options: SHGridExportOptions): void;
}
export interface SHGridProps<T extends object> {
  columns: readonly SHGridColumn<T>[];
  rows?: readonly T[];
  dataSource?: SHGridDataSource<T>;
  dataMode?: 'client' | 'server';
  rowId: keyof T | ((row: T) => string);
  actions?: readonly SHGridAction<T>[];
  policy?: SHPolicyBinding;
  pageSize?: number;
  pageSizeOptions?: readonly number[];
  selectable?: boolean;
  emptyContent?: ReactNode;
  errorContent?: (error: Error, retry: () => void) => ReactNode;
  loadingContent?: ReactNode;
  persistence?: { key: string; adapter: SHGridPersistenceAdapter };
  className?: string;
  onSelectionChange?: (rows: readonly T[]) => void;
  onError?: (error: Error) => void;
}
export type SHGridEnterpriseFeature = 'serverSideRows' | 'excelExport' | 'rowGrouping';
export interface SHGridProviderProps {
  children: ReactNode;
  enterpriseFeatures?: readonly SHGridEnterpriseFeature[];
  licenseKey?: string;
}
