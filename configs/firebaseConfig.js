import { initializeApp, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "***REMOVED***",
    authDomain: "***REMOVED***",
    databaseURL: "***REMOVED***",
    projectId: "***REMOVED***",
    storageBucket: "***REMOVED***",
    messagingSenderId: "***REMOVED***",
    appId: "***REMOVED***"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});
export const realtimeDB = getDatabase(app);