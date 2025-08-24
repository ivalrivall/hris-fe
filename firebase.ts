import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCQdm52HAaym4Dtwo_yaAn51_8bGrHEIjk",
  authDomain: "hrisdexagroup.firebaseapp.com",
  projectId: "hrisdexagroup",
  storageBucket: "hrisdexagroup.firebasestorage.app",
  messagingSenderId: "396307097984",
  appId: "1:396307097984:web:2537e89b1201e9630af965",
  measurementId: "G-KGNHSKR210"
};

const app = initializeApp(firebaseConfig);
const messaging: Messaging = getMessaging(app);
const analytics = getAnalytics(app);
export { messaging, analytics, getToken, onMessage };