import React from 'react'
import SideBar from '../SideBar/SideBar'
import Header from '../Header/Header'
import Profil from '../Profil/Profil'
import AllUser from '../user/AllUser'
import AddUser from '../user/AddUser'
import EditUser from '../user/EditUser'
import { Routes, Route } from 'react-router-dom'; // Importer Routes et Route

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

                    <h1>Ato le miasa eh</h1>
                    <Routes>
                        <Route path="/" element={<AllUser />} />
                        <Route path="/editUser/:id" element={<EditUser />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default Home;
