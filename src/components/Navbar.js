
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/login">Logga In</Link></li>
                <li><Link to="/register">Registrera</Link></li>
                <li><Link to="/meetups">Meetups</Link></li>
                <li><Link to="/my-meetups">Mina Meetups</Link></li>
                <li><Link to="/my-meetups/past">Mina Tidigare Meetups</Link></li> 
            </ul>
        </nav>
    );
};

export default Navbar;
