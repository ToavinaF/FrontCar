import React, { useEffect, useState, useRef } from 'react';
import './DetailCar.scss';
import { FaCalendarAlt, FaUser } from 'react-icons/fa';
import { BsFillSuitcase2Fill } from 'react-icons/bs';
import { GiCarDoor } from 'react-icons/gi';
import { TbManualGearboxFilled } from 'react-icons/tb';
import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import { useTranslation } from 'react-i18next';
import { API_URL, BASE_URL } from '../../apiConfig';
import { ApiCall } from '../../ApiCall';

const DetailCar = () => {
  const { id } = useParams();
  const [CarDetail, setCarDetail] = useState([]);
  const [Galerie, setGalerie] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  const fetchCar = async () => {
    try {
      const list = await ApiCall(`${API_URL}/detail/${id}`,'GET');
      setCarDetail(list.data.detailCar);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchGal = async () => {
    try {
      const galView = await ApiCall(`${API_URL}/viewGalerie/${id}`,'GET');
      setGalerie(galView.data.galerie);
    } catch (error) {
      console.log('Erreur lors du chargement des galeries');
    }
  };

  useEffect(() => {
    fetchCar();
    fetchGal();
  }, [id]);

  const { t } = useTranslation();

  const handleThumbnailClick = (index) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
    setActiveIndex(index);
  };

  return (
    <div className='contDetail'>
      <div className='blockLeft'>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            console.log('Swiper initialized');
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.activeIndex);
          }}
        >
          {Galerie.map((view, index) => (
            <SwiperSlide key={index}>
              <div className='boucle'>
                <img src={`${BASE_URL}/storage/GalerieVehicule/${view.image}`} alt={`Galerie image ${index}`} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className='smallImages'>
          {Galerie.map((thumb, thumbIndex) => (
            <img
              key={thumbIndex}
              src={`${BASE_URL}/storage/GalerieVehicule/${thumb.image}`}
              alt={`Thumbnail ${thumbIndex}`}
              className='thumbnailImage'
              onClick={() => handleThumbnailClick(thumbIndex)}
              style={{ border: activeIndex === thumbIndex ? '2px solid blue' : 'none' }}
            />
          ))}
        </div>
      </div>
      <div className='blockRight'>
        <h1>{CarDetail.marque}</h1>
        <div className='IconType'>
          <div className='icon'>
            <FaUser className='iconImg' />
            <h1>{t('Nombre de place')}</h1>
          </div>
          <h1>{CarDetail.place}</h1>
        </div>
        <div className='IconType'>
          <div className='icon'>
            <BsFillSuitcase2Fill className='iconImg' />
            <h1>{t('Nombre de bagage')}</h1>
          </div>
          <h1>{CarDetail.bagage}</h1>
        </div>
        <div className='IconType'>
          <div className='icon'>
            <GiCarDoor className='iconImg' />
            <h1>{t('Nombre de porte')}</h1>
          </div>
          <h1>{CarDetail.porte}</h1>
        </div>
        <div className='IconType'>
          <div className='icon'>
            <TbManualGearboxFilled className='iconImg' />
            <h1>{t('Boite de vitesse')}</h1>
          </div>
          <h1>{CarDetail.transmission}</h1>
        </div>
        <h1>{CarDetail.prix}Ar/jrs</h1>
        <NavLink className='btn' to={`/Home/reservation/${CarDetail.id}`}>
          <FaCalendarAlt className='ico' />
          <span className='text'>Reservation</span>
        </NavLink>
      </div>
    </div>
  );
};

export default DetailCar;
