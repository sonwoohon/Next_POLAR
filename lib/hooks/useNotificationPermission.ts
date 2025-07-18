'use client';

import { useState, useEffect } from 'react';

export function useNotificationPermission() {
  const [permission, setPermission] =
    useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // 브라우저가 알림을 지원하는지 확인
    const supported = 'Notification' in window;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('이 브라우저는 알림을 지원하지 않습니다.');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('알림 권한 요청 중 오류:', error);
      return false;
    }
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!isSupported || permission !== 'granted') {
      return false;
    }

    try {
      new Notification(title, options);
      return true;
    } catch (error) {
      console.error('알림 전송 중 오류:', error);
      return false;
    }
  };

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
  };
}
