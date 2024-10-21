import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useUserData } from "../../contexts/UserContext";


function HomePage() {
    const { userId } = useParams();
    const { userData, removeToken } = useUserData();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation(); // Provides current route
    
    
    useEffect(() => {
        if (userData && userData.userId === userId) {
            setUser(userData); // Set user data if it matches the URL param
        } else {
            setUser(null); // Clear user state if not matched
        }
    }, [userData, userId]);

    // useEffect(() => {
    //     // If user is authenticated with valid userData and userId (params)
    //     if (userData && userData.userId === userId) {
    //         if (userData.userId === userId) {
    //             // set user data context
    //             setUser(userData);
    //         } else if (location.pathname !== `/users/${userData.userId}/home`) {

    //             navigate(`/users/${userData.userId}/home`, { replace: true })
    //         }
    //     } else {
    //         // If no valid token or userId, redirect to login and clear
    //         removeToken();
    //         navigate('/', { replace: true })
    //     }
    // }, [userData, userId, navigate, removeToken, location.pathname]);

    useEffect(() => {
        if (!userData) {
            navigate('/');
        }
    }, [userData, navigate])

    return (
        <div>
            
            {userData ? ( // Check if user data is available
                <h1>Welcome to your home page, {userData.name}.</h1>
            ) : (
                <h1>Loading...</h1> // Display loading message while fetching user data
            )}
            {user && (
                <p>Your username is {user.username}</p>
            )}
        </div>
    )
}


export default HomePage;