import React, { useState } from 'react'
import SideBar from '../SideBar/SideBar'
import Header from '../Header/Header'
import Profil from '../Profil/Profil'
import AllUser from '../user/AllUser'
import AddUser from '../user/AddUser'
import EditUser from '../user/EditUser'
import ArchiveCar from '../ArchiveCar/ArchiveCar'
import UsersDelete from '../user/usersDelete'

import Addcar from '../AddCar/Addcar'
import ListCar from '../listCar/listCar'
import DeatilCar from '../DetailCar/DeatilCar'
import Historique from '../Historique/Historique'
import ListClients from '../Clients/ListClients'


import { Route, Routes } from 'react-router-dom'
import Reservation from '../Reservation/Reservation'
import ModifRes from '../Reservation/ModifRes'
import Dashboard from '../Page/Dashboard/Dashboard'
import ModifCar from '../ModifCar/ModifCar'
import Theme from '../Page/Themes/Theme'
import Galerie from '../Galerie/Galerie'
import Facture from '../Page/Facture/Facture'
import Recherche from '../Header/Recherche'
import Client from '../Clients/Client'
import Liste from '../Page/Facture/Liste'
import FactureContext from '../Page/Facture/FactureContext';

import DetailCarBreakdown from '../Repair/DetailCar/DetailCarBreakdown';
import ListCarBreakdown from '../Repair/listCar/listCarBreakdown';
import AddRepair from '../Repair/AddRepair';
import ListRepair from '../Repair/ListRepair';
import HistoriqueCarBreakdown from '../Repair/Historique/HistoriqueCarBreakdown'

const Home = () => {
    const [activePage, setActivePage] = useState('Dashboard');
    const [searchTerm, setSearchTerm] = useState("");
    const accesstoken = localStorage.getItem('accessToken');
    console.log(accesstoken)
    const handleChange=(event)=>{
        setSearchTerm(event.target.value);
    }
    return (
        <div>
            <div className='content-fluid'>
                <div className='head_content'>
                    <SideBar setActivePage={setActivePage}  />
                    <Header  activepage={activePage} searchTerm={searchTerm} onChange={handleChange}/>
                    <Theme/>
                </div>
                <div className="content">
                    
                    { <Routes>
                        <Route path='/dashboard' element={<Dashboard />} />
                        <Route path="/listcar" element={<ListCar searchTerm={searchTerm}/>} />
                        <Route path='/addcar' element={<Addcar />} />
                        <Route path='/Profile' element={<Profil />} />
                        <Route path='/listUser' element={<AllUser searchTerm={searchTerm}/>} />
                        <Route path="/AjoutUser" element={<AddUser />} />
                        <Route path="/ListClients" element={<ListClients/>} />
                        <Route path='/usersDelete' element={<UsersDelete/>}/>

                        <Route path="/detail/:id" element={<DeatilCar/>} />
                        <Route path="/reservation/:id" element={<Reservation/>} />
                        <Route path='/modifres/:id' element={<ModifRes/>}/>
                        <Route path="/modifCar/:id" element={<ModifCar/>} />
                        <Route path="/galerie/:id" element={<Galerie/>} />

                      
                        <Route path='/' element={<Dashboard/>}/>
                        <Route path='/search' element={<Recherche/>}/>
                        <Route path="/listcar" element={<ListCar/>} />
                        <Route path="/ArchiveCar" element={<ArchiveCar/>}/>
                        <Route path='/addcar' element={<Addcar/>}/>
                        <Route path="/detail" element={<DeatilCar/>} />
                        <Route path="/reservation" element={<Reservation/>} />
                        <Route path='/Profile' element={<Profil/>}/>
                        <Route path='/listUser' element={<AllUser/>}/>
                        <Route path='/Historique' element={<Historique searchTerm={searchTerm}/>}/>
                        <Route path='/EditUser/:id' element={<EditUser/>}/>

                        
                        <Route path="/AjoutUser" element={<AddUser/>}/>
                        <Route path='/facture/:id' element={<Facture/>}/>
                        <Route path='/facture/:facture.id' element={<Facture/>}/>
                        <Route path='/facturer/:id' element={<FactureContext/>}/>

                        <Route path='/client/:id' element={<Client/>}/>
                        <Route path='/factures/:id' element={<Liste/>}/>

                        <Route path="/list-car-breakdown" element={<ListRepair searchTerm={searchTerm}/>} />
                        <Route path='/add-car-breakdown' element={<AddRepair searchTerm={searchTerm}/>} />
                        <Route path="/add-car-breakdown/detail/:id" element={<DetailCarBreakdown type={0}/>} />
                        <Route path="/car-breakdown/detail/:id/:idMain" element={<DetailCarBreakdown type={1}/>} />
                        <Route path="/historique-car-breakdown" element={<HistoriqueCarBreakdown searchTerm={searchTerm}/>} />
                    </Routes> }


                </div>
            </div>
        </div>
    )
}

export default Home