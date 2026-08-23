import type { Meta, StoryObj } from '@storybook/react';
import { SHButton, SHNotification, SHNotify, useSHNotification } from '../src/components';

function simulateServiceFailure() {
  SHNotify.error({
    title: 'Service request failed',
    description: 'This notification was triggered outside the React component tree.',
    role: 'alert',
  });
}

function NotificationActions() {
  const notify = useSHNotification();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <SHButton
        onClick={() =>
          notify.success({
            title: 'Changes saved',
            description: 'The operation completed successfully.',
          })
        }
      >
        Success
      </SHButton>
      <SHButton
        onClick={() =>
          notify.info({ title: 'Background update', description: 'New information is available.' })
        }
      >
        Information
      </SHButton>
      <SHButton
        onClick={() =>
          notify.warning({
            title: 'Review required',
            description: 'Check the current configuration before continuing.',
          })
        }
      >
        Warning
      </SHButton>
      <SHButton
        tone="danger"
        onClick={() =>
          notify.error({
            title: 'Operation failed',
            description: 'Try again or contact support.',
            role: 'alert',
          })
        }
      >
        Error
      </SHButton>
      <SHButton tone="danger" onClick={simulateServiceFailure}>
        Global service error
      </SHButton>
    </div>
  );
}
function NotificationDemo() {
  return (
    <SHNotification defaultPlacement="topEnd">
      <NotificationActions />
    </SHNotification>
  );
}
const meta = {
  title: 'Components/SHNotification',
  component: NotificationDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof NotificationDemo>;
export default meta;
export const ContextAware: StoryObj<typeof meta> = {};
