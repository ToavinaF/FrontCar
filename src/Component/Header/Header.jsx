import React, {useEffect, useState } from 'react';
import './Header.scss';
import axios from 'axios';
import { FaCommentDots, FaRegUser } from "react-icons/fa";
import { IoIosNotifications, IoIosSearch } from "react-icons/io";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { CiLogout } from 'react-icons/ci';
import { Await, Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GrLanguage } from "react-icons/gr";
import ApiService from '../../axiosConfig';
import { toast } from 'react-toastify';
import { Breadcrumbs } from '@mui/material';
import { Typography } from 'antd';
import i18next from 'i18next';



const Header = ({ activepage, setSearchTerm, searchTerm, setResultSearch,setloader }) => {
    const [Active, setActive] = useState(null);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const image = localStorage.getItem('photo');
    const name = localStorage.getItem('userName');
    const role = localStorage.getItem('role');
    const id = localStorage.getItem('id');
    const [Activelang, setActivelang] = useState('EN');
    const path = window.location.pathname;
    // console.log(path);

    const handleClick = (index) => {
        setActive(Active === index ? null : index);
    };

    const handleLogout = async () => {
        try {
            const response = await ApiService.post('/logout');
            localStorage.clear();
            navigate('/');
            toast.success(response.data.message);
        }
        catch (error) {
            console.error('Erreur lors de la deconnexion', error);
            toast.error('Erreur lors de la deconnexion');
        }

    };

    // recherche start
    
    const [Recherche, SetRecherche] = useState({ Keyword: '' });
    const [timeoutId, SetTimeoutId] = useState(null);
    useEffect(() => {
        if(timeoutId) {
            clearTimeout(timeoutId);
        }
        if(Recherche.Keyword.trim() === ''){
            setloader(false);
            setResultSearch(null);
            if (path === '/Home/search') {
                navigate('/Home');
            }
            return
        }else{
            setloader(true);
            const newtimeout = setTimeout(()=>{
                fetchData();
            },1000);
            SetTimeoutId(newtimeout);
        }
        return ()=>clearTimeout(timeoutId);
    }, [Recherche, path]);
    
    const fetchData = async () => {
        try {
            const response = await ApiService.post(`/recherche`, Recherche);
            if (path === '/Home' || path === '/home') {
                navigate(`/Home/search`, {
                    state: {
                        results: response.data.result,
                        results1: response.data.result1,
                        results2: response.data.result2,
                        results3: response.data.result3
                    }
                });
            } else if (path === '/Home/listcar') {
                setResultSearch(response.data.result);
            } else if (path === '/Home/Historique') {
                setResultSearch(response.data.result1);
            } else if (path === '/Home/listUser') {
                setResultSearch(response.data.result2);
            } else if (path === '/Home/ListClients') {
                setResultSearch(response.data.result3);
            }
        } catch (error) {
            console.error('Vérifiez le code', error);
        } finally {
            setloader(false);
        }
    };
    
    
    const handleChange = (event) => {
        setSearchTerm(event.target.value);
        SetRecherche((prevRecherche) => ({
            ...prevRecherche,
            [event.target.name]: event.target.value
        }));
    };


    // Recherche End

    // notification par nouvelle reservation
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await ApiService.get(`/notifications`);
                setNotifications(response.data);

            } catch (error) {
                console.error('Erreur lors de la récupération des notifications:', error);
            }
        };
        fetchNotifications();
        const intervalId = setInterval(fetchNotifications, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const handleNotificationClick = async (notificationId) => {
        // Marquer la notification comme lue
        try {
            await ApiService.post(`/notifications/${notificationId}/read`);

            // Mettre à jour l'état local pour refléter le changement
            setNotifications(prevNotifications =>
                prevNotifications.map(notification =>
                    notifications.id === notificationId
                        ? { ...notifications, is_read: true }
                        : notifications
                )
            );
            navigate('/Home/Historique')
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la notification:', error);
        }

        // Afficher ou masquer les notifications
        setShowNotifications(!showNotifications);
    };

    // change language
    const handleLanguageChange = (code) => {
        i18next.changeLanguage(code);
        Cookies.set('i18next', code);
        // console.log('Language changed to:', code);
    }
    return (
        <header>
            <div className="text_logo">
                <Breadcrumbs
                    separator=""
                    aria-label="breadcrumb"
                >
                    <Typography color="textPrimary"><h1>{activepage}</h1></Typography>
                </Breadcrumbs>
            </div>
            <div className="left_cont">
                <div className="search">
                    <IoIosSearch className='iconSearch' />
                    <div className="recherche-container">
                        <input
                            type='text'
                            placeholder="Search here..."
                            onChange={handleChange}
                            value={searchTerm}
                            name="Keyword"
                        />
                    </div>
                </div>
                <div className="icon_head">
                    {/* <div>
                        <span>5</span>
                        <FaCommentDots className='icon' />
                    </div> */}
                    <div>
                        <span>{notifications.length}</span>
                        <IoIosNotifications className='icon' onClick={() => handleNotificationClick(notifications.id)} />
                        {showNotifications && (
                            <div className="notifications-box">
                                {notifications.length > 0 ? (
                                    notifications.map((notification, index) => (
                                        <div
                                            key={index}
                                            className={`notification-item ${notification.is_read ? 'read' : ''}`}
                                            onClick={() => handleNotificationClick(notification.id)}
                                        >
                                            {console.log(notification.message.trim())}
                                            {notification.message.trim() === "nouveau client enregistre" ? (
                                                <FaRegUser className='notifUser' />
                                            ) : (
                                                <MdOutlineNotificationsActive className='notif' />
                                            )}
                                            <div className="detailNotif">
                                                <h1>{notification.message}</h1>
                                                <p>{new Date(notification.created_at).toLocaleString()}</p>
                                            </div>

                                        </div>
                                    ))
                                ) : (
                                    <p>Aucune notification</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="profil_show">
                    <img src={`http://127.0.0.1:8000/api/viewimage/${image}` || 'default-profile.png'} alt="Profile" />
                    <div className="cont-prof" onClick={() => handleClick(0)}>
                        <h1 className='nametitle'>{name}</h1>
                        <p className='prole'>{role}</p>
                    </div>
                    <div className={`sub-menu ${Active === 0 ? 'active' : ''}`}>
                        <div className="menu">
                            <li>
                                <NavLink to={'/Home/editUser/' + id}>
                                    <FaRegUser className='icon' /> {t('Profile')}
                                </NavLink>
                            </li>
                            <li onClick={handleLogout}>
                                <CiLogout className='icon' /> {t('Logout')}
                            </li>
                        </div>
                    </div>
                </div>
                <div className="language">
                    <div className="iclan" onClick={() => handleClick(1)}>
                        <GrLanguage className={`lgchange ${Active === 1 ? 'active' : ''}`} />
                        <p className='pchang'>{t('EN')}</p>
                    </div>
                    <ul className={`listlang ${Active === 1 ? 'active' : ''}`}>
                        <li><button className='flag-icon'
                            onClick={() => handleLanguageChange('fr')}
                            title='Français'>
                            FR
                        </button></li>
                        <li><button className='flag-icon'
                            onClick={() => handleLanguageChange('en')}
                            title='English'>
                            EN
                        </button></li>
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Header;
