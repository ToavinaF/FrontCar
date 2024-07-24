import React from 'react'
import SideBar from '../SideBar/SideBar'
import Header from '../Header/Header'
import Profil from '../Profil/Profil'
import AllUser from '../user/AllUser'
import AddUser from '../user/AddUser'
import EditUser from '../user/EditUser'
import { Routes, Route } from 'react-router-dom'; // Importer Routes et Route

const Home = () => {
    return (
        <div>
            <div className='content-fluid'>
                <div className='head_content'>
                    <SideBar />
                    <Header />
                </div>
                <div className="content">

                    <Routes>
                        <Route path="/" element={<AllUser />} />
                        <Route path="/editUser/:id" element={<EditUser />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default Home