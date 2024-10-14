import React from "react";
import { useParams } from "react-router-dom";

function HomePage() {

    // Get id from the URL
    const { id } = useParams();

    return (
        <h1>Welcome to your home page, {user.name}.</h1>
    )
}

export default HomePage;