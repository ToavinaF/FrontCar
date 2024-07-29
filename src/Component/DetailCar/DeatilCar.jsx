import React, { useEffect, useState } from 'react'
import './DetailCar.scss'
import { FaCalendarAlt, FaMoneyBillAlt, FaUser } from 'react-icons/fa'
import { BsFillSuitcase2Fill } from "react-icons/bs"
import { GiCarDoor } from "react-icons/gi";
import { TbManualGearboxFilled } from "react-icons/tb";
import Sary from '../../assets/saert.jpeg'
import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';

import { useTranslation } from 'react-i18next';




const DeatilCar = () => {
  const {id}=useParams();
  const [CarDetail, setCarDetail]=useState([]);
  const [Galerie, setGalerie] = useState([]);

  const fetchCar = async () => {
    try {
      const list = await axios.get('http://127.0.0.1:8000/api/detail/'+ id);
      console.log(list.data.detailCar);
      setCarDetail(list.data.detailCar)
    } catch (error) {
      console.error(error);
    }
  }

  const fetchGal = async () => {
    try {
        const galView = await axios.get("http://127.0.0.1:8000/api/viewGalerie/" + id);
        setGalerie(galView.data.galerie);
        console.log(galView.data.galerie);
    } catch (error) {
        console.log("Verifier le code");
    }
}
  useEffect(()=>{
    fetchCar();
    fetchGal();
  },[id])

  const { t } = useTranslation();

  return (
    <div className='contDetail'>
      <div className='blockLeft'>
      <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={5}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: false }}
      onSwiper={(swiper) => console.log(swiper)}
      onSlideChange={() => console.log('slide change')}
    >
      {Galerie.map((view, index) => (

          <SwiperSlide key={index}>
            <div className="boucle">
            <img src={`http://127.0.0.1:8000/storage/GalerieVehicule/${view.image}`} alt={`Galerie image ${index}`} />
            </div>
        </SwiperSlide>
        
           
          ))}
      
    </Swiper>


      </div>
      <div className='blockRight'>
        <h1>{CarDetail.marque}</h1>
        <div className="IconType">
          <div className="icon">
            <FaUser className='iconImg' />
            <h1>{t('Nombre de place')}</h1>
          </div>
          <h1>{CarDetail.place}</h1>
        </div>
        <div className="IconType">
          <div className="icon">
            <BsFillSuitcase2Fill className='iconImg' />
            <h1>{t('Nombre de bagage')}</h1>
          </div>
          <h1>{CarDetail.bagage}</h1>
        </div>
        <div className="IconType">
          <div className="icon">
            <GiCarDoor className='iconImg' />
            <h1>{t('Nombre de porte')}</h1>
          </div>
          <h1>{CarDetail.porte}</h1>
        </div>
        <div className="IconType">
          <div className="icon">
            <TbManualGearboxFilled className='iconImg' />
            <h1>{t('Boite de vitesse')}</h1>
          </div>
          <h1>{CarDetail.transmission}</h1>
        </div>
        <h1>{CarDetail.prix}/jrs</h1>
        <NavLink className='btn' to={`/Home/reservation/${CarDetail.id}`}><FaCalendarAlt className='ico' />Reservation</NavLink>

       


      </div>
    </div>
  )
}

export default DeatilCar
