import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../../contexts/UserContext";
import Cookies from 'js-cookie';
import './signUpLogIn.css'


function SignUpLogIn() {
    const [isSignUp, setIsSignUp] = useState(true);
    
    const [formData, setFormData] = useState({ 
        name: '', 
        username: '', 
        email: '', 
        password: '' 
    });

    // Access the setToken function and userData from context
    const { setToken, userData } = useUserData(); 
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Navigate to specific user home page if userId is truthy
        if (userData?.userId) {
            navigate(`/users/${userData.userId}/home`, {replace: true});
        }
    }, [userData, navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;  
        // Update the formData state by setting the value for the corresponding field 
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();  
        try {
            const endpoint = isSignUp 
            ? 'http://localhost:3000/users/signup' 
            : 'http://localhost:3000/users/login';
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    
                },
                body: JSON.stringify(formData) 
        });

        const data = await response.json();  // Parse the JSON response from the server

        // If response is OK, process token and user data
        if (response.ok) {
            setMessage(`Success: ${data.message}`);

            console.log('Received token:', data.token);

            // Store the JWT token and set user data using the context's setToken
            setToken(data.token);

            const welcomeMessage = isSignUp
                ? `Welcome ${formData.name}, we're looking forward to assisting you in reaching your musical goals!`
                : `Welcome back ${data.name}, we're looking forward to assisting you in reaching your musical goals!`;
            alert(welcomeMessage);
            
            // Clear the form inputs after successful submission
            setFormData({ name: '', username: '', email: '', password: '' });

        } else {
            setMessage(`Error: ${data.message}`);
            alert(data.message);
        }
    } catch (error) {
        setMessage('An error has occured. Please try again.');
        console.log('Signup/Login Error:', error);
    }
}
        

    return (
        <>
        <h1 className="header">Welcome to Rattle Snake Events.</h1>
        <div className="signUpLogIn">
            <button
                className="signUp"
                onClick={() => {
                    setIsSignUp(true);
                    setMessage('');
                }}>
                Sign Up
            </button>

            <button
                className="logIn"
                onClick={() => {
                    setIsSignUp(false);
                    setMessage('');
                }}>
                Log In
            </button>

            <form onSubmit={handleSubmit}>
                {!isSignUp && (
                    <>
                    <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </>
                )}
                {isSignUp && (
                    <>
                    <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </>
                )}
            
            <button type="submit">
                Submit

            </button>
                {message && <p>{message}</p>}
            </form>
        </div>
        </>
    );
}

export default SignUpLogIn;