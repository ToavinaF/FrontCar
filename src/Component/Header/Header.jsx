import React from 'react'
import './Header.scss'
import { FaInbox } from "react-icons/fa";
import { IoIosNotifications, IoIosSearch } from "react-icons/io";
import Image from "../../assets/46.jpg";
const Header = () => {
    return (
        <header>
            <div className="text_logo">
                <h1>Dashboard</h1>
            </div>
            <div className="left_cont">
                <div className="search">
                    <IoIosSearch className='iconSearch' />
                    <input type="search" placeholder='Search here...' />
                </div>
                <div className="icon_head">
                    <div>
                        <span>5</span>
                        <FaInbox className='icon' />
                    </div>
                    <div>
                        <span>2</span>
                        <IoIosNotifications className='icon' />
                    </div>
                </div>
                <div className="profil_show">
                    <img src={Image} alt="" />
                    <div className="cont_prof">
                        <h1>Jhon Doe</h1>
                        <p>Super Admin</p>
                    </div>
                </div>
            </div>

        </header>
    )
}

export default Header