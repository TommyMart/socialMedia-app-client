import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserData } from "../../contexts/UserContext";

function HomePage() {
    const { userId } = useParams();
    const { userData } = useUserData();
    const [user, setUser] = useState(null);

    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             const response = await fetch(`http://localhost:3000/users/${userId}`);
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             const data = await response.json();
    //             setUser(data);
    //         } catch (error) {
    //             console.error("Error fetching user data:", error);
    //         }
    //     };

    //     if (userId) {
    //         fetchUser();
    //     }
    // }, [userId]);
     
    return (
        <div>
            
            {userData ? ( // Check if user data is available
                <h1>Welcome to your home page, {userData.name}.</h1>
            ) : (
                <h1>Loading...</h1> // Display loading message while fetching user data
            )}
        </div>
    )
}


export default HomePage;