import React, { useState } from 'react'
import SideBar from '../SideBar/SideBar'
import Header from '../Header/Header'
import Profil from '../Profil/Profil'
import AllUser from '../user/AllUser'
import AddUser from '../user/AddUser'
import EditUser from '../user/EditUser'

import Addcar from '../AddCar/Addcar'
import ListCar from '../listCar/listCar'
import DeatilCar from '../DetailCar/DeatilCar'
import Historique from '../Historique/Historique'


import { Route, Routes } from 'react-router-dom'
import Reservation from '../Reservation/Reservation'
import ModifRes from '../Reservation/ModifRes'
import Dashboard from '../Page/Dashboard/Dashboard'
import ModifCar from '../ModifCar/ModifCar'
import Theme from '../Page/Themes/Theme'
import Galerie from '../Galerie/Galerie'
import Facture from '../Page/Facture/Facture'
const Home = () => {
    const [activePage, setActivePage] = useState('Dashboard');
    const [searchTerm, setSearchTerm] = useState("");
    const accesstoken = localStorage.getItem('accessToken');
    console.log(accesstoken)
    return (
        <div>
            <div className='content-fluid'>
                <div className='head_content'>
                    <SideBar setActivePage={setActivePage}  />
                    <Header  activepage={activePage} setSearchTerm={setSearchTerm}/>
                    <Theme/>
                </div>
                <div className="content">
                    <Routes>
                        <Route path='/dashboard' element={<Dashboard />} />
                        <Route path="/listcar" element={<ListCar searchTerm={searchTerm}/>} />
                        <Route path='/addcar' element={<Addcar />} />
                        <Route path='/Profile' element={<Profil />} />
                        <Route path='/listUser' element={<AllUser searchTerm={searchTerm}/>} />
                        <Route path="/AjoutUser" element={<AddUser />} />
                        

                        <Route path="/detail/:id" element={<DeatilCar/>} />
                        <Route path="/reservation/:id" element={<Reservation/>} />
                        <Route path='/modifres/:id' element={<ModifRes/>}/>
                        <Route path="/modifCar/:id" element={<ModifCar/>} />
                        <Route path="/galerie/:id" element={<Galerie/>} />

                      
                        <Route path='/' element={<Dashboard/>}/>
                        <Route path="/listcar" element={<ListCar/>} />
                        <Route path='/addcar' element={<Addcar/>}/>
                        <Route path="/detail" element={<DeatilCar/>} />
                        <Route path="/reservation" element={<Reservation/>} />
                        <Route path='/Profile' element={<Profil/>}/>
                        <Route path='/listUser' element={<AllUser/>}/>
                        <Route path='/Historique' element={<Historique searchTerm={searchTerm}/>}/>
                        <Route path='/EditUser/:id' element={<EditUser/>}/>
                        
                        <Route path="/AjoutUser" element={<AddUser/>}/>
                        <Route path='/Facture' element={<Facture/>}/>
                    </Routes>


                </div>
            </div>
        </div>
    )
}

export default Home