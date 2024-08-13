import React, { useState, useEffect } from 'react';
import './SideBar.scss';
import { IoCarSport } from 'react-icons/io5';
import { MdDashboard } from 'react-icons/md';
import { FaChevronDown, FaCar, FaUser, FaUsers, FaCarAlt } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import i18next from 'i18next';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { RiPlayListAddFill } from "react-icons/ri";
import { PiUserListFill } from "react-icons/pi";
import { FaBars } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";

const languages = [
    { code: 'fr', name: 'Français', country_code: 'fr' },
    { code: 'en', name: 'English', country_code: 'gb' }
];
const role = localStorage.getItem('role');
console.log(role);
const SideBar = ({ setActivePage }) => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [role, setRole] = useState('');
    const { t } = useTranslation();
    const currentLanguageCode = Cookies.get('i18next') || 'en';

    useEffect(() => {
        // Récupérer le rôle depuis localStorage et mettre à jour l'état
        const storedRole = localStorage.getItem('role');
        if (storedRole) {
            setRole(storedRole);
        }
    }, []); // Le tableau vide [] signifie que ce useEffect s'exécute une seule fois après le premier rendu

    const handleDropdownClick = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const handleLanguageChange = (code) => {
        i18next.changeLanguage(code);
        Cookies.set('i18next', code);
        console.log('Language changed to:', code);
    };

    return (
        <div className='SideBar'>
            <div className="logo">
                <IoCarSport className='icon_logo' />
            </div>
            
            <div className="navlink">
                <ul>
                    <NavLink to='/Home' className='li-dash' onClick={() => setActivePage('Dashboard')}>
                        <MdDashboard className='icon-dash' />
                        <p>{t('dashboard')}</p>
                    </NavLink>

                    <div className='li-dash'>
                        <div onClick={() => handleDropdownClick(0)}>
                            <FaCar className={`icon-dash ${activeDropdown === 0 ? 'active' : ''}`} />
                            <p>
                                {t('car')} <FaChevronDown className={`down ${activeDropdown === 0 ? 'active' : ''}`} />
                            </p>
                        </div>
                        <div className={`dropDown ${activeDropdown === 0 ? 'active' : ''}`}>
                            <li className='nav_link'>
                                <NavLink className='nav_item' to='/Home/listcar' onClick={() => setActivePage('Home/All Car')}>
                                    <FaCarAlt className='icon_list' /> {t('all car')}
                                </NavLink>
                            </li>
                            <li className='nav_link'>
                                <NavLink to='/Home/addcar' className='nav_item' onClick={() => setActivePage('Home/Add Car')}>
                                    <RiPlayListAddFill className='icon_list' /> {t('add car')}
                                </NavLink>
                            </li>
                            <li className='nav_link'>
                                <NavLink to='/Home/Historique' className='nav_item' onClick={() => setActivePage('Home/Historiques')}>
                                    <FaHistory  className='icon_list'/> {t('Historique')}
                                </NavLink>
                            </li>
                        </div>
                    </div>

                    <div className='li-dash'>
                        <div onClick={() => handleDropdownClick(1)}>
                            <FaUser className={`icon-dash ${activeDropdown === 1 ? 'active' : ''}`} />
                            <p>
                                {t('user')} <FaChevronDown className={`down ${activeDropdown === 1 ? 'active' : ''}`} />
                            </p>
                        </div>
                        <div className={`dropDown ${activeDropdown === 1 ? 'active' : ''}`}>
                            <li className='nav_link'>
                                <NavLink to='/Home/listUser' className='nav_item' onClick={() => setActivePage('All Users')}>
                                    <FaUsers className='icon_list'/> {t('all_users')}
                                </NavLink>
                            </li>
                            {role === 'superAdmin' && ( // Correction ici
                                <li className='nav_link'>
                                    <NavLink to='/Home/AjoutUser' className='nav_item' onClick={() => setActivePage('Add User')}>
                                        <FaUserPlus className='icon_list'/> {t('add_user')}
                                    </NavLink>
                                </li>
                            )}
                            <li className='nav_link'>
                                    <NavLink to='/Home/ListClients' className='nav_item' onClick={() => setActivePage('All clients')}>
                                        <PiUserListFill className='icon_list'/> {t('All-Clients')}
                                    </NavLink>
                                </li>
                        </div>
                        
                    </div>

                   
                </ul>
            </div>
        </div>
    );
};

export default SideBar;
