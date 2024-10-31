import React from 'react';
import { Link } from 'react-router-dom';
import { useUserData } from '../../contexts/userContext';
import './navBar.css'

function NavBar() {

    const { userData } = useUserData();
    const userId = userData?.userId;
    
    return (
        <>
        <div className='navBar'>
            <ul>
                <li><Link to={`users/${userId}/home`}><h3>Home</h3></Link></li>
                <li><Link to={`users/${userId}/about`}><h3>About</h3></Link></li>
                <li><Link to={`users/${userId}/blog`}><h3>Blog</h3></Link></li>
                <li><Link to={`users/${userId}/account`}><h3>Account</h3></Link></li>
            </ul>
        </div>
        </>
    )
}

export default NavBar;