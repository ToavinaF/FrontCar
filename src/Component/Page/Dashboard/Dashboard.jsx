import React from 'react'
import Car from './Car/Car';
import CarChart from './Chart/CarChart';
import Chart from './Chart/Chart';

import Count from './count/Count';
import './Dashboard.scss'
import Skills from './Skills/Skills';

const Dashboard = () => {
    return (
        <div className='content-dash'>
            <div className='dash__cards'>
                <Count />
            </div>
            <div className='statics'>
                <div className='stats'>
                    <h3 className='stats__titre'>Statistiques de client par semaine</h3>
                    <CarChart/>
                </div>
                <div className='statiq'>
                    <div className='stats'>
                        <h3 className='stats__titre'>Statiques de reservation par semaine</h3>
                        <Chart />
                    </div>
                </div>
                
            </div>
            <div className="recommend__car__wrapper">
                <Car/>
            </div>
            
        </div>
    )
}

export default Dashboard
