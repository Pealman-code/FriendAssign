import React, { createContext, useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import app from '../firebase/FireBase.config';

export const AuthContext = createContext();
const auth = getAuth(app);

const MyProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    const createUser = (email, password) => {
        setLoading(true); 
        return createUserWithEmailAndPassword(auth, email, password).finally(() => setLoading(false));
    };

    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password).finally(() => setLoading(false));
    };

    const logOut = () => {
        setLoading(true); 
        return signOut(auth).finally(() => setLoading(false));
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false); 
        });
        return () => unsubscribe();
    }, []);

    const authData = {
        user,
        setUser,
        createUser,
        logOut,
        signIn,
        auth,
        loading, 
    };

    return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export default MyProvider;