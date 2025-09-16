import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase configuration provided by user
const firebaseConfig = {
  apiKey: "AIzaSyCKz_hVm9a34Us36M4Uu7MlIEE47wH-5Ds",
  authDomain: "live-tv-pro-302b8.firebaseapp.com",
  projectId: "live-tv-pro-302b8",
  storageBucket: "live-tv-pro-302b8.firebasestorage.app",
  messagingSenderId: "536478798061",
  appId: "1:536478798061:web:eadca349b64e14c48ffce4",
  measurementId: "G-LW16BGCNZQ",
};

// Initialize Firebase App once
export const app = initializeApp(firebaseConfig);

// Initialize Analytics only in browser environments when supported
export const analytics = typeof window !== "undefined"
  ? await (async () => {
      try {
        const supported = await isSupported();
        return supported ? getAnalytics(app) : null;
      } catch {
        return null;
      }
    })()
  : null;
