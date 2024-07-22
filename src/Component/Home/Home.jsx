import React from 'react'
import SideBar from '../SideBar/SideBar'
import Header from '../Header/Header'
import Addcar from '../AddCar/Addcar'
import ListCar from '../listCar/listCar'
const Home = () => {
    return (
        <div>
            <div className='content-fluid'>
                <div className='head_content'>
                    <SideBar />
                    <Header />
                </div>
                <div className="content">
                     <Addcar/>
                     {/* <ListCar/> */}
                </div>
            </div>
        </div>
    )
}

export default Home