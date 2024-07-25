import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Car from './Car/Car';
import CarChart from './Chart/CarChart';
import Chart from './Chart/Chart';

import Count from './count/Count';
import './Dashboard.scss'
import Skills from './Skills/Skills';
import Utilisateur from './Utilisateur/Utilisateur';
import axios from 'axios';

const Dashboard = () => {
    const { t } = useTranslation();


    const [Vehicule, SetVehicule] = useState([]);
    const [User, SetUser] = useState([]);
    console.log(Vehicule);
    useEffect(() => {
      fetchData();
    }, [])
    const fetchData = async () => {
      try {
        const vehicul = await axios.get("http://127.0.0.1:8000/api/ViewCar")
        SetVehicule(vehicul.data.vehicules);
        const UserAll = await axios.get("http://127.0.0.1:8000/api/users")
        SetUser(UserAll.data);
        console.log(UserAll.data);
      } catch (error) {
        console.log("verifier le code");
      }
    }

    // console.log(User);
    return (
        <div className='content-dash'>
            <div className='dash__cards'>
                <Count />
            </div>
            <div className='statics'>
                <div className='stats'>
                    <h3 className='stats__titre'><span> {t('Statistiques de client par semaine')} </span> </h3>
                    <CarChart/>
                </div>
                <div className='statiq'>
                    <div className='stats'>
                        <h3 className='stats__titre'><span>{t('Statiques de reservation par semaine')}</span> </h3>
                        <Chart />
                    </div>
                </div>
                
            </div>
            <div className="recommend__car__wrapper">
                <Car Vehicule={Vehicule}/>
                <Utilisateur User={User}/>
            </div>
            
        </div>
    )
}

export default Dashboard
