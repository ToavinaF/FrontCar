import React, { useState } from 'react';
import SideBar from '../SideBar/SideBar';
import Header from '../Header/Header';
import Router from '../Rout/Router';
import '../Page/Dashboard/Dashboard.scss'; // Importation du style pour Dashboard si nécessaire
import '../Profil/Profil.scss'; // Importation du style pour Profil si nécessaire

const Home = () => {
    const [activePage, setActivePage] = useState('Dashboard');

    return (
        <div>
            <div className='content-fluid'>
                <div className='head_content'>
                    <SideBar setActivePage={setActivePage} />
                    <Header activepage={activePage} />
                </div>
                <div className="content">
                    <Router />
                </div>
            </div>
        </div>
    );
}

export default Home;
