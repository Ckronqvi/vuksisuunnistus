import React, { createContext, useState, useEffect, useContext } from "react";
import {
  auth,
  db,
  suunnistuksetRef,
  privateIdsRef,
  pubIdsRef,
} from "../configs/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  const [privateCode, setPrivateCode] = useState(null); //Vain rastinpitäjillä on GM-koodi
  const [suunnistusRef, setSuunnistusRef] = useState(undefined); // Suunnistus dokumenttiin ref
  const [suunnistusID, setSuunnistusID] = useState(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);

  // Get "suunnistus" from the pubIdsRef by public code
  const loginViaPubId = async (pub_code) => {
    try {
      const docRef = doc(pubIdsRef, pub_code);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSuunnistusRef(docSnap.data().suunnistus);
        setSuunnistusID(docSnap.data().suunnistus.id);
        // Save the suunnistusID to AsyncStorage for persistence
        await AsyncStorage.setItem(
          "suunnistusID",
          docSnap.data().suunnistus.id
        ).then(setIsLoggedIn(true));
        return { success: true };
      } else {
        return { success: false, error: "Koodia ei löytynyt" };
      }
    } catch (error) {
      console.error("Error getting suunnistusID:", error);
      return {
        success: false,
        error: "Virhe kirjautumisessa, yritä uudelleen.",
      };
    }
  };

  // Get "suunnistus" from the privateIdsRef by private code
  const loginViaPrivateId = async (priv_code) => {
    try {
      const docRef = doc(privateIdsRef, priv_code);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSuunnistusRef(docSnap.data().suunnistus);
        setSuunnistusID(docSnap.data().suunnistus.id);
        // Save the suunnistusID and private code to AsyncStorage for persistence
        await AsyncStorage.setItem("privateCode", priv_code).then(
          await AsyncStorage.setItem(
            "suunnistusID",
            docSnap.data().suunnistus.id
          )
            .then(setIsLoggedIn(true))
            .then(setPrivateCode(priv_code))
        );
        return { success: true };
      } else {
        return { success: false, error: "Koodia ei löytynyt" };
      }
    } catch (error) {
      console.error("Error getting suunnistusID:", error);
      return {
        success: false,
        error: "Virhe kirjautumisessa, yritä uudelleen.",
      };
    }
  };

  // log the user out by setting suunnistusRef to null
  const logout = async () => {
    setSuunnistusRef(null);
    setPrivateCode(null);
    setSuunnistusID(null);
    setIsLoggedIn(false);
    await AsyncStorage.removeItem("privateCode");
    await AsyncStorage.removeItem("suunnistusID");
  };

  const loadUserDataFromStorage = async () => {
    try {
      const suunnistusID = await AsyncStorage.getItem("suunnistusID");
      const privateCode = await AsyncStorage.getItem("privateCode");
      if (suunnistusID) {
        setSuunnistusID(suunnistusID);
        // Get suunnistusRef from suunnistusID
        const docRef = doc(suunnistuksetRef, suunnistusID); //TODO: Tää on erillainen ku loginViaPubId funktion ref, omituista.
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSuunnistusRef(docSnap.data());
          setIsLoggedIn(true);
        }
      } else {
        setSuunnistusRef(null);
        setSuunnistusID(null);
        setIsLoggedIn(false);
      }
      if (privateCode) {
        setPrivateCode(privateCode);
      }
    } catch (error) {
      console.error("Error loading user data from AsyncStorage:", error);
    }
  };

  // TODO: Lisää rasti. 
  const addRasti = async (rasti) => {
    try {
      // lisää rasti
    } catch (error) {
      console.error("Error adding rasti:", error);
    }
  };

  //TODO luo uusi suunnistus
  const createSuunnistus = async (suunnistus) => {
    try {
      // luo uusi suunnistus
      const success = false;
      while (!success) {
        const privateCode = createRandomPrivateCode(); // Random 10 number string
        const pubCode = createRandomCode(); // Random 4 number string
        // Tarkista onko koodit jo käytössä
        // Jos ei ole, luo uusi suunnistus
        // Jos on jatka while loopia
      }
      // Tallenna tieto tästä suunnistuksesta johonkin muuttujaan
    } catch (error) {
      console.error("Error creating suunnistus:", error);
    }
  };

  // Load user data from AsyncStorage when component mounts
  useEffect(() => {
    loadUserDataFromStorage();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loginViaPubId,
        loginViaPrivateId,
        suunnistusID,
        logout,
        isLoggedIn,
        privateCode,
      }} // TODO: Poista ylimääräset sitte lopuks.
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within an AuthProvider!");
  }
  return value;
};

// function that creates random 4 number string
export const createRandomCode = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

// function that create random 10 number string
export const createRandomPrivateCode = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000);
};
