import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SHSelect } from '../src/components';
import type { SHSelectOption } from '../src/components';

const options: readonly SHSelectOption[] = [
  { value: 'alpha', label: 'Alpha workspace' },
  { value: 'bravo', label: 'Bravo collection' },
  { value: 'charlie', label: 'Charlie project' },
];

const remoteOptions = Array.from({ length: 18 }, (_, index) => ({
  value: `record-${String(index + 1)}`,
  label: `Remote record ${String(index + 1)}`,
}));

function AsyncSelect() {
  const [error, setError] = useState<string>();
  return (
    <div style={{ maxInlineSize: 480 }}>
      <SHSelect
        label="Search remote records"
        searchable
        clearable
        debounceMs={300}
        loadOptions={async (search, { cursor, signal }) => {
          await new Promise<void>((resolve, reject) => {
            const timer = window.setTimeout(resolve, 500);
            signal.addEventListener('abort', () => {
              window.clearTimeout(timer);
              reject(new DOMException('Aborted', 'AbortError'));
            });
          });
          const offset = Number(cursor ?? 0);
          const matching = remoteOptions.filter((option) =>
            option.label.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
          );
          const page = matching.slice(offset, offset + 6);
          return {
            options: page,
            nextCursor: offset + 6 < matching.length ? String(offset + 6) : undefined,
          };
        }}
        onLoadError={(reason) => setError(reason.message)}
        placeholder="Type to search…"
      />
      {error && <p role="alert">{error}</p>}
    </div>
  );
}

const meta = {
  title: 'Components/SHSelect',
  component: SHSelect,
  tags: ['autodocs'],
  args: {
    label: 'Workspace',
    options,
    placeholder: 'Choose an option',
    policy: { resource: 'demo.resource', action: 'demo.action' },
  },
} satisfies Meta<typeof SHSelect>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Multiple: Story = {
  args: { multiple: true, searchable: true, defaultValue: ['alpha', 'charlie'] },
};
export const AsyncSearchAndLoadMore: Story = { render: () => <AsyncSelect /> };
