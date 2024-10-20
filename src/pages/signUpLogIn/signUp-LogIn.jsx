import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../../contexts/UserContext";
import './signUpLogIn.css'


function SignUpLogIn() {
    const [isSignUp, setIsSignUp] = useState(true);
    
    const [formData, setFormData] = useState({ 
        name: '', 
        username: '', 
        email: '', 
        password: '' 
    });

    const { setUserData } = useUserData(); // Access the setUserData function from context
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const handleChange = (event) => {
        const { name, value } = event.target;  
        // Update the formData state by setting the value for the corresponding field (name, username, email, or password)
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();  // Prevent the default form submission behavior (which would refresh the page)
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

        // If there's a response
        if (response.ok) {
            setMessage(`Success: ${data.message}`);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.id);

            setUserData({
                id: data.id,
                name: data.name,
                username: data.username,
                email: data.email
            });

            // localStorage.setItem('userData', userData)

            const welcomeMessage = isSignUp
                ? `Welcome ${formData.name}, we're looking forward to assisting you in reaching your musical goals!`
                : `Welcome back ${data.name}, we're looking forward to assisting you in reaching your musical goals!`;
            alert(welcomeMessage);
            
            // Clear the form inputs after successful submission
            setFormData({ name: '', username: '', email: '', password: '' });

            // If user data is successfully fetched and includes an ID, navigate to the user's specific page
            if (data && data.id) {
                navigate(`/users/${data.id}/home`);
            }
            
        } else {
            setMessage(`Error: ${data.message}`);
            alert('There is already an account registered with the email address. Please sign in or use a different email.');
            setFormData({ name: '', username: '', email: '', password: '' });
        }
    } catch (error) {
        setMessage('An error has occured. Please try again.', error)
    }
}
        

    return (
        <>
        <h1 className="header">Electronic Music App V2</h1>
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