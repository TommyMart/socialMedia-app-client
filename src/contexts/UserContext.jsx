import { createContext, useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';

// Create customs hook to access the context provider
export function useUserData() {
    return useContext(UserDataContext)
}

// Create the context provider
const UserDataContext = createContext({});

export default function UserProvider({ children }){
    const [userData, setUserData] = useState(null);

    // Function to decode JWT manually
    const decodeJwt = (token) => {
        try {
            const base64Url = token.split('.')[1]; // Get the payload part of the token
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            // console.log(JSON.parse(jsonPayload))
            return JSON.parse(jsonPayload); // Return the decoded payload as a JavaScript object
            
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    const setToken = (token) => {
        Cookies.set('jwtToken', token, { expires: 2 });
        const decoded = decodeJwt(token);
        console.log('decoded user info: ', decoded)
        setUserData(decoded); // Set user data based on decoded token
    };
    
    const removeToken = () => {
        Cookies.remove('jwtToken');
        setUserData(null);
    };

    useEffect(() => {
        const token = Cookies.get('jwtToken'); // Get token from cookies on page load
        
        if (token) {
            const decoded = decodeJwt(token);
            const currentTime = Date.now() / 1000;
            if (decoded && decoded.exp && decoded.exp < currentTime) {
                console.log('Token has expired');
                removeToken();
            } else {
                setUserData(decoded); // Set the decoded user data in state
            }
        }
    }, []);

    return (
        <UserDataContext.Provider value={{ userData, setToken, removeToken }}>
            {children}
        </UserDataContext.Provider >
    );
};
