import React, { useState } from "react";
import { useNavigate } from "react-router-dom";



function SignUpLogIn() {
    // `isSignUp` is a boolean state that toggles between Sign Up and Log In mode
    const [isSignUp, setIsSignUp] = useState(true);
    
    // `formData` stores the user's input in the form fields for name, username, email, and password
    const [formData, setFormData] = useState({ 
        name: '', 
        username: '', 
        email: '', 
        password: '' 
    });

    // `message` holds any success or error messages to display to the user after submitting the form
    const [message, setMessage] = useState('');
    
    // `navigate` is used to redirect the user to another route after login/signup
    const navigate = useNavigate();

    // This function handles changes in the form inputs. It updates the `formData` state whenever the user types in the input fields.
    const handleChange = (event) => {
        const { name, value } = event.target;  // Destructure the input field's name and value
        // Update the formData state by setting the value for the corresponding field (name, username, email, or password)
        setFormData({ ...formData, [name]: value });
    }

    // This function handles the form submission for both signup and login
    const handleSubmit = async (event) => {
        event.preventDefault();  // Prevent the default form submission behavior (which would refresh the page)
        try {
            // Choose the correct API endpoint depending on whether the user is signing up or logging in
        const endpoint = isSignUp ? 'http://localhost:3000/users/signup' : 'http://localhost:3000/users/login';
        
        // Make a POST request to the selected endpoint, sending the form data in JSON format
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData) // Convert the form data into a JSON string to send to the server
        });

        const data = await response.json();  // Parse the JSON response from the server

        // If the response from the server indicates success
        if (response.ok) {
            // Display a success message in the UI
            setMessage(`Success: ${data.message}`);
            // localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.id);

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
            // If the response indicates an error (e.g., duplicate email), display the error message
            setMessage(`Error: ${data.message}`);
            alert('There is already an account registered with the email address. Please sign in or use a different email.');
            
            // Clear the form data in case of an error
            setFormData({ name: '', username: '', email: '', password: '' });
        }
    } catch (error) {
        setMessage('An error has occured. Please try again.', error)
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