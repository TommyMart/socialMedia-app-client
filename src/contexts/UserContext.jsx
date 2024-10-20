// Create the context

import { createContext, useContext, useEffect, useState } from "react";

// Create customs hooks to access the context provider
export function useUserData() {
    return useContext(UserDataContext)
}

// Create the context provider
const UserDataContext = createContext({});

export default function UserProvider(props){

    let [userData, setUserData] = useState(() => {
        // Try to load user data from localStorage when the app starts
        const savedUserData = localStorage.getItem('userData');
        return savedUserData ? JSON.parse(savedUserData) : null;
    });

    useEffect(() => {
        // Save userData to localstorage whenever it changes
        if (userData) {
            localStorage.getItem('userData', JSON.stringify(userData));
        } else {
            // If userData is cleared, remove from local storage
            localStorage.removeItem('userData');
        }
    }, [userData]);

    return (
        <UserDataContext.Provider value={{ userData, setUserData }}>
            {props.children}
        </UserDataContext.Provider >
    )
}


