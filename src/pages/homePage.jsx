import React from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

function HomePage() {

    // Get id from the URL
    const { id } = useParams();

    const { user } = useUser();

    <div>
            {user ? (
                <h1>Welcome to your home page, {user.name}.</h1>
            ) : (
                <h1>Loading...</h1>
            )}
        </div>
}

export default HomePage;