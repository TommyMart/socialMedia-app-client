import React, { createContext, useContext, useState } from 'react';

// Create UseContext
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <>
            <UserContext.Provider value={{ user, setUser }} >
                {children}
            </UserContext.Provider >
        </>
    )
}

export const useUser = () => {
    return useContext(UserContext);
}