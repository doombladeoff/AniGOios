import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
//@ts-ignore
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBSE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    // measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

export const iosClientId = process.env.EXPO_PUBLIC_IOS_CLIENT_ID

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})
const db = getFirestore(app);
const FIREBASE_STORAGE = getStorage(app);

export { app, auth, db, FIREBASE_STORAGE };
