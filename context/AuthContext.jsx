import React, { createContext, useState, useEffect, useContext } from "react";
import {
  suunnistuksetRef,
  privateIdsRef,
  pubIdsRef,
} from "../configs/firebaseConfig";
import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  collection,
  GeoPoint,
  onSnapshot,
  query,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  const [privateCode, setPrivateCode] = useState(null); //Vain rastinpitäjillä on GM-koodi
  const [suunnistusID, setSuunnistusID] = useState(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);
  const [rastit, setRastit] = useState([]);
  // SUUNNISTUKSET LUOMISEEN: luodutSuunnistukset = {pubCode, privateCode}
  const [luotuSuunnistus, setLuotuSuunnistus] = useState(null);

  // Get "suunnistus" from the pubIdsRef by public code
  const loginViaPubId = async (pub_code) => {
    try {
      const docRef = doc(pubIdsRef, pub_code);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
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

  const logout = async () => {
    setPrivateCode(null);
    setSuunnistusID(null);
    setIsLoggedIn(false);
    setRastit([]);
    await AsyncStorage.removeItem("privateCode");
    await AsyncStorage.removeItem("suunnistusID");
  };

  const loadUserDataFromStorage = async () => {
    try {
      const suunnistusIDFromStorage = await AsyncStorage.getItem(
        "suunnistusID"
      );
      const privateCodeFromStorage = await AsyncStorage.getItem("privateCode");
      const luotuSuunnistusFromStorage = await AsyncStorage.getItem(
        "luotuSuunnistus"
      );

      if (luotuSuunnistusFromStorage) {
        setLuotuSuunnistus(JSON.parse(luotuSuunnistusFromStorage));
      }

      if (suunnistusIDFromStorage) {
        setSuunnistusID(suunnistusIDFromStorage);
        setIsLoggedIn(true);
      } else {
        setSuunnistusID(null);
        setIsLoggedIn(false);
      }
      if (privateCodeFromStorage) {
        setPrivateCode(privateCodeFromStorage);
      }
    } catch (error) {
      console.error("Error loading user data from AsyncStorage:", error);
    }
  };

  const addRasti = async (nimi, kuvaus, sijainti) => {
    if (!privateCode) {
      return { success: false, error: "Ei ole oikeuksia!" };
    }
    const isValid = await isValidPrivateCode(privateCode, suunnistusID);
    if (!isValid) {
      return { success: false, error: "Ei ole oikeuksia!" };
    }
    try {
      // create a geo point from the location object
      const geoSijainti = new GeoPoint(sijainti.latitude, sijainti.longitude);
      // add the rasti to the database
      const docRef = doc(collection(suunnistuksetRef, suunnistusID, "rastit"));
      await setDoc(docRef, {
        nimi,
        kuvaus,
        sijainti: geoSijainti,
      });
      return { success: true };
    } catch (error) {
      console.error("Error adding rasti:", error);
      return { success: false, error: "Virhe rastin lisäämisessä" };
    }
  };

  const createSuunnistus = async () => {
    try {
      const success = false;
      while (!success) {
        const privateCode = createRandomPrivateCode(); // Random 10 number string
        const pubCode = createRandomCode(); // Random 4 number string

        // Check if the public code already exists
        const pubCodeDocRef = doc(pubIdsRef, pubCode.toString());
        const pubCodeDocSnap = await getDoc(pubCodeDocRef);
        if (pubCodeDocSnap.exists()) {
          continue;
        }

        // Check if the private code already exists
        const privateCodeDocRef = doc(privateIdsRef, privateCode.toString());
        const privateCodeDocSnap = await getDoc(privateCodeDocRef);
        if (privateCodeDocSnap.exists()) {
          continue;
        }

        const suunnistusRef = doc(suunnistuksetRef);
        await setDoc(suunnistusRef, { created: new Date() });

        // Create a new public code document with pubCode as the ID
        await setDoc(pubCodeDocRef, { suunnistus: suunnistusRef });
        // Create a new private code document
        await setDoc(privateCodeDocRef, { suunnistus: suunnistusRef });
        // Save the codes to the state luotSuunnistus state
        setLuotuSuunnistus({ pubCode, privateCode });
        // Save the luotuSuunnistus to AsyncStorage for persistence
        await AsyncStorage.setItem(
          "luotuSuunnistus",
          JSON.stringify({ pubCode, privateCode })
        );
        return { success: true };
      }
      // Tallenna tieto tästä suunnistuksesta johonkin muuttujaan
    } catch (error) {
      console.error("Error creating suunnistus:", error);
      return { success: false, error: "Virhe suunnituksen luomisessa" };
    }
  };

  // Deletes the suunnistus from the database
  const endSuunnistus = async () => {
    try {
      await AsyncStorage.removeItem("luotuSuunnistus");
      const luotuPrivateRef = doc(
        privateIdsRef,
        luotuSuunnistus.privateCode.toString()
      );
      const docSnap = await getDoc(luotuPrivateRef);
      const luotuSuunnistusID = docSnap.data().suunnistus.id;
      await deleteDoc(luotuPrivateRef);
      await deleteDoc(doc(pubIdsRef, luotuSuunnistus.pubCode.toString()));
      await deleteDoc(doc(suunnistuksetRef, luotuSuunnistusID));
      setLuotuSuunnistus(null);
      return { success: true };
    } catch (error) {
      console.error("Error ending suunnideleteDocstus:", error);
      return { success: false, error: "Virhe suunnituksen lopettamisessa" };
    }
  };

  // Load user data from AsyncStorage when component mounts
  useEffect(() => {
    loadUserDataFromStorage();
  }, []);

  useEffect(() => {
    if (suunnistusID) {
      const q = query(collection(suunnistuksetRef, suunnistusID, "rastit"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const updatedRastit = snapshot.docs.map((doc) => {
          const rastiData = doc.data();
          return { id: doc.id, ...rastiData };
        });
        setRastit(updatedRastit);
      });
      return unsubscribe;
    }
  }, [suunnistusID]);

  return (
    <AuthContext.Provider
      value={{
        endSuunnistus,
        loginViaPubId,
        loginViaPrivateId,
        logout,
        createSuunnistus,
        addRasti,
        isLoggedIn,
        privateCode,
        rastit,
        luotuSuunnistus,
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

export const isValidPrivateCode = async (code, suunnistusID) => {
  try {
    const docRef = doc(privateIdsRef, code);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return suunnistusID == docSnap.data().suunnistus.id;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error getting private code:", error);
    return false;
  }
};
