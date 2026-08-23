import type { Meta, StoryObj } from '@storybook/react';
import { SHInput } from '../src/components';
const meta = {
  title: 'Components/SHInput',
  component: SHInput,
  tags: ['autodocs'],
  args: {
    label: 'Label',
    placeholder: 'Value',
    policy: { resource: 'demo.resource', action: 'demo.action' },
  },
} satisfies Meta<typeof SHInput>;
export default meta;
export const PolicyAware: StoryObj<typeof meta> = {};
export const Error: StoryObj<typeof meta> = {
  args: { invalid: true, errorMessage: 'Invalid value' },
};
