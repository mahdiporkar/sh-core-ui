import type { SHNotificationApi, SHNotificationOptions } from './types';

type NotificationCommand = (api: SHNotificationApi) => void;

const hosts: SHNotificationApi[] = [];
const pending: NotificationCommand[] = [];
const MAX_PENDING = 50;

function dispatch(command: NotificationCommand): void {
  const host = hosts.at(-1);
  if (host) {
    command(host);
    return;
  }
  pending.push(command);
  if (pending.length > MAX_PENDING) pending.shift();
}

/** Registers a mounted adapter host for service-layer notifications. */
export function registerSHNotificationHost(api: SHNotificationApi): () => void {
  hosts.push(api);
  pending.splice(0).forEach((command) => command(api));
  return () => {
    const index = hosts.lastIndexOf(api);
    if (index >= 0) hosts.splice(index, 1);
  };
}

/** Vendor-neutral global notification facade for services and interceptors. */
export const SHNotify: SHNotificationApi = {
  open: (options: SHNotificationOptions) => dispatch((api) => api.open(options)),
  success: (options) => dispatch((api) => api.success(options)),
  info: (options) => dispatch((api) => api.info(options)),
  warning: (options) => dispatch((api) => api.warning(options)),
  error: (options) => dispatch((api) => api.error(options)),
  close: (id) => dispatch((api) => api.close(id)),
  closeAll: () => dispatch((api) => api.closeAll()),
};

export const shNotification = SHNotify;
