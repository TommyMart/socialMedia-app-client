import React from 'react';
import { Link } from 'react-router-dom';
import './navBar.css'

function NavBar() {

    const userId = localStorage.getItem('userId');
    
    return (
        <>
        <div className='navBar'>
            <ul>
                <li><Link to={`users/${userId}/home`}><h3>Home</h3></Link></li>
                <li><Link to={`users/${userId}/about`}><h3>About</h3></Link></li>
                <li><Link to={`users/${userId}/tutorials`}><h3>Tutorials</h3></Link></li>
                <li><Link to={`users/${userId}/account`}><h3>Account</h3></Link></li>
            </ul>
        </div>
        </>
    )
}

export default NavBar;