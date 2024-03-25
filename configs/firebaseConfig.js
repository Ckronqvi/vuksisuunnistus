import { initializeApp, getApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
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

export const db = getFirestore(app);
export const suunnistuksetRef = collection(db, 'suunnistukset'); 
export const privateIdsRef = collection(db, 'private_ids'); 
export const pubIdsRef = collection(db, 'pub_ids');