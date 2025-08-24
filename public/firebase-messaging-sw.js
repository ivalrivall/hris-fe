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
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: '/media/logos/dexa-group-splash.jpg',
  });
});
