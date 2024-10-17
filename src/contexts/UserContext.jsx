// Create the context

import { createContext, useContext, useState } from "react";

// Create customs hooks to access the context provider
export function useUserData() {
    return useContext(UserDataContext)
}

// Create the context provider
const UserDataContext = createContext({});

export default function UserProvider(props){

    let [userData, setUserData] = useState({});

    return(
        <UserDataContext.Provider value={{ userData, setUserData }}>
            {props.children}
        </UserDataContext.Provider >
    )
}


