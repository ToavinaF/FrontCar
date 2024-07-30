import React, { useEffect, useState } from 'react';
import './Header.scss';
import axios from 'axios';

import { FaCommentDots, FaRegUser } from "react-icons/fa";
import { IoIosNotifications, IoIosSearch } from "react-icons/io";
import { CiLogout } from 'react-icons/ci';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Header = ({ activepage, setActivePage }) => {
    const [Active, setActive] = useState(null);
    const { t } = useTranslation();
    const {Navigate} = useNavigate();

    // Récupération des données depuis le localStorage
    const image = localStorage.getItem('photo');
    const name = localStorage.getItem('userName');
    const firstname = localStorage.getItem('Firstname'); // Assurez-vous que ce nom est correct
    const role = localStorage.getItem('role');
    const navigate = useNavigate();

    const handleClick = (index) => {
        setActive(Active === index ? null : index);
    };
    const handleLogout = async () => {
        
        // try {
        //     const response = await axios.post('http://127.0.0.1:8000/api/logout', {}, {
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        //         },
        //         withCredentials: true // Important pour gérer les credentials
        //     });
    
        //     if (response.status === 200 || response.status === 204) {
                
        //     }
        // } catch (error) {
        //     console.error('Erreur lors de la déconnexion:', error);
        // }
        // Supprimer les informations d'authentification du localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userFirstname');
        localStorage.removeItem('email');
        localStorage.removeItem('Role');
        localStorage.removeItem('Job');
        localStorage.removeItem('contact');

        // Rediriger l'utilisateur vers la page de connexion ou autre
        navigate('/login');
    };
    // const [count, setCount] = useState(5);
    // useEffect(() => {
    //     if (count <= 0) return; // Arrêter le compte à rebours lorsqu'il atteint 0
    //     const intervalId = setInterval(() => {
    //         setCount(prevCount => prevCount - 1);
    //     }, 1000);
    
    //     return () => clearInterval(intervalId); // Nettoyer l'intervalle à chaque re-rendu ou démontage
    // }, [count]); // Utiliser 'count' comme dépendance
    {/* <p className={`${count === 0 ? 'active' : '' }`}>{count}</p> */}

    

    return (
        <header>
            <div className="text_logo">
                <h1>{t(activepage)}</h1>
            </div>
            <div className="left_cont">
                <div className="search">
                    <IoIosSearch className='iconSearch' />
                    <input type="search" placeholder={t('Search here...')} />
                </div>
                <div className="icon_head">
                    <div>
                        <span>5</span>
                        <FaCommentDots className='icon' />
                    </div>
                    <div>
                        <span>2</span>
                        <IoIosNotifications className='icon' />
                    </div>
                </div>
                <div className="profil_show">
                    <img src={'http://127.0.0.1:8000/storage/photos/'+image || 'default-profile.png'} alt="Profile" /> {/* Utilisez une image par défaut si aucune image n'est disponible */}
                    <div className="cont_prof" onClick={() => handleClick(0)}>
                        <h1>{name}</h1>
                        <p>{role}</p>
                    </div>
                    <div className={`sub-menu ${Active === 0 ? 'active' : ''}`}>
                        <div className="menu">
                            <li><NavLink to={'/Home/Profile'} onClick={() => setActivePage('Profile')}><FaRegUser className='icon' /> {t('Profile')}</NavLink></li>
                            <li onClick={handleLogout}><CiLogout className='icon'  /> {t('Logout')}</li>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
