// Create the context

import { createContext, useContext, useEffect, useState } from "react";

// Create customs hooks to access the context provider
export function useUserData() {
    return useContext(UserDataContext)
}

// Create the context provider
const UserDataContext = createContext({});

export default function UserProvider(props){

    const [userData, setUserData] = useState(() => {
        try {
            const savedUserData = localStorage.getItem('userData');
            return savedUserData ? JSON.parse(savedUserData) : null;
        } catch (error) {
            console.error("Failed to parse user data from localStorage:", error);
            return null; // Fallback to null if parsing fails
        }
    });

    useEffect(() => {
        // Save userData to localstorage whenever it changes
        if (userData) {
            localStorage.setItem('userData', JSON.stringify(userData));
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


