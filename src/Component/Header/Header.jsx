import React, { useState } from 'react';
import './Header.scss';
import { FaCommentDots, FaRegUser } from "react-icons/fa";
import { IoIosNotifications, IoIosSearch } from "react-icons/io";
import { CiLogout } from 'react-icons/ci';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Image from "../../assets/46.jpg";

const Header = ({ activepage, setActivePage }) => {
    const [Active, setActive] = useState(null);
    const { t } = useTranslation();

    const handleClick = (index) => {
        setActive(Active === index ? null : index);
    };

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
                    <img src={Image} alt="" />
                    <div className="cont_prof" onClick={() => handleClick(0)}>
                        <h1>Jhon Doe</h1>
                        <p>Super Admin</p>
                    </div>
                    <div className={`sub-menu ${Active === 0 ? 'active' : ''}`}>
                        <div className="menu">
                            <li><NavLink to={'/Profile'} onClick={() => setActivePage('Profile')}><FaRegUser className='icon' /> {t('Profile')}</NavLink></li>
                            <li><CiLogout className='icon' /> {t('Logout')}</li>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
