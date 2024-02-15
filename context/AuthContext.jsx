import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../configs/firebaseConfig";
import {onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";

export const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);

    // Check if user is logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsAuthenticated(user ? true : false);
        });

        return unsubscribe;
    }, []);

    // Sign up
    const signUp = async (email, username, password) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            //TÄHÄN DATABASE KUTSU JOKA LISÄÄ UUDEN KÄYTTÄJÄN + MUUT TARVITTAVAT TIEDOT

            return {success: true};
        } catch (error) {
            console.log(error);
            return {success: false, error: error};
        }
    };

    // Sign in
    const signIn = async (email, password) => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            return {success: true};
        } catch (error) {
            console.log(error); //POISTA
            return {success: false, error: error};
        }
    };

    // Sign out
    const signOut = async () => {
        try {
            await auth.signOut();
            //await singOut(auth); Voi toimia myös
        } catch (error) {
            console.log(error); //POISTA
            return error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const value =  useContext(AuthContext);
    if(!value) {
        throw new Error("useAuth must be used within an AuthProvider!");
    }
    return value;
}