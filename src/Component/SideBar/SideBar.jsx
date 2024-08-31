import React, { useState, useEffect } from 'react';
import './SideBar.scss';
import { IoCarSport } from 'react-icons/io5';
import {FaArchive, FaCar, FaCarAlt, FaChevronDown, FaUser, FaUsers } from 'react-icons/fa';
import { MdBuild, MdDashboard, MdDelete } from 'react-icons/md';
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
                    <NavLink to='/Home' className='li-dash' onClick={() => setActivePage('Dashboard')} >
                        <MdDashboard className={`icon-dash ${activeDropdown === '' ? 'active' : ''}`} onClick={() => handleDropdownClick('')}/>
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
                                <NavLink className={`nav_item `} to='/Home/listcar' onClick={() => setActivePage(`HomeAll > Car`)}>
                                    <FaCarAlt className='icon_list' /> {t('all car')}
                                </NavLink>
                            </li>
                            <li className='nav_link'>
                                <NavLink to='/Home/addcar' className='nav_item' onClick={() => setActivePage('Home > Add Car')}>
                                    <RiPlayListAddFill className='icon_list' /> {t('add car')}
                                </NavLink>
                            </li>
                            <li className='nav_link'>
                                <NavLink to='/Home/Historique' className='nav_item' onClick={() => setActivePage('Home > Historiques')}>
                                    <FaHistory  className='icon_list_histo'/> {t('Historique')}
                                </NavLink>
                            </li>
                        </div>
                    </div>

                    <div className='li-dash'>
                        <div>
                            <MdBuild className={`icon-dash ${activeDropdown === 3 ? 'active' : ''}`} onClick={() => handleDropdownClick(3)}/>
                            <p>
                                {t('Repair')} <FaChevronDown className={`down ${activeDropdown === 3 ? 'active' : ''}`} />
                            </p>
                        </div>
                        <div className={`dropDown ${activeDropdown === 3 ? 'active' : ''}`}>
                            <li className='nav_link'>
                                <NavLink className={`nav_item `} to='/Home/listcar' onClick={() => setActivePage(`HomeAll > Repair`)}>
                                    <FaCarAlt className='icon_list' /> {t('all car')}
                                </NavLink>
                            </li>
                            <li className='nav_link'>
                                <NavLink to='/Home/addcar' className='nav_item' onClick={() => setActivePage('Home > Add Car')}>
                                    <RiPlayListAddFill className='icon_list' /> {t('add car')}
                                </NavLink>
                            </li>
                            <li className='nav_link'>
                                <NavLink to='/Home/Historique' className='nav_item' onClick={() => setActivePage('Home > Historiques')}>
                                    <FaHistory  className='icon_list_histo'/> {t('Historique')}
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
                                <NavLink to='/Home/listUser' className='nav_item' onClick={() => setActivePage('Home > All Users')}>
                                    <FaUsers className='icon_list'/> {t('all_users')}
                                </NavLink>
                            </li>
                            {role === 'superAdmin' && (
                                <li className='nav_link'>
                                    <NavLink to='/Home/AjoutUser' className='nav_item' onClick={() => setActivePage('Home > Add User')}>
                                        <FaUserPlus className='icon_list'/> {t('add_user')}
                                    </NavLink>
                                </li>
                            )}
                            <li className='nav_link'>
                                    <NavLink to='/Home/ListClients' className='nav_item' onClick={() => setActivePage('Home > All clients')}>
                                        <PiUserListFill className='icon_list'/> {t('All-Clients')}
                                    </NavLink>
                                </li>
                                <li className='nav_link'>
                                    <NavLink to='/Home/UsersDelete' className='nav_item' onClick={() => setActivePage('Home > delete')}>
                                        <RiDeleteBin6Line  className='icon_list_histo'/> {t('All-delete')}
                                    </NavLink>
                                </li>
                        </div>
                    </div>

                    <NavLink to='/Home/ArchiveCar' className='li-dash' onClick={() => setActivePage('Home > Corbeille')}>
                        <RiDeleteBin6Line className={`icon-dash ${activeDropdown === 2 ? 'active' : ''}`} onClick={() => handleDropdownClick(2)} />
                        <p>{t('Corbeille')}</p>
                    </NavLink>
                </ul>
            </div>
        </div>
    );
};

export default SideBar;
