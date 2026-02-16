import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDQ2YKYtevHBl4jDbr3koIApO4oI9kR1mc",
  authDomain: "meu-shape-d6dc4.firebaseapp.com",
  projectId: "meu-shape-d6dc4",
  storageBucket: "meu-shape-d6dc4.firebasestorage.app",
  messagingSenderId: "416883027533",
  appId: "1:416883027533:web:2d8e46d3119307bcf67604",
  measurementId: "G-EY1F5MQT08",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
