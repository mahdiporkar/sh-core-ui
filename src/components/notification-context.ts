import { createContext, useContext } from 'react';
import type { SHNotificationApi } from './types';

export const SHNotificationContext = createContext<SHNotificationApi | null>(null);

/** Returns the notification API hosted by the nearest SHNotification component. */
export function useSHNotification(): SHNotificationApi {
  const value = useContext(SHNotificationContext);
  if (!value) throw new Error('useSHNotification must be used inside SHNotification');
  return value;
}
