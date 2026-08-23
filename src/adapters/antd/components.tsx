import React, { forwardRef } from 'react';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  ConfigProvider,
  Divider,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Tabs,
} from 'antd';
import type { InputRef } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type {
  SHAlertProps,
  SHButtonProps,
  SHCardProps,
  SHCheckboxProps,
  SHInputProps,
  SHInputRef,
  SHModalProps,
  SHSelectOption,
  SHSelectProps,
  SHSwitchProps,
  SHTableProps,
  SHTabsProps,
} from '../../components/types';
import { useSHCore } from '../../core';
import { toAntTheme } from './theme';

export function SHAntBoundary({ children }: { children: React.ReactNode }) {
  const { theme, locale } = useSHCore();
  return (
    <ConfigProvider direction={locale.direction} theme={toAntTheme(theme)}>
      {children}
    </ConfigProvider>
  );
}
export const AntButtonAdapter = forwardRef<HTMLButtonElement, SHButtonProps>(
  function AntButtonAdapter(props, ref) {
    const {
      variant = 'secondary',
      tone = 'neutral',
      size = 'md',
      testId,
      ariaLabel,
      ...rest
    } = props;
    return (
      <SHAntBoundary>
        <Button
          ref={ref}
          type={
            variant === 'primary'
              ? 'primary'
              : variant === 'text'
                ? 'text'
                : variant === 'link'
                  ? 'link'
                  : 'default'
          }
          danger={tone === 'danger'}
          size={size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'middle'}
          data-testid={testId}
          aria-label={ariaLabel}
          {...rest}
        />
      </SHAntBoundary>
    );
  },
);
export const AntInputAdapter = forwardRef<SHInputRef, SHInputProps>(function AntInputAdapter(
  { multiline, rows, onChange, label, invalid, errorMessage, testId, ...props },
  ref,
) {
  const internalRef = React.useRef<InputRef>(null);
  React.useImperativeHandle(ref, () => ({
    focus: () => internalRef.current?.focus(),
    blur: () => internalRef.current?.blur(),
    select: () => internalRef.current?.select(),
    input: internalRef.current?.input ?? null,
  }));
  const input = multiline ? (
    <Input.TextArea
      rows={rows}
      status={invalid ? 'error' : undefined}
      data-testid={testId}
      {...props}
      onChange={(event) => onChange?.(event.target.value, event)}
    />
  ) : (
    <Input
      ref={internalRef}
      status={invalid ? 'error' : undefined}
      data-testid={testId}
      {...props}
      onChange={(event) => onChange?.(event.target.value, event)}
    />
  );
  return (
    <SHAntBoundary>
      <label>
        {label && <span>{label}</span>}
        {input}
        {errorMessage && <span role="alert">{errorMessage}</span>}
      </label>
    </SHAntBoundary>
  );
});
export function AntSelectAdapter({
  options = [],
  label,
  testId,
  loadOptions,
  debounceMs = 400,
  onSearch,
  onLoadError,
  multiple,
  searchable,
  clearable,
  readOnly,
  onChange,
  ...props
}: SHSelectProps) {
  const { t } = useSHCore();
  const [remoteOptions, setRemoteOptions] = React.useState<readonly SHSelectOption[]>(options);
  const [loading, setLoading] = React.useState(false);
  const [nextCursor, setNextCursor] = React.useState<string>();
  const searchRef = React.useRef('');
  const requestRef = React.useRef<AbortController | undefined>(undefined);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  React.useEffect(() => {
    if (!loadOptions) setRemoteOptions(options);
  }, [loadOptions, options]);
  React.useEffect(
    () => () => {
      requestRef.current?.abort();
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );
  const fetchRemote = React.useCallback(
    async (search: string, cursor?: string, append = false) => {
      if (!loadOptions) return;
      requestRef.current?.abort();
      const controller = new AbortController();
      requestRef.current = controller;
      setLoading(true);
      try {
        const result = await loadOptions(search, { cursor, signal: controller.signal });
        if (controller.signal.aborted) return;
        setRemoteOptions((current) => (append ? [...current, ...result.options] : result.options));
        setNextCursor(result.nextCursor);
      } catch (reason: unknown) {
        if (controller.signal.aborted) return;
        onLoadError?.(reason instanceof Error ? reason : new Error(t('common.loadError')));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [loadOptions, onLoadError, t],
  );
  const handleSearch = (search: string) => {
    searchRef.current = search;
    onSearch?.(search);
    if (!loadOptions) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => void fetchRemote(search), debounceMs);
  };
  return (
    <SHAntBoundary>
      <label>
        {label && <span>{label}</span>}
        <Select
          data-testid={testId}
          options={[...remoteOptions]}
          {...props}
          value={props.value}
          defaultValue={props.defaultValue}
          mode={multiple ? 'multiple' : undefined}
          showSearch={searchable || Boolean(loadOptions)}
          filterOption={loadOptions ? false : undefined}
          onSearch={searchable || loadOptions ? handleSearch : undefined}
          onChange={(value) => onChange?.(value)}
          loading={props.loading || loading}
          disabled={props.disabled || readOnly}
          allowClear={clearable}
          notFoundContent={loading ? <Spin size="small" /> : undefined}
          popupRender={(menu) => (
            <>
              {menu}
              {loadOptions && nextCursor && (
                <>
                  <Divider style={{ margin: '0.5rem 0' }} />
                  <Space style={{ paddingInline: '0.5rem', paddingBlockEnd: '0.25rem' }}>
                    <Button
                      type="text"
                      loading={loading}
                      onClick={() => void fetchRemote(searchRef.current, nextCursor, true)}
                    >
                      {t('common.loadMore')}
                    </Button>
                  </Space>
                </>
              )}
            </>
          )}
        />
      </label>
    </SHAntBoundary>
  );
}
export function AntCheckboxAdapter({ onChange, readOnly, testId, ...props }: SHCheckboxProps) {
  return (
    <SHAntBoundary>
      <Checkbox
        data-testid={testId}
        {...props}
        disabled={props.disabled || readOnly}
        onChange={(event) => onChange?.(event.target.checked)}
      />
    </SHAntBoundary>
  );
}
export function AntSwitchAdapter({ label, onChange, readOnly, testId, ...props }: SHSwitchProps) {
  return (
    <SHAntBoundary>
      <Switch
        aria-label={label}
        data-testid={testId}
        {...props}
        disabled={props.disabled || readOnly}
        onChange={onChange}
      />
    </SHAntBoundary>
  );
}
export function AntAlertAdapter({ severity = 'info', testId, ...props }: SHAlertProps) {
  return (
    <SHAntBoundary>
      <Alert
        data-testid={testId}
        message={props.title}
        description={props.description}
        type={severity}
        closable={props.closable}
        onClose={props.onClose}
      />
    </SHAntBoundary>
  );
}
export function AntCardAdapter({ testId, ...props }: SHCardProps) {
  return (
    <SHAntBoundary>
      <Card data-testid={testId} {...props} />
    </SHAntBoundary>
  );
}
export function AntModalAdapter({
  confirmLabel,
  cancelLabel,
  destructive,
  onConfirm,
  testId,
  ...props
}: SHModalProps) {
  return (
    <SHAntBoundary>
      <Modal
        data-testid={testId}
        {...props}
        okText={confirmLabel}
        cancelText={cancelLabel}
        okButtonProps={{ danger: destructive }}
        onOk={onConfirm}
      />
    </SHAntBoundary>
  );
}
export function AntTabsAdapter({ items, testId, ...props }: SHTabsProps) {
  return (
    <SHAntBoundary>
      <Tabs
        data-testid={testId}
        {...props}
        items={items.map((item) => ({
          key: item.key,
          label: item.label,
          children: item.content,
          disabled: item.disabled,
        }))}
      />
    </SHAntBoundary>
  );
}
export function AntTableAdapter<T extends object>({
  rows,
  columns,
  rowKey,
  pagination,
  emptyContent,
  testId,
  ...props
}: SHTableProps<T>) {
  const antColumns: ColumnsType<T> = columns.map((column) => ({
    key: column.id,
    title: column.header,
    width: column.width,
    align: column.align === 'start' ? 'left' : column.align === 'end' ? 'right' : column.align,
    render: (_, row) =>
      typeof column.value === 'function' ? column.value(row) : String(row[column.value] ?? ''),
  }));
  return (
    <SHAntBoundary>
      <Table<T>
        data-testid={testId}
        {...props}
        dataSource={[...rows]}
        columns={antColumns}
        rowKey={typeof rowKey === 'function' ? rowKey : (row) => String(row[rowKey])}
        locale={{ emptyText: emptyContent }}
        pagination={
          pagination
            ? {
                current: pagination.page,
                pageSize: pagination.pageSize,
                total: pagination.total,
                onChange: pagination.onChange,
              }
            : false
        }
      />
    </SHAntBoundary>
  );
}
