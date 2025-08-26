importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCQdm52HAaym4Dtwo_yaAn51_8bGrHEIjk',
  authDomain: 'hrisdexagroup.firebaseapp.com',
  projectId: 'hrisdexagroup',
  storageBucket: 'hrisdexagroup.firebasestorage.app',
  messagingSenderId: '396307097984',
  appId: '1:396307097984:web:2537e89b1201e9630af965',
  measurementId: "G-KGNHSKR210"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('payload', payload)
  // Support notification or data-only payloads
  const notif = payload.notification || {};
  const data = payload.data || {};
  const title = notif.title || data.title || 'Notification';
  const body = notif.body || data.body || '';
  const icon = notif.icon || data.icon || '/media/logos/dexa-group-splash.jpg';
  const clickAction = notif.click_action || data.click_action || data.link || null;

  self.registration.showNotification(title, {
    body,
    icon,
    data: { clickAction },
  });
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const clickAction = event.notification?.data?.clickAction;
  if (clickAction) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // If URL already open, focus it; otherwise open new window
        for (const client of clientList) {
          if ('focus' in client && client.url.includes(clickAction)) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(clickAction);
        }
      })
    );
  }
});
