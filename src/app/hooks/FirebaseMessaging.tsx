/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/hooks/useFirebaseMessaging.ts
import { useEffect, useRef } from 'react';
import axios from 'axios';
import { messaging, getToken, onMessage } from '../../../firebase';

type Options = {
  shouldSubscribe?: boolean;
  topic?: string;
};

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;
const API_URL = import.meta.env.VITE_APP_API_URL as string | undefined;
const SUBSCRIBE_ENDPOINT = `${API_URL}/fcm/user.ADMIN/subscribe`;

export const useFirebaseMessaging = (
  onReceive?: (payload: any) => void,
  options?: Options
) => {
  const lastSubscribedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    const { shouldSubscribe = false, topic } = options || {};

    const fetchTokenAndMaybeSubscribe = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        if (!VAPID_KEY) {
          console.warn('VITE_FIREBASE_VAPID_KEY is not set. FCM token cannot be retrieved.');
          return;
        }

        // Ensure the Firebase Messaging service worker is registered and use it to get token
        let swReg: ServiceWorkerRegistration | undefined
        if ('serviceWorker' in navigator) {
          swReg = (await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js')) ||
            (await navigator.serviceWorker.register('/firebase-messaging-sw.js'))
          console.log('Service Worker registered for FCM:', swReg)
        }

        const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: swReg }) ;
        if (!token) return;

        // Subscribe token to topic via backend if requested
        if (shouldSubscribe && topic && SUBSCRIBE_ENDPOINT) {
          if (lastSubscribedTokenRef.current !== token) {
            try {
              await axios.post(SUBSCRIBE_ENDPOINT, { token, topic });
              lastSubscribedTokenRef.current = token;
            } catch (err) {
              console.error('Failed to subscribe FCM token to topic', err);
            }
          }
        } else if (shouldSubscribe && topic && !SUBSCRIBE_ENDPOINT) {
          console.warn('No subscribe endpoint configured. Set VITE_FCM_SUBSCRIBE_ENDPOINT or VITE_APP_API_URL.');
        }
      } catch (error) {
        console.error('Error initializing Firebase Messaging', error);
      }
    };

    fetchTokenAndMaybeSubscribe();

    const messageForeground = onMessage(messaging, (payload) => {
      console.log('on message', payload)
      // Show a foreground notification (supports notification or data-only payloads)
      try {
        const p: any = payload as any
        const notif = p?.notification || {}
        const data = p?.data || {}
        const title = notif.title || data.title || 'Notification'
        const body = notif.body || data.body || ''
        const icon = notif.icon || data.icon || '/media/logos/dexa-group-splash.jpg'
        const clickAction = notif.click_action || data.click_action || data.link

        if (Notification.permission === 'granted') {
          const n = new Notification(title, {
            body,
            icon,
            data: { clickAction },
          })
          if (clickAction) {
            n.onclick = () => {
              window.open(clickAction, '_self')
            }
          }
        }
      } catch {
        // ignore Notification API errors
      }
      onReceive?.(payload as any);
    });

    return () => messageForeground();
  }, [options?.shouldSubscribe, options?.topic, onReceive]);
};