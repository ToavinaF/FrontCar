import React from 'react'
import './DetailCar.scss'
import { FaCalendarAlt, FaMoneyBillAlt, FaUser } from 'react-icons/fa'
import { BsFillSuitcase2Fill } from "react-icons/bs"
import { GiCarDoor } from "react-icons/gi";
import { TbManualGearboxFilled } from "react-icons/tb";
import Sary from '../../assets/saert.jpeg'
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';




const DeatilCar = () => {
  const { t } = useTranslation();

  return (
    <div className='contDetail'>
      <div className='blockLeft'>
        <img src={Sary} alt="" />
      </div>
      <div className='blockRight'>
        <h1>Audi R8</h1>
        <div className="IconType">
          <div className="icon">
            <FaUser className='iconImg' />
            <h1>{t('Nombre de place')}</h1>
          </div>
          <h1>3</h1>
        </div>
        <div className="IconType">
          <div className="icon">
            <BsFillSuitcase2Fill className='iconImg' />
            <h1>{t('Nombre de bagage')}</h1>
          </div>
          <h1>2</h1>
        </div>
        <div className="IconType">
          <div className="icon">
            <GiCarDoor className='iconImg' />
            <h1>{t('Nombre de porte')}</h1>
          </div>
          <h1>5</h1>
        </div>
        <div className="IconType">
          <div className="icon">
            <TbManualGearboxFilled className='iconImg' />
            <h1>{t('Boite de vitesse')}</h1>
          </div>
          <h1>{t('Automatique')}</h1>
        </div>
        <h1>30.000{t('Ar/jrs')}</h1>
        <NavLink className='btn' to='/reservation'><FaCalendarAlt className='ico' />{t('Reservation')}</NavLink>
      </div>
    </div>
  )
}

export default DeatilCar
