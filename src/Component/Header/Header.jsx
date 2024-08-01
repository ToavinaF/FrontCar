import React, { useEffect, useState } from 'react';
import './Header.scss';
import axios from 'axios';
import { FaCommentDots, FaRegUser } from "react-icons/fa";
import { IoIosNotifications, IoIosSearch } from "react-icons/io";
import { CiLogout } from 'react-icons/ci';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Recherche from './Recherche';

const Header = ({ activepage, setActivePage, setSearchTerm }) => {
    const [Active, setActive] = useState(null);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const image = localStorage.getItem('photo');
    const name = localStorage.getItem('userName');
    const role = localStorage.getItem('role');
    const [allCar, setViewCar] = useState([]);

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

    return (
        <header>
            <div className="text_logo">
                <h1>{t(activepage)}</h1>
            </div>
            <div className="left_cont">
                <div className="search">
                    <IoIosSearch className='iconSearch' />
                    <Recherche placeholder={t('Search here...')} data={allCar} setSearchTerm={setSearchTerm} />
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
                    <img src={'http://127.0.0.1:8000/storage/' + image || 'default-profile.png'} alt="Profile" />
                    <div className="cont_prof" onClick={() => handleClick(0)}>
                        <h1>{name}</h1>
                        <p>{role}</p>
                    </div>
                    <div className={`sub-menu ${Active === 0 ? 'active' : ''}`}>
                        <div className="menu">
                            <li>
                                <NavLink to={'/Home/Profile'} onClick={() => setActivePage('Profile')}>
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
