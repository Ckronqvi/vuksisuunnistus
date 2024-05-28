import { initializeApp, getApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  };

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const suunnistuksetRef = collection(db, 'suunnistukset'); 
export const privateIdsRef = collection(db, 'private_ids'); 
export const pubIdsRef = collection(db, 'pub_ids');
