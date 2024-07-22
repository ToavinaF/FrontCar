import React, { useState } from 'react';
import './SideBar.scss';
import { IoCarSport } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { FaChevronDown } from 'react-icons/fa';
import { FaCableCar, FaUserLarge } from "react-icons/fa6";

const SideBar = () => {
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
                    <div className='li-dash'>
                        <MdDashboard className='icon-dash' />
                        <p>Dashboard</p>
                    </div>
                    
                    <div className='li-dash'>
                        <FaCableCar className='icon-dash' />
                        <p>
                            Car <FaChevronDown className={`down ${activeDropdown === 0 ? 'active' : ''}`} onClick={() => handleDropdownClick(0)} />
                        </p>
                        <div className={`dropDown ${activeDropdown === 0 ? 'active' : ''}`}>
                            <li className='nav_link'><a href="" className='nav_item'>All Car</a></li>
                            <li className='nav_link'><a href="" className='nav_item'>Add Car</a></li>
                        </div>
                    </div>

                    <div className='li-dash'>
                        <FaUserLarge className='icon-dash' />
                        <p>
                            User <FaChevronDown className={`down ${activeDropdown === 1 ? 'active' : ''}`} onClick={() => handleDropdownClick(1)} />
                        </p>
                        <div className={`dropDown ${activeDropdown === 1 ? 'active' : ''}`}>
                            <li className='nav_link'><a href="" className='nav_item'>All Users</a></li>
                            <li className='nav_link'><a href="" className='nav_item'>Add User</a></li>
                        </div>
                    </div>
                </ul>
            </div>
        </div>
    );
}

export default SideBar;
