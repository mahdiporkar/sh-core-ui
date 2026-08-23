import { useEffect, useMemo } from 'react';
import { notification } from 'antd';
import type { NotificationPlacement } from 'antd/es/notification/interface';
import type {
  SHNotificationApi,
  SHNotificationOptions,
  SHNotificationPlacement,
  SHNotificationProps,
} from '../../components/types';
import { SHNotificationContext } from '../../components/notification-context';
import { registerSHNotificationHost } from '../../components/notification-runtime';
import { useSHCore } from '../../core';
import { SHAntBoundary } from './components';

const placement = (
  value: SHNotificationPlacement,
  direction: 'ltr' | 'rtl',
): NotificationPlacement => {
  const start = direction === 'rtl' ? 'Right' : 'Left';
  const end = direction === 'rtl' ? 'Left' : 'Right';
  if (value === 'topStart') return `top${start}` as NotificationPlacement;
  if (value === 'topEnd') return `top${end}` as NotificationPlacement;
  if (value === 'bottomStart') return `bottom${start}` as NotificationPlacement;
  if (value === 'bottomEnd') return `bottom${end}` as NotificationPlacement;
  return value;
};

function AntNotificationHost({
  children,
  maxVisible = 4,
  defaultPlacement = 'topEnd',
}: SHNotificationProps) {
  const { locale } = useSHCore();
  const [api, holder] = notification.useNotification({ maxCount: maxVisible });
  const value = useMemo<SHNotificationApi>(() => {
    const open = (options: SHNotificationOptions) => {
      api.open({
        key: options.id,
        message: options.title,
        description: options.description,
        type: options.tone,
        duration: options.durationMs === undefined ? undefined : options.durationMs / 1000,
        placement: placement(options.placement ?? defaultPlacement, locale.direction),
        role: options.role,
        btn: options.action,
        closable: options.closable,
        onClick: options.onClick,
        onClose: options.onClose,
      });
    };
    return {
      open,
      success: (options) => open({ ...options, tone: 'success' }),
      info: (options) => open({ ...options, tone: 'info' }),
      warning: (options) => open({ ...options, tone: 'warning' }),
      error: (options) => open({ ...options, tone: 'error' }),
      close: (id) => api.destroy(id),
      closeAll: () => api.destroy(),
    };
  }, [api, defaultPlacement, locale.direction]);
  useEffect(() => registerSHNotificationHost(value), [value]);
  return (
    <SHNotificationContext.Provider value={value}>
      {holder}
      {children}
    </SHNotificationContext.Provider>
  );
}

export function AntNotificationAdapter(props: SHNotificationProps) {
  return (
    <SHAntBoundary>
      <AntNotificationHost {...props} />
    </SHAntBoundary>
  );
}
