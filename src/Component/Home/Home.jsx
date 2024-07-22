import React from 'react'
import SideBar from '../SideBar/SideBar'
import Header from '../Header/Header'
import AllUser from '../user/AllUser'

const Home = () => {
    return (
        <div>
            <div className='content-fluid'>
                <div className='head_content'>
                    <SideBar />
                    <Header />
                </div>
                <div className="content">
                    <h1>Ato le miasa eh</h1>
                    <AllUser/>
                </div>
            </div>
        </div>
    )
}

export default Home