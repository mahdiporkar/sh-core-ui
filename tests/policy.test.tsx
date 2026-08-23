import { render, screen } from '@testing-library/react';
import { SHCoreProvider } from '../src/core';
import { SHButton, SHInput } from '../src/components';
const manifest = (
  allowed: boolean,
  deniedBehavior: 'hide' | 'disable' | 'readOnly' = 'disable',
) => ({
  schemaVersion: '1.0' as const,
  version: '1',
  issuedAt: new Date().toISOString(),
  decisions: [{ resource: 'thing', action: 'use', allowed, ui: { deniedBehavior } }],
});
describe('policy-aware components', () => {
  test('allows and disables actions', () => {
    const { rerender } = render(
      <SHCoreProvider manifest={manifest(true)}>
        <SHButton policy={{ resource: 'thing', action: 'use' }}>Use</SHButton>
      </SHCoreProvider>,
    );
    expect(screen.getByRole('button')).toBeEnabled();
    rerender(
      <SHCoreProvider manifest={manifest(false)}>
        <SHButton policy={{ resource: 'thing', action: 'use' }}>Use</SHButton>
      </SHCoreProvider>,
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });
  test('hides denied content', () => {
    render(
      <SHCoreProvider manifest={manifest(false, 'hide')}>
        <SHButton policy={{ resource: 'thing', action: 'use' }}>Hidden</SHButton>
      </SHCoreProvider>,
    );
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });
  test('makes fields read-only', () => {
    render(
      <SHCoreProvider manifest={manifest(false, 'readOnly')}>
        <SHInput label="Value" policy={{ resource: 'thing', action: 'use' }} />
      </SHCoreProvider>,
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
  });
  test('missing decisions fail closed', () => {
    render(
      <SHCoreProvider manifest={manifest(true)}>
        <SHButton policy={{ resource: 'other', action: 'use' }}>Use</SHButton>
      </SHCoreProvider>,
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });
  test('selects the most specific matching contextual decision', () => {
    const contextualManifest = {
      ...manifest(false),
      context: { tenant: 'north' },
      decisions: [
        { resource: 'thing', action: 'use', allowed: false },
        {
          resource: 'thing',
          action: 'use',
          allowed: true,
          when: { tenant: 'north', channel: 'operations' },
        },
      ],
    };
    render(
      <SHCoreProvider manifest={contextualManifest}>
        <SHButton policy={{ resource: 'thing', action: 'use', context: { channel: 'operations' } }}>
          Contextual action
        </SHButton>
      </SHCoreProvider>,
    );
    expect(screen.getByRole('button')).toBeEnabled();
  });
});
