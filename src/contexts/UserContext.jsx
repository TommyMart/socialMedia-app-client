// import React, { createContext, useContext, useState } from 'react';
// import axios from 'axios';

// // Create UseContext
// // Create context for user data
// const UserContext = createContext();

// // Create a provider component
// export const UserProvider = ({ children }) => {
//     const [user, setUser] = useState(null); // State to hold user data

//     // Function to fetch user data by ID
//     // const fetchUser = async (email) => {
//     //     try {
//     //         const response = await fetch(`http://localhost:3000/users?email=${email}`);
//     //         setUser(response.data); // Set user data in context
//     //     } catch (error) {
//     //         console.error('Error fetching user: ', error)
//     //     }
//     // }

//     return (
//         <>
//             <UserContext.Provider value={{ user }} >
//                 {children}
//             </UserContext.Provider >
//         </>
//     )
// }

// export const useUser = () => {
//     return useContext(UserContext);
// }