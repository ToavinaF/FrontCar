import React from 'react'
import SideBar from '../SideBar/SideBar'
import Header from '../Header/Header'
// import Dashboard from '../Page/Dashboard/Dashboard'
// import Profil from '../Profil/Profil'

import Addcar from '../AddCar/Addcar'
import ListCar from '../listCar/listCar'
import DeatilCar from '../DetailCar/DeatilCar'
import Reservation from '../Reservation/Reservation'
import { Route, Routes } from 'react-router-dom'
const Home = () => {
    return (
        <div>
            <div className='content-fluid'>
                <div className='head_content'>
                    <SideBar />
                    <Header />
                </div>
                <div className="content">
                    {/* <Dashboard/> */}
                    {/* <Profil/> */}
                     {/* <Addcar/> */}
                     {/* <ListCar/> */}
                     {/* <DeatilCar/> */}
                     {/* <Reservation/> */}
                     <Routes>
                        <Route>

                        </Route>
                     </Routes>

                </div>
            </div>
        </div>
    )
}

export default Home