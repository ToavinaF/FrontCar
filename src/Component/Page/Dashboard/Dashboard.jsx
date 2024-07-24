import React from 'react'
import { useTranslation } from 'react-i18next';
import Car from './Car/Car';
import CarChart from './Chart/CarChart';
import Chart from './Chart/Chart';

import Count from './count/Count';
import './Dashboard.scss'
import Skills from './Skills/Skills';
import Utilisateur from './Utilisateur/Utilisateur';

const Dashboard = () => {
    const { t } = useTranslation();

    return (
        <div className='content-dash'>
            <div className='dash__cards'>
                <Count />
            </div>
            <div className='statics'>
                <div className='stats'>
                    <h3 className='stats__titre'>{t('Statistiques de client par semaine')}</h3>
                    <CarChart/>
                </div>
                <div className='statiq'>
                    <div className='stats'>
                        <h3 className='stats__titre'>{t('Statiques de reservation par semaine')}</h3>
                        <Chart />
                    </div>
                </div>
                
            </div>
            <div className="recommend__car__wrapper">
                <Car/>
                <Utilisateur/>
            </div>
            
        </div>
    )
}

export default Dashboard
