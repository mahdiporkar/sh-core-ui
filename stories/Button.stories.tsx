import type { Meta, StoryObj } from '@storybook/react';
import { SHButton } from '../src/components';
const meta = {
  title: 'Components/SHButton',
  component: SHButton,
  tags: ['autodocs'],
  args: {
    children: 'Action',
    variant: 'primary',
    policy: { resource: 'demo.resource', action: 'demo.action' },
  },
} satisfies Meta<typeof SHButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const PolicyAware: Story = {};
export const Destructive: Story = { args: { tone: 'danger', children: 'Remove' } };
export const Loading: Story = { args: { loading: true } };
export const Disabled: Story = { args: { disabled: true } };
