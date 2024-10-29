import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserData } from "../../contexts/userContext";
import FollowButton from "../../components/followButton";


function HomePage() {
    const { userId } = useParams();
    const { userData } = useUserData();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    
    
    useEffect(() => {
        // if on current user's homepage
        if (userData && userData.userId === userId) {
            setUser(userData); // Set user data if it matches the URL param
        } else {
            // Fetch the target user's data
           const fetchUserData = async () => {
                try {
                    const response = await fetch(`http:localhost:3000/${userId}`);
                    const data = await response.json();
                    setUser(data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
        fetchUserData();
    }
    }, [userData, userId]);

    // Debug
    // console.log(`${Cookies.get(jwtToken)}`)
    // If no userData, redirect to homepage
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

            <FollowButton targetUserId={userId} />
        </div>
    )
}


export default HomePage;