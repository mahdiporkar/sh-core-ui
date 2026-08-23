import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { ColDef, GridApi, GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import type { SHGridProps, SHGridQuery, SHGridRef } from '../../grid/types';
import { useSHCore } from '../../core';

export const AGGridAdapter = forwardRef(function AGGridAdapter<T extends object>(
  {
    columns,
    rows = [],
    dataSource,
    rowId,
    pageSize = 50,
    selectable,
    className,
    onSelectionChange,
    onError,
  }: SHGridProps<T>,
  ref: React.ForwardedRef<SHGridRef>,
) {
  const { locale } = useSHCore();
  const apiRef = useRef<GridApi<T> | null>(null);
  const [loadedRows, setLoadedRows] = useState<readonly T[]>(rows);
  const [loading, setLoading] = useState(Boolean(dataSource));
  const [error, setError] = useState<Error | null>(null);
  const load = () => {
    if (!dataSource) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    const query: SHGridQuery = { offset: 0, limit: pageSize, sort: [], filters: [] };
    void dataSource
      .load(query, controller.signal)
      .then((result) => setLoadedRows(result.rows))
      .catch((reason: unknown) => {
        const next = reason instanceof Error ? reason : new Error(String(reason));
        setError(next);
        onError?.(next);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  };
  useEffect(() => load(), [dataSource, pageSize]);
  useEffect(() => {
    if (!dataSource) setLoadedRows(rows);
  }, [dataSource, rows]);
  const columnDefs = useMemo<ColDef<T>[]>(
    () =>
      columns
        .filter((column) => !column.hidden)
        .map((column) => {
          const value = column.value;
          return {
            colId: column.id,
            headerName: column.header,
            field: typeof value === 'string' ? (value as unknown as ColDef<T>['field']) : undefined,
            valueGetter:
              typeof value === 'function'
                ? ({ data }) => (data ? value(data) : undefined)
                : undefined,
            width: column.width,
            minWidth: column.minWidth,
            sortable: column.sortable,
            filter: column.filterable,
            editable: column.editable,
            pinned:
              column.pinned === 'start'
                ? locale.direction === 'rtl'
                  ? 'right'
                  : 'left'
                : column.pinned === 'end'
                  ? locale.direction === 'rtl'
                    ? 'left'
                    : 'right'
                  : undefined,
            enableRowGroup: column.groupable,
            aggFunc: column.aggregate,
          };
        }),
    [columns, locale.direction],
  );
  useImperativeHandle(
    ref,
    () => ({
      refresh: () => {
        load();
        apiRef.current?.refreshCells();
      },
      clearSelection: () => apiRef.current?.deselectAll(),
      getSelectedRowIds: () =>
        (apiRef.current?.getSelectedRows() ?? []).map((row) =>
          typeof rowId === 'function' ? rowId(row) : String(row[rowId]),
        ),
      export: (options) => {
        if (options.format === 'csv')
          apiRef.current?.exportDataAsCsv({
            fileName: options.fileName,
            onlySelected: options.selectedOnly,
          });
        else
          apiRef.current?.exportDataAsExcel({
            fileName: options.fileName,
            onlySelected: options.selectedOnly,
          });
      },
    }),
    [rowId],
  );
  const onGridReady = (event: GridReadyEvent<T>) => {
    apiRef.current = event.api;
  };
  const onSelectionChanged = (event: SelectionChangedEvent<T>) =>
    onSelectionChange?.(event.api.getSelectedRows());
  if (error)
    return (
      <div className="sh-grid__state" role="alert">
        {error.message}
        <button type="button" onClick={load}>
          Retry
        </button>
      </div>
    );
  return (
    <div
      className={['sh-grid', className].filter(Boolean).join(' ')}
      dir={locale.direction}
      aria-busy={loading}
    >
      <AgGridReact<T>
        rowData={[...loadedRows]}
        columnDefs={columnDefs}
        loading={loading}
        pagination
        paginationPageSize={pageSize}
        rowSelection={selectable ? { mode: 'multiRow' } : undefined}
        getRowId={({ data }) => (typeof rowId === 'function' ? rowId(data) : String(data[rowId]))}
        enableRtl={locale.direction === 'rtl'}
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChanged}
      />
    </div>
  );
}) as <T extends object>(
  props: SHGridProps<T> & { ref?: React.ForwardedRef<SHGridRef> },
) => React.ReactElement;
