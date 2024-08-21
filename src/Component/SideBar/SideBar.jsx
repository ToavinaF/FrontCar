import React, { useState, useEffect } from 'react';
import './SideBar.scss';
import { IoCarSport } from 'react-icons/io5';
import {FaArchive, FaCar, FaCarAlt, FaChevronDown, FaUser, FaUsers } from 'react-icons/fa';
import { MdDashboard, MdDelete } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import i18next from 'i18next';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { RiDeleteBin6Line, RiPlayListAddFill } from 'react-icons/ri';
import { PiUserListFill } from 'react-icons/pi';
import { FaBars } from 'react-icons/fa6';
import { FaHistory } from 'react-icons/fa';
import { FaUserPlus } from 'react-icons/fa';

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
    }, []);

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
                        <div>
                            <FaCar className={`icon-dash ${activeDropdown === 0 ? 'active' : ''}`} onClick={() => handleDropdownClick(0)}/>
                            <p>
                                {t('car')} <FaChevronDown className={`down ${activeDropdown === 0 ? 'active' : ''}`} />
                            </p>
                        </div>
                        <div className={`dropDown ${activeDropdown === 0 ? 'active' : ''}`}>
                            <li className='nav_link'>
                                <NavLink className={`nav_item `} to='/Home/listcar' onClick={() => setActivePage('Home>All Car')}>
                                    <FaCarAlt className='icon_list' /> {t('all car')}
                                </NavLink>
                            </li>
                            <li className='nav_link'>
                                <NavLink to='/Home/addcar' className='nav_item' onClick={() => setActivePage('Home Add Car')}>
                                    <RiPlayListAddFill className='icon_list' /> {t('add car')}
                                </NavLink>
                            </li>
                            <li className='nav_link'>
                                <NavLink to='/Home/Historique' className='nav_item' onClick={() => setActivePage('Home Historique')}>
                                    <FaHistory className='icon_list_histo'/> {t('Historique')}
                                </NavLink>
                            </li>
                            <li className='nav_link'>
                                <NavLink to='/Home/ArchiveCar' className='nav_item' onClick={() => setActivePage('Home>Archive')}>
                                    <RiDeleteBin6Line  className='icon_list_histo'/> {t('Corbeille')}
                                </NavLink>
                            </li>
                        </div>
                    </div>

                    <div className='li-dash'>
                        <div>
                            <FaUser className={`icon-dash ${activeDropdown === 1 ? 'active' : ''}`} onClick={() => handleDropdownClick(1)}/>
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
                            {role === 'superAdmin' && (
                                <li className='nav_link'>
                                    <NavLink to='/Home/AjoutUser' className='nav_item' onClick={() => setActivePage('Add User')}>
                                        <FaUserPlus className='icon_list'/> {t('add_user')}
                                    </NavLink>
                                </li>
                            )}
                            <li className='nav_link'>
                                <NavLink to='/Home/ListClients' className='nav_item' onClick={() => setActivePage('All Clients')}>
                                    <PiUserListFill className='icon_list'/> {t('All-Clients')}
                                </NavLink>
                            </li>
                            <li className='nav_link'>
                                <NavLink to='/Home/UsersDelete' className='nav_item' onClick={() => setActivePage('Home Delete')}>
                                    <MdDelete className='icon_list'/> {t('All-delete')}
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
