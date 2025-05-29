import OneSignal from 'react-native-onesignal';
import { navigationRef } from '@/app/navigation/navigationRef';
import { Platform } from 'react-native';

const ONESIGNAL_APP_ID = 'ad2ad0f6-adb2-4ccc-b00d-2f836b712a34';

export function initNotifications() {
  if (__DEV__) {
    console.log('[OneSignal] Desactivado en desarrollo (Expo Go no soporta módulos nativos)');
    return;
  }

  OneSignal.setAppId(ONESIGNAL_APP_ID);

  interface NotificationAdditionalData {
    type?: string;
    [key: string]: any;
  }

  interface NotificationObject {
    additionalData?: NotificationAdditionalData;
    [key: string]: any;
  }

  interface NotificationOpenedEvent {
    notification: NotificationObject;
    [key: string]: any;
  }

  OneSignal.setNotificationOpenedHandler((notification: NotificationOpenedEvent) => {
    console.log('🔔 Notificación abierta:', notification);
    const data: NotificationAdditionalData | undefined = notification.notification.additionalData;

    if (data?.type === 'swap') {
      navigationRef.navigate('SwapScreen'); // o con params específicos
    }
  });

  OneSignal.promptForPushNotificationsWithUserResponse((response) => {
    console.log('🔔 Permiso de notificación:', response);
  });
}