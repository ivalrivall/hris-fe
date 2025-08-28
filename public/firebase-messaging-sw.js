importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js');

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
  const notif = payload.notification || {};
  console.log('background message notif', notif)
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

self.addEventListener('push', (event) => {
  try {
    const rawText = event.data ? event.data.text() : ''
    let payload = {}
    try { payload = rawText ? JSON.parse(rawText) : {} } catch { payload = {} }
    // If this looks like an FCM payload, let onBackgroundMessage handle it
    if (payload && (payload.notification || payload.data)) {
      return
    }

    const title = (payload && payload.title) || 'Test Push'
    const body = (payload && payload.body) || (typeof rawText === 'string' ? rawText : '') || 'This is a test push'
    const icon = (payload && payload.icon) || '/favicon.ico'
    const clickAction = (payload && (payload.click_action || payload.link)) || null

    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon,
        data: { clickAction },
      })
    )
  } catch (e) {
    event.waitUntil(
      self.registration.showNotification('Test Push', {
        body: 'Push received',
        icon: '/favicon.ico',
      })
    )
  }
})

