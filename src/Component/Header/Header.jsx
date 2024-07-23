import React, { useState } from 'react'
import './Header.scss'
import { FaInbox, FaCommentDots } from "react-icons/fa";
import { IoIosNotifications, IoIosSearch } from "react-icons/io";
import Image from "../../assets/46.jpg";
import { FaRegUser } from "react-icons/fa";
import { CiLogout } from 'react-icons/ci';
import { NavLink } from 'react-router-dom';
const Header = ({activepage}) => {
    const [Active, setActive] = useState(null);

    const handleClick = (index)=>{
        setActive(Active === index ? null : index);
    }

    return (
        <header>
            <div className="text_logo">
                <h1>{activepage}</h1>
            </div>
            <div className="left_cont">
                <div className="search">
                    <IoIosSearch className='iconSearch' />
                    <input type="search" placeholder='Search here...' />
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
                    <div className="cont_prof"  onClick={()=>handleClick(0)}>
                        <h1>Jhon Doe</h1>
                        <p>Super Admin</p>
                    </div>
                    <div className={`sub-menu ${Active === 0 ? 'active' : ''}`}>
                        <div className="menu">
                            <li><NavLink to={'/Profile'}><FaRegUser className='icon'/> Profile</NavLink></li>
                            <li><CiLogout className='icon'/> Logout</li>
                        </div>
                    </div>

                </div>

            </div>

        </header>
    )
}

export default Header