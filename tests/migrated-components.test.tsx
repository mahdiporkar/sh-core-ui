import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SHCoreProvider } from '../src/core';
import {
  SHButton,
  SHForm,
  SHNotification,
  SHNotify,
  SHSelect,
  useSHNotification,
} from '../src/components';

const manifest = {
  schemaVersion: '1.0' as const,
  version: '1',
  issuedAt: new Date().toISOString(),
  decisions: [
    {
      resource: 'secret',
      action: 'edit',
      allowed: false,
      ui: { deniedBehavior: 'hide' as const },
    },
  ],
};

test('renders vendor-neutral select options', () => {
  render(
    <SHCoreProvider>
      <SHSelect
        label="Workspace"
        options={[
          { value: 'alpha', label: 'Alpha' },
          { value: 'bravo', label: 'Bravo' },
        ]}
      />
    </SHCoreProvider>,
  );
  fireEvent.mouseDown(screen.getByRole('combobox'));
  expect(screen.getByText('Bravo')).toBeInTheDocument();
});

test('submits configured form values and applies field policies', async () => {
  const onSubmit = jest.fn();
  render(
    <SHCoreProvider manifest={manifest}>
      <SHForm
        name="profile"
        fields={[
          { name: 'title', label: 'Title', kind: 'input', placeholder: 'Enter title' },
          {
            name: 'secret',
            label: 'Secret',
            kind: 'input',
            policy: { resource: 'secret', action: 'edit' },
          },
        ]}
        onSubmit={onSubmit}
      >
        <SHButton htmlType="submit">Save</SHButton>
      </SHForm>
    </SHCoreProvider>,
  );
  expect(screen.queryByLabelText('Secret')).not.toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Enter title'), { target: { value: 'Contract' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ title: 'Contract' }));
});

function NotificationTrigger() {
  const notification = useSHNotification();
  return (
    <SHButton onClick={() => notification.success({ title: 'Saved successfully' })}>
      Notify
    </SHButton>
  );
}

test('exposes context-aware notifications', async () => {
  render(
    <SHCoreProvider>
      <SHNotification>
        <NotificationTrigger />
      </SHNotification>
    </SHCoreProvider>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Notify' }));
  expect(await screen.findByText('Saved successfully')).toBeInTheDocument();
});

test('allows service-layer notifications through the mounted host', async () => {
  render(
    <SHCoreProvider>
      <SHNotification>
        <span>Application</span>
      </SHNotification>
    </SHCoreProvider>,
  );
  SHNotify.error({ title: 'Request failed', role: 'alert' });
  expect(await screen.findByText('Request failed')).toBeInTheDocument();
});
