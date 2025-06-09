// components/notifications/NotificationListener.tsx
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import useToast from '@/hooks/useToast';

export default function NotificationListener() {
  const { showSuccess } = useToast();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // Notificación recibida (en foreground)
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('[📲 Notificación recibida]', notification);

      const { title, body } = notification.request.content;
      showSuccess({
        title: title || 'Notificación',
        message: body || '',
      });
    });

    // Usuario tocó la notificación
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('[👆 Notificación tocada]', response);
      const data = response.notification.request.content.data;
      console.log('[📦 Data de notificación]', data);

      // Aquí puedes redirigir según `data.route` o `data.params`
    });

    return () => {
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(notificationListener.current);
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return null;
}
