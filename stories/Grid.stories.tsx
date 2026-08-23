import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SHGrid, SHGridProvider } from '../src/grid';
import type { SHGridColumn, SHGridDataSource } from '../src/grid';
import { useSHCore } from '../src/core';

interface DemoRecord {
  id: string;
  title: string;
  category: string;
  status: 'Active' | 'Pending' | 'Archived';
  score: number;
  updatedAt: string;
}

const rows: readonly DemoRecord[] = [
  {
    id: 'R-1042',
    title: 'Northwind workspace',
    category: 'Workspace',
    status: 'Active',
    score: 94,
    updatedAt: '2026-08-21T09:30:00Z',
  },
  {
    id: 'R-1043',
    title: 'Atlas collection',
    category: 'Collection',
    status: 'Pending',
    score: 78,
    updatedAt: '2026-08-22T12:15:00Z',
  },
  {
    id: 'R-1044',
    title: 'Beacon project',
    category: 'Project',
    status: 'Active',
    score: 88,
    updatedAt: '2026-08-23T07:45:00Z',
  },
  {
    id: 'R-1045',
    title: 'Cedar archive',
    category: 'Archive',
    status: 'Archived',
    score: 61,
    updatedAt: '2026-08-23T15:20:00Z',
  },
  {
    id: 'R-1046',
    title: 'Delta workspace',
    category: 'Workspace',
    status: 'Active',
    score: 97,
    updatedAt: '2026-08-24T06:05:00Z',
  },
  {
    id: 'R-1047',
    title: 'Ember project',
    category: 'Project',
    status: 'Pending',
    score: 83,
    updatedAt: '2026-08-24T11:40:00Z',
  },
];

function GridDemo({
  data = rows,
  remote = false,
}: {
  data?: readonly DemoRecord[];
  remote?: boolean;
}) {
  const { locale } = useSHCore();
  const [selected, setSelected] = useState<readonly DemoRecord[]>([]);
  const columns = useMemo<readonly SHGridColumn<DemoRecord>[]>(
    () => [
      {
        id: 'id',
        header: 'ID',
        value: 'id',
        width: 120,
        pinned: 'start',
        sortable: true,
        filterable: true,
      },
      {
        id: 'title',
        header: 'Title',
        value: 'title',
        minWidth: 220,
        sortable: true,
        filterable: true,
      },
      {
        id: 'category',
        header: 'Category',
        value: 'category',
        minWidth: 150,
        sortable: true,
        filterable: true,
      },
      {
        id: 'status',
        header: 'Status',
        value: 'status',
        minWidth: 140,
        sortable: true,
        filterable: true,
      },
      {
        id: 'score',
        header: 'Score',
        value: 'score',
        width: 120,
        sortable: true,
        filterable: true,
      },
      {
        id: 'updatedAt',
        header: 'Updated',
        value: (row) =>
          new Intl.DateTimeFormat(locale.code, { dateStyle: 'medium' }).format(
            new Date(row.updatedAt),
          ),
        minWidth: 180,
        sortable: true,
      },
    ],
    [locale.code],
  );
  const dataSource = useMemo<SHGridDataSource<DemoRecord> | undefined>(
    () =>
      remote
        ? {
            load: async (_query, signal) => {
              await new Promise<void>((resolve, reject) => {
                const timer = window.setTimeout(resolve, 700);
                signal.addEventListener('abort', () => {
                  window.clearTimeout(timer);
                  reject(new DOMException('Aborted', 'AbortError'));
                });
              });
              return { rows: data, total: data.length };
            },
          }
        : undefined,
    [data, remote],
  );
  return (
    <SHGridProvider>
      <p aria-live="polite">
        <strong>{selected.length}</strong> selected · switch locale, direction, density, and theme
        from the toolbar.
      </p>
      <SHGrid<DemoRecord>
        columns={columns}
        rows={remote ? undefined : data}
        dataSource={dataSource}
        rowId="id"
        pageSize={4}
        selectable
        onSelectionChange={setSelected}
        emptyContent="No records match this view."
      />
    </SHGridProvider>
  );
}

function ErrorGrid() {
  const dataSource = useMemo<SHGridDataSource<DemoRecord>>(
    () => ({
      load: () => Promise.reject(new Error('The demonstration data source is unavailable.')),
    }),
    [],
  );
  return (
    <SHGridProvider>
      <SHGrid<DemoRecord>
        columns={[{ id: 'title', header: 'Title', value: 'title' }]}
        dataSource={dataSource}
        rowId="id"
        errorContent={(error, retry) => (
          <div className="sh-grid__state" role="alert">
            <strong>{error.message}</strong>
            <button type="button" onClick={retry}>
              Try again
            </button>
          </div>
        )}
      />
    </SHGridProvider>
  );
}

const meta = { title: 'Grid/SHGrid', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const ClientSide: Story = { render: () => <GridDemo /> };
export const ServerDataSource: Story = { render: () => <GridDemo remote /> };
export const Empty: Story = { render: () => <GridDemo data={[]} /> };
export const ErrorAndRetry: Story = { render: () => <ErrorGrid /> };
