import React, { useState } from 'react';
import './SideBar.scss';
import { IoCarSport } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { FaChevronDown } from 'react-icons/fa';
import { FaCableCar, FaUserLarge } from "react-icons/fa6";
import { NavLink } from 'react-router-dom';

const SideBar = ({ setActivePage }) => {
    const [activeDropdown, setActiveDropdown] = useState(null);

    const handleDropdownClick = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    return (
        <div className='SideBar'>
            <div className="logo">
                <IoCarSport className='icon_logo' />
            </div>

            <div className="navlink">
                <ul>
                    
                        <NavLink to='/dashboard' className='li-dash' onClick={() => setActivePage('Dashboard')}>
                            <MdDashboard className='icon-dash' />
                            <p>Dashboard</p>
                        </NavLink>
                    

                    <li className='li-dash'>
                        <div onClick={() => handleDropdownClick(0)}>
                            <FaCableCar className={`icon-dash ${activeDropdown === 0 ? 'active' : ''}`} />
                            <p>
                                Car <FaChevronDown className={`down ${activeDropdown === 0 ? 'active' : ''}`} />
                            </p>
                        </div>
                        <div className={`dropDown ${activeDropdown === 0 ? 'active' : ''}`}>
                            <li className='nav_link'><NavLink  className='nav_item' onClick={() => setActivePage('All Car')}>All Car</NavLink></li>
                            <li className='nav_link'><a href="#" className='nav_item' onClick={() => setActivePage('Add Car')}>Add Car</a></li>
                        </div>
                    </li>

                    <li className='li-dash'>
                        <div onClick={() => handleDropdownClick(1)}>
                            <FaUserLarge className={`icon-dash ${activeDropdown === 1 ? 'active' : ''}`} />
                            <p>
                                User <FaChevronDown className={`down ${activeDropdown === 1 ? 'active' : ''}`} />
                            </p>
                        </div>
                        <div className={`dropDown ${activeDropdown === 1 ? 'active' : ''}`}>
                            <li className='nav_link'><a href="#" className='nav_item' onClick={() => setActivePage('All Users')}>All Users</a></li>
                            <li className='nav_link'><a href="#" className='nav_item' onClick={() => setActivePage('Add User')}>Add User</a></li>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default SideBar;
