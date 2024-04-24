import { initializeApp, getApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "***REMOVED***",
    authDomain: "***REMOVED***",
    projectId: "***REMOVED***",
    storageBucket: "***REMOVED***.appspot.com",
    messagingSenderId: "***REMOVED***",
    appId: "1:***REMOVED***:web:162ded4966c2214b6adf2c"
  };

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const suunnistuksetRef = collection(db, 'suunnistukset'); 
export const privateIdsRef = collection(db, 'private_ids'); 
export const pubIdsRef = collection(db, 'pub_ids');