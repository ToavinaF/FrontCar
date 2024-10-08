import React, { useEffect, useState } from 'react';
import './Header.scss';
import axios from 'axios';
import { FaCommentDots, FaRegUser } from "react-icons/fa";
import { IoIosNotifications, IoIosSearch } from "react-icons/io";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { CiLogout } from 'react-icons/ci';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Header = ({ activepage, setActivePage }) => {
    const [Active, setActive] = useState(null);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const image = localStorage.getItem('photo');
    const name = localStorage.getItem('userName');
    const role = localStorage.getItem('role');
    const id = localStorage.getItem('id');

    const handleClick = (index) => {
        setActive(Active === index ? null : index);
    };

    const handleLogout = async () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userFirstname');
        localStorage.removeItem('email');
        localStorage.removeItem('Role');
        localStorage.removeItem('Job');
        localStorage.removeItem('contact');

        navigate('/');
    };

    useEffect(() => {
        const getCars = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/ViewCar");
                setViewCar(response.data.vehicules); // Ajustez le chemin selon votre réponse API
            } catch (error) {
                console.error('Erreur lors de la récupération des voitures:', error);
            }
        };
        getCars();
    }, []);

    const [Recherche, SetRecherche] = useState({ Keyword: '' });
    useEffect(() => {
        const fetchData = async () => {
            if (Recherche.Keyword.trim() === '') {
                navigate('/Home')
                return;
            }
            try {
                const response = await axios.post(`http://127.0.0.1:8000/api/recherche`, Recherche);
                navigate(`/Home/search?keyword=${Recherche.Keyword}`, { state: { results: response.data.result, results1: response.data.result1 } });
            } catch (error) {
                console.log('Vérifiez le code', error);
            }
        };
        fetchData();
    }, [Recherche]);

    const handleSearch = (e) => {
        SetRecherche((prevRecherche) => ({
            ...prevRecherche,
            [e.target.name]: e.target.value
        }));
    };

    // notification par nouvelle reservation
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/notifications');
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
            await axios.post(`http://127.0.0.1:8000/api/notifications/${notificationId}/read`);

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
    return (
        <header>
            <div className="text_logo">
                <h1>{t(activepage)}</h1>
            </div>
            <div className="left_cont">
                <div className="search">
                    <IoIosSearch className='iconSearch' />
                    <div className="recherche-container">
                        <input
                            type='text'
                            placeholder="Search here..."
                            onChange={handleSearch}
                            name="Keyword"
                        />
                    </div>
                </div>
                <div className="icon_head">
                    <div>
                        <span>5</span>
                        <FaCommentDots className='icon' />
                    </div>
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
                                                <FaRegUser  className='notifUser'/>
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
                    <img src={`http://127.0.0.1:8000/storage/${image}` || 'default-profile.png'} alt="Profile" />
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
            </div>
        </header>
    );
};

export default Header;
