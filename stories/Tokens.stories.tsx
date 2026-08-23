import type { Meta, StoryObj } from '@storybook/react';
import { useSHCore } from '../src/core';
function TokenReference() {
  const { theme } = useSHCore();
  return (
    <div>
      {(Object.entries(theme.semantic) as [string, string][]).map(([name, value]) => (
        <div key={name} style={{ display: 'flex', gap: 12, padding: 8 }}>
          <span style={{ inlineSize: 120, background: value, border: '1px solid currentColor' }} />
          <code>
            {name}: {value}
          </code>
        </div>
      ))}
    </div>
  );
}
export default { title: 'Foundations/Design Tokens', component: TokenReference } satisfies Meta<
  typeof TokenReference
>;
export const Semantic: StoryObj<typeof TokenReference> = {};
