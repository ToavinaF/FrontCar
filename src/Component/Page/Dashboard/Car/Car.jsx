import React, { useEffect, useRef, useState } from 'react';
import { FaChartArea, FaStopwatch } from "react-icons/fa";
import Cars from '../../../../assets/images/car-01.png';
import Cars1 from '../../../../assets/images/car-02.png';
import Cars2 from '../../../../assets/images/car-03.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { IoMdSettings } from "react-icons/io";
import { MdLinearScale } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const Car = ({ Vehicule }) => {
  const { t } = useTranslation();
  const progressCircle = useRef(null);
  const progressContent = useRef(null);

  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty('--progress', 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 6500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className="mySwiper"
      >
        {
          Vehicule.map((veh, i) => (
            <SwiperSlide key={i}>
              <div className='recommend__car-card'>
                <div className='recommend__car-top'>
                  <h5><span><FaChartArea /></span></h5>
                </div>
                <div className='recommend__car-img'>
                  <img src={`http://127.0.0.1:8000/storage/ImageVehicule/${veh.photo}`} className="carimage" alt={t('Marque')} />
                </div>
                <div className='recommend__car-bottom'>
                  <h4>{veh.marque}</h4>
                  <div className='recommend__car-other'>
                    <div className='recommend__car-icons'>
                      <p>{veh.matricule}</p>
                      <p><IoMdSettings /></p>
                      <p><FaStopwatch /></p>
                      <p>{veh.prix}{t('/jours')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))
        }


        <div className="autoplay-progress" slot="container-end">
          <svg viewBox="0 0 48 48" ref={progressCircle}>
            <circle cx="24" cy="24" r="20"></circle>
          </svg>
          <span ref={progressContent}></span>
        </div>
      </Swiper>
    </>
  );
}

export default Car;
