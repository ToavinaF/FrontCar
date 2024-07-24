import React from 'react'
import SideBar from '../SideBar/SideBar'
import Header from '../Header/Header'
import Profil from '../Profil/Profil'
import AllUser from '../user/AllUser'
import AddUser from '../user/AddUser'
import EditUser from '../user/EditUser'

import Addcar from '../AddCar/Addcar'
import ListCar from '../listCar/listCar'
import DeatilCar from '../DetailCar/DeatilCar'

import { Route, Routes } from 'react-router-dom'
import Reservation from '../Reservation/Reservation'
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
                        <Route path="/" element={<ListCar/>} />
                        <Route path="/detail" element={<DeatilCar/>} />
                        <Route path="/reservation" element={<Reservation/>} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default Home