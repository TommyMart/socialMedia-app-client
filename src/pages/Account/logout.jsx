import { useState } from "react";
import { useUserData } from "../../contexts/userContext";
import { useNavigate } from 'react-router-dom';



function Logout() {

    const { userData, removeToken } = useUserData();
    const [logOut, setLogOut] = useState(false);
    const navigate = useNavigate();

    const handleLogOut = () => {
        try {

            removeToken();
            setLogOut(true);
            navigate('/')
        }
     catch (error) {
        console.error('Error logging out:', error)
    }
}

    return (
        <>
            <h1>Account</h1>
            <h3>Account Details</h3>
            <p>Name: {userData.name}</p>
            <p>Username: {userData.username}</p>
            <p>Email: {userData.email}</p>
            
            <button
                onClick={() => handleLogOut()}
            >
                Log Out
            </button>
            {logOut && <p>You have successfully logged out.</p>}
        </>
    )
}

export default Logout;