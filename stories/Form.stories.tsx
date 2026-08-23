import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SHButton, SHForm } from '../src/components';
import type { SHFormFieldDefinition, SHFormValues } from '../src/components';

const fields: readonly SHFormFieldDefinition[] = [
  {
    name: 'title',
    label: 'Title',
    kind: 'input',
    placeholder: 'Enter a descriptive title',
    rules: [{ required: true, minLength: 3, message: 'Enter at least three characters.' }],
  },
  { name: 'description', label: 'Description', kind: 'multiline', placeholder: 'Optional context' },
  {
    name: 'category',
    label: 'Category',
    kind: 'select',
    options: [
      { value: 'workspace', label: 'Workspace' },
      { value: 'collection', label: 'Collection' },
      { value: 'project', label: 'Project' },
    ],
    rules: [{ required: true, message: 'Select a category.' }],
  },
  { name: 'enabled', label: 'Enabled', kind: 'checkbox' },
];

function FormDemo() {
  const [submitted, setSubmitted] = useState<SHFormValues>();
  return (
    <div style={{ maxInlineSize: 680 }}>
      <SHForm
        name="storybook-form"
        fields={fields}
        initialValues={{ enabled: true }}
        onSubmit={setSubmitted}
      >
        <SHButton htmlType="submit" variant="primary">
          Save
        </SHButton>
      </SHForm>
      {submitted && <pre aria-live="polite">{JSON.stringify(submitted, null, 2)}</pre>}
    </div>
  );
}

const meta = {
  title: 'Components/SHForm',
  component: SHForm,
  tags: ['autodocs'],
  args: { name: 'documented-form' },
} satisfies Meta<typeof SHForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ConfigDriven: Story = { render: () => <FormDemo /> };
export const ReadOnly: Story = {
  args: {
    name: 'read-only-form',
    fields,
    initialValues: { title: 'Stable contract', category: 'workspace', enabled: true },
    readOnly: true,
  },
};
export const Disabled: Story = {
  args: {
    name: 'disabled-form',
    fields,
    initialValues: { title: 'Disabled form', category: 'project' },
    disabled: true,
  },
};
