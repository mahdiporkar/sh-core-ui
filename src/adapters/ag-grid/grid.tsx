import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type {
  ColDef,
  GridApi,
  GridReadyEvent,
  IServerSideDatasource,
  SelectionChangedEvent,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import type { SHGridProps, SHGridQuery, SHGridRef } from '../../grid/types';
import { useSHCore } from '../../core';

export const AGGridAdapter = forwardRef(function AGGridAdapter<T extends object>(
  {
    columns,
    rows = [],
    dataSource,
    dataMode = 'client',
    rowId,
    pageSize = 50,
    pageSizeOptions = [20, 50, 100],
    selectable,
    emptyContent,
    errorContent,
    loadingContent,
    className,
    onSelectionChange,
    onError,
  }: SHGridProps<T>,
  ref: React.ForwardedRef<SHGridRef>,
) {
  const { locale, t } = useSHCore();
  const apiRef = useRef<GridApi<T> | null>(null);
  const [loadedRows, setLoadedRows] = useState<readonly T[]>(rows);
  const [loading, setLoading] = useState(Boolean(dataSource && dataMode === 'client'));
  const [error, setError] = useState<Error | null>(null);
  const load = () => {
    if (!dataSource || dataMode === 'server') return;
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
  useEffect(() => load(), [dataMode, dataSource, pageSize]);
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
  const serverSideDatasource = useMemo<IServerSideDatasource<T> | undefined>(() => {
    if (!dataSource || dataMode !== 'server') return undefined;
    return {
      getRows: (params) => {
        const controller = new AbortController();
        const request = params.request;
        const filterEntries = Object.entries(request.filterModel ?? {}) as [string, unknown][];
        const query: SHGridQuery = {
          offset: request.startRow ?? 0,
          limit: (request.endRow ?? pageSize) - (request.startRow ?? 0),
          sort: request.sortModel.map((sort) => ({
            columnId: sort.colId,
            direction: sort.sort,
          })),
          filters: filterEntries.map(([columnId, filter]) => {
            const model =
              typeof filter === 'object' && filter !== null
                ? (filter as Record<string, unknown>)
                : undefined;
            return {
              columnId,
              operator: typeof model?.type === 'string' ? model.type : 'equals',
              value: model && 'filter' in model ? model.filter : filter,
            };
          }),
          groups: request.rowGroupCols.map((group) => group.id),
        };
        void dataSource
          .load(query, controller.signal)
          .then((result) => params.success({ rowData: [...result.rows], rowCount: result.total }))
          .catch((reason: unknown) => {
            const next = reason instanceof Error ? reason : new Error(String(reason));
            setError(next);
            onError?.(next);
            params.fail();
          });
      },
    };
  }, [dataMode, dataSource, onError, pageSize]);
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
  if (error) {
    if (errorContent) return <>{errorContent(error, load)}</>;
    return (
      <div className="sh-grid__state" role="alert">
        {error.message}
        <button type="button" onClick={load}>
          {t('common.retry')}
        </button>
      </div>
    );
  }
  if (loading && loadingContent) return <>{loadingContent}</>;
  if (dataMode !== 'server' && !loading && loadedRows.length === 0)
    return (
      <div className="sh-grid__state" role="status">
        {emptyContent ?? t('common.empty')}
      </div>
    );
  return (
    <div
      className={['sh-grid', className].filter(Boolean).join(' ')}
      dir={locale.direction}
      aria-busy={loading}
    >
      <AgGridReact<T>
        rowData={dataMode === 'server' ? undefined : [...loadedRows]}
        rowModelType={dataMode === 'server' ? 'serverSide' : 'clientSide'}
        serverSideDatasource={serverSideDatasource}
        columnDefs={columnDefs}
        defaultColDef={{ flex: 1, minWidth: 110, resizable: true }}
        localeText={{
          loadingOoo: t('common.loading'),
          noRowsToShow: t('common.empty'),
          page: locale.code === 'fa-IR' ? 'صفحه' : locale.code === 'ar' ? 'صفحة' : 'Page',
          to: locale.code === 'fa-IR' ? 'تا' : locale.code === 'ar' ? 'إلى' : 'to',
          of: locale.code === 'fa-IR' ? 'از' : locale.code === 'ar' ? 'من' : 'of',
        }}
        loading={loading}
        pagination
        paginationPageSize={pageSize}
        paginationPageSizeSelector={[...pageSizeOptions]}
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
