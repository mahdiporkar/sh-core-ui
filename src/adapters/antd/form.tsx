import React from 'react';
import { Checkbox, Form, Input, Select } from 'antd';
import type { Rule } from 'antd/es/form';
import type {
  SHFormFieldDefinition,
  SHFormProps,
  SHFormValidationRule,
  SHFormValue,
  SHFormValues,
} from '../../components/types';
import { useSHPolicy } from '../../policy';
import { SHAntBoundary } from './components';

const toAntRule = (rule: SHFormValidationRule, getValues: () => SHFormValues): Rule => ({
  required: rule.required,
  min: rule.minLength,
  max: rule.maxLength,
  pattern: rule.pattern,
  message: rule.message,
  validator: rule.validate
    ? async (_, value: SHFormValue) => {
        const message = await rule.validate?.(value, getValues());
        if (message) throw new Error(message);
      }
    : undefined,
});

function AntConfiguredField({
  field,
  readOnly,
  getValues,
}: {
  field: SHFormFieldDefinition;
  readOnly: boolean;
  getValues: () => SHFormValues;
}) {
  const policy = useSHPolicy(field.policy);
  const policyHidden = !policy.allowed && policy.behavior === 'hide';
  const policyReadOnly = !policy.allowed && policy.behavior === 'readOnly';
  const policyDisabled =
    !policy.allowed &&
    (policy.behavior === 'disable' ||
      policy.status === 'loading' ||
      policy.status === 'missing' ||
      policy.status === 'expired');
  if (field.hidden || policyHidden) return null;
  const common = {
    disabled: field.disabled || policyDisabled,
    placeholder: field.placeholder,
  };
  let control: React.ReactNode;
  switch (field.kind) {
    case 'multiline':
      control = (
        <Input.TextArea {...common} readOnly={readOnly || field.readOnly || policyReadOnly} />
      );
      break;
    case 'select':
      control = (
        <Select
          {...common}
          disabled={common.disabled || readOnly || field.readOnly || policyReadOnly}
          options={[...(field.options ?? [])]}
        />
      );
      break;
    case 'checkbox':
      control = (
        <Checkbox
          {...common}
          disabled={common.disabled || readOnly || field.readOnly || policyReadOnly}
        />
      );
      break;
    case 'custom':
      control = (
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue, setFieldValue }) =>
            field.render?.(getFieldValue(field.name) as SHFormValue, (value) =>
              setFieldValue(field.name, value),
            )
          }
        </Form.Item>
      );
      break;
    default:
      control = <Input {...common} readOnly={readOnly || field.readOnly || policyReadOnly} />;
  }
  return (
    <Form.Item
      name={field.name}
      label={field.label}
      valuePropName={field.kind === 'checkbox' ? 'checked' : 'value'}
      rules={field.rules?.map((rule) => toAntRule(rule, getValues))}
    >
      {control}
    </Form.Item>
  );
}

export function AntFormAdapter({
  name,
  fields = [],
  children,
  initialValues,
  values,
  layout = 'vertical',
  size = 'md',
  disabled,
  readOnly = false,
  showRequiredMark = true,
  onValuesChange,
  onSubmit,
  onSubmitFailed,
  testId,
  ...rest
}: SHFormProps) {
  const [form] = Form.useForm<SHFormValues>();
  React.useEffect(() => {
    if (values) form.setFieldsValue(values);
  }, [form, values]);
  return (
    <SHAntBoundary>
      <Form<SHFormValues>
        name={name}
        form={form}
        data-testid={testId}
        className={rest.className}
        style={rest.style}
        layout={layout}
        size={size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'middle'}
        disabled={disabled}
        requiredMark={showRequiredMark}
        initialValues={initialValues}
        onValuesChange={(changed: SHFormValues, all: SHFormValues) =>
          onValuesChange?.(changed, all)
        }
        onFinish={(submitted) => void onSubmit?.(submitted)}
        onFinishFailed={({ errorFields }) =>
          onSubmitFailed?.(
            errorFields.map((field) => ({
              name: field.name.map(String).join('.'),
              messages: field.errors,
            })),
          )
        }
      >
        {fields.map((field) => (
          <AntConfiguredField
            key={field.name}
            field={field}
            readOnly={readOnly}
            getValues={() => form.getFieldsValue()}
          />
        ))}
        {children}
      </Form>
    </SHAntBoundary>
  );
}
