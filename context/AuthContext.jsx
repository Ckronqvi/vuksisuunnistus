import React, { createContext, useState, useEffect, useContext } from "react";
import { auth, db } from "../configs/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [userData, setUserData] = useState({}); // [email, username, guild, uid, role

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthenticated(user ? true : false);
    });
    return unsubscribe;
  }, []);

  // Function to save userData to AsyncStorage
  const saveUserDataToStorage = async (data) => {
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving user data to AsyncStorage:", error);
    }
  };

  // Function to load userData from AsyncStorage
  const loadUserDataFromStorage = async () => {
    try {
      const userDataJSON = await AsyncStorage.getItem("userData");
      if (userDataJSON) {
        const userData = JSON.parse(userDataJSON);
        setUserData(userData);
      }
    } catch (error) {
      console.error("Error loading user data from AsyncStorage:", error);
    }
  };

  // Load user data from AsyncStorage when component mounts
  useEffect(() => {
    loadUserDataFromStorage();
  }, []);

  // Sign up
  const signUp = async (email, username, password, guild) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      //DATABASE KUTSU JOKA LISÄÄ UUDEN KÄYTTÄJÄN + MUUT TARVITTAVAT TIEDOT
      await setDoc(doc(db, "users", response?.user?.uid), {
        email: email,
        username: username,
        guild: guild,
        uid: response.user.uid,
        role: "Suunnistaja",
      });
      const userData = {
        email: email,
        username: username,
        guild: guild,
        uid: response.user.uid,
        role: "Suunnistaja",
      };
      setUserData(userData);
      saveUserDataToStorage(userData);
      return { success: true };
    } catch (error) {
      const errorMessage = parseErrorMessage(error.code);
      return { success: false, error: errorMessage };
    }
  };

  // Sign in
  const signIn = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const userData = await getUserData(response.user.uid);
      setUserData(userData);
      saveUserDataToStorage(userData);
      return { success: true };
    } catch (error) {
      const errorMessage = parseErrorMessage(error.code);
      return { success: false, error: errorMessage };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await auth.signOut();
      setUserData({}); // Clear User Data
      await AsyncStorage.removeItem('userData');
      return { success: true };
    } catch (error) {
      console.log(error);
      return { success: true, error: error };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, signUp, signOut, userData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// private function to parse error messages
const parseErrorMessage = (error) => {
  if (error == "auth/wrong-password") {
    return "Väärä salasana";
  } else if (error == "auth/user-not-found") {
    return "Käyttäjää ei löytynyt";
  } else if (error == "auth/invalid-email") {
    return "Sähköposti on väärässä muodossa";
  } else if (error == "auth/invlid-credential") {
    return "Sähköposti tai salana on väärin";
  } else {
    return "Virhe kirjautumisessa, yritä uudelleen.";
  }
};

// Get user data from database
const getUserData = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within an AuthProvider!");
  }
  return value;
};
