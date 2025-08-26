/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/hooks/useFirebaseMessaging.ts
import { useEffect, useRef } from 'react';
import axios from 'axios';
import { messaging, getToken, onMessage } from '../../../firebase';

type Options = {
  shouldSubscribe?: boolean; // e.g., user is ADMIN
  topic?: string; // e.g., 'user.ADMIN'
};

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;
const API_URL = import.meta.env.VITE_APP_API_URL as string | undefined;
const SUBSCRIBE_ENDPOINT = (import.meta.env.VITE_FCM_SUBSCRIBE_ENDPOINT as string | undefined) || (API_URL ? `${API_URL}/fcm/subscribe-topic` : undefined);

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

        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
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

    const unsubscribe = onMessage(messaging, (payload) => {
      // Show a foreground notification
      try {
        const title = (payload as any)?.notification?.title || 'Notification';
        const body = (payload as any)?.notification?.body || '';
        if (Notification.permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/media/logos/dexa-group-splash.jpg',
          });
        }
      } catch {
        // ignore Notification API errors
      }
      onReceive?.(payload as any);
    });

    return () => unsubscribe();
  }, [options?.shouldSubscribe, options?.topic, onReceive]);
};