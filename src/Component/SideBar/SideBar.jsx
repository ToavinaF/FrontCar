import React, { useState, useEffect } from 'react';
import './SideBar.scss';
import { IoCarSport } from 'react-icons/io5';
import { MdDashboard } from 'react-icons/md';
import { FaChevronDown, FaCar, FaUser } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import i18next from 'i18next';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

const languages = [
    { code: 'fr', name: 'Français', country_code: 'fr' },
    { code: 'en', name: 'English', country_code: 'gb' }
];

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
                                <NavLink className='nav_item' to='/Home/listcar' onClick={() => setActivePage('All Car')}>
                                    {t('all_car')}
                                </NavLink>
                            </li>
                            <li className='nav_link'>
                                <NavLink to='/Home/addcar' className='nav_item' onClick={() => setActivePage('Add Car')}>
                                    {t('add_car')}
                                </NavLink>
                            </li>
                            <li className='nav_link'>
                                <NavLink to='/Home/Historique' className='nav_item' onClick={() => setActivePage('Historiques')}>
                                    {t('Historique')}
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
                                    {t('all_users')}
                                </NavLink>
                            </li>
                            {role === 'superAdmin' && ( // Correction ici
                                <li className='nav_link'>
                                    <NavLink to='/Home/AjoutUser' className='nav_item' onClick={() => setActivePage('Add User')}>
                                        {t('add_user')}
                                    </NavLink>
                                </li>
                            )}
                        </div>
                    </div>

                    <div className='li-dash'>
                        <div className='btn-lang'>
                            {languages.map(({ code, name, country_code }) => (
                                <div key={country_code}>
                                    <button
                                        onClick={() => handleLanguageChange(code)}
                                        disabled={code === currentLanguageCode}
                                    >
                                        <span
                                            className={`flag-icon flag-icon-${country_code}`}
                                            style={{ opacity: code === currentLanguageCode ? 0.5 : 1 }}
                                        ></span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </ul>
            </div>
        </div>
    );
};

export default SideBar;
