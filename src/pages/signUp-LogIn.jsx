import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";


function SignUpLogIn() {
    const [isSignUp, setIsSignUp] = useState(true);
    const [formData, setFormData] = useState({ 
        name: '', 
        username: '', 
        email: '', 
        password: '' 
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const endpoint = isSignUp ? 'http://localhost:3000/signup' : 'http://localhost:3000/login';
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            setMessage(`Success: ${data.message}`);

            if (isSignUp) {
                alert(`Welcome ${formData.name}, we're looking forward to assisting you in reaching your musical goals!`)
            } else {
                alert(`Welcome back ${data.name}, we're looking forward to assisting you in reaching your musical goals!`)
            }
            
            // Clear UI form data
            setFormData({ name: '', username: '', email: '', password: '' });
            
            // Set user data in context
            setUser({ name: data.name, username: data.username, id: data.id });

            // Navigate to users specific route using their unique ID
            navigate(`/homepage/${data.id}`);
        } else {
            setMessage(`Error: ${data.message}`);
            alert('There is already an account registered with the email address. Please sign in or use a different email.');
            setFormData({ name: '', username: '', email: '', password: '' });
        }
    }

    

    return (
        <div>
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
    );
}

export default SignUpLogIn;