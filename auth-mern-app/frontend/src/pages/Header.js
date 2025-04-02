import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../utils';
import { FaSearch, FaBell, FaUser, FaHome, FaBriefcase, FaComments } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from 'axios';
import "../Header.css";
import logo from '../logo1.png';

const Header = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [briefcaseDropdown, setBriefcaseDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged Out');
        setTimeout(() => navigate('/login'), 1000);
    };

    // Fetch related users when searchTerm changes
    useEffect(() => {
        if (searchTerm.length > 1) {
            axios.get(`http://localhost:8080/api/users/search?query=${searchTerm}`)
                .then(response => setSearchResults(response.data))
                .catch(error => console.error("Error fetching search results:", error));
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    return (
        <header className="header">
            <div className="logo">
                <img src={logo} alt="SCIIT Logo" className="logo-img" />
            </div>

            {/* Search Bar */}
            <div className="search-box">
                <FaSearch className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Search for users..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* Display search results */}
                {searchResults.length > 0 && (
                    <div className="search-dropdown">
                        {searchResults.map(user => (
                            <Link key={user._id} to={`/profile/${user._id}`} className="search-item">
                                <img src={user.profilePic || '/default-profile.jpg'} alt="User" className="search-profile-pic" />
                                <div>
                                    <p className="search-name">{user.name}</p>
                                    <p className="search-role">{user.role}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Navigation Icons */}
            <nav className="nav-links">
                <Link to="/home"><FaHome className="nav-icon active" /></Link>

                {/* Briefcase Icon with Dropdown */}
                <div className="dropdown-container">
                    <FaBriefcase className="nav-icon" onClick={() => setBriefcaseDropdown(!briefcaseDropdown)} />
                    {briefcaseDropdown && (
                        <div className="dropdown-menu">
                            <Link to="/Internships" className="dropdown-item">Internships</Link>
                            <Link to="/hackathons" className="dropdown-item">Hackathons</Link>
                        </div>
                    )}
                </div>
                <Link to="/homechat" className="nav-icon"><FaComments className="nav-icon" /></Link>
               
               <Link to="/notifications" ><FaBell className="nav-icon" /></Link>

                {/* Profile Menu */}
                <div className="profile-menu" onClick={() => setMenuOpen(!menuOpen)}>
                    <FaUser className="nav-icon" />
                    {menuOpen && (
                        <div className="dropdown-menu">
                            <Link to="/view-Profile" className="dropdown-item">My Profile</Link>
                            <p>Settings</p>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
