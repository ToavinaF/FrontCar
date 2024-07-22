import React from 'react'
import SideBar from '../SideBar/SideBar'
import Header from '../Header/Header'
import Dashboard from '../Page/Dashboard/Dashboard'
import Profil from '../Profil/Profil'

const Home = () => {
    return (
        <div>
            <div className='content-fluid'>
                <div className='head_content'>
                    <SideBar />
                    <Header />
                </div>
                <div className="content">
                    <Dashboard/>
                    {/* <Profil/> */}
                </div>
            </div>
        </div>
    )
}

export default Home