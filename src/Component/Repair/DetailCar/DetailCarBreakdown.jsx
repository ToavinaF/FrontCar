import React, { useEffect, useState, useRef, useContext } from 'react';
import './DetailCar.scss';
import './Login.scss';
import { FaCalendarAlt, FaUser } from 'react-icons/fa';
import { BsFillSuitcase2Fill } from 'react-icons/bs';
import { MdCarRepair } from "react-icons/md";
import { PiNotepadDuotone } from "react-icons/pi";
import { TbLicense } from "react-icons/tb";
import { GiCarDoor } from 'react-icons/gi';
import { TbManualGearboxFilled } from 'react-icons/tb';
import { Navigate, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import { useTranslation } from 'react-i18next';
import { API_URL, BASE_URL } from '../../../apiConfig';
import { ApiCall } from '../../../ApiCall';
import { TextField } from '@mui/material';

const DetailCarBreakdown = ({type}) => {
  const { id,idMain } = useParams();
  const location = useLocation()
  const navigate = useNavigate(location);
  const [CarDetail, setCarDetail] = useState([]);
  const [Galerie, setGalerie] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [maintenance,setMaintenance] = useState(
   { 
      id:'',
      label:'',
      etat:0,
      vehicule_id:parseInt(id)
    }
  )
  const swiperRef = useRef(null);

  const fetchCar = async () => {
    try {
      if(type==0){
        const list = await ApiCall(`${API_URL}/detail/${id}`,'GET');
        setCarDetail(list.data.detailCar);
        console.log(list.data.detailCar);
      }else{
        const list = await ApiCall(`${API_URL}/maintenance/${idMain}`,'GET');
        setCarDetail(list.data.vehicules);
        setMaintenance(list.data);
        setIdVehicule(list.data.vehicule_id);
        console.log(list.data.vehicules);
      }
      
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

  const handleSubmit = async () => {
    try {
      console.log("maintenances",maintenance);
      
      if(type==0){
        const list = await ApiCall(`${API_URL}/maintenance/add`,'POST',maintenance);
        //setCarDetail(list.data);
        console.log(list.data);
        navigate('/Home/list-car-breakdown')
      }
      else{
        const repair = {...maintenance,etat:1};
        const list = await ApiCall(`${API_URL}/maintenance/update`,'POST',repair);
        console.log(list.data);
        navigate('/Home/list-car-breakdown')
      }
      
    } catch (error) {
      console.error(error);
    }
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
                <img src={`${API_URL}/viewimage/${view.image}`} alt={`Galerie image ${index}`} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className='smallImages'>
          {Galerie.map((thumb, thumbIndex) => (
            <img
              key={thumbIndex}
              src={`${API_URL}/viewimage/${thumb.image}`}
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
        <div className='IconType'>
          <div className='icon'>
            <TbLicense className='iconImg' />
            <h1>{t('Matricule')}</h1>
          </div>
          <h1>{CarDetail.matricule}</h1>
        </div>
        {type==0?
        <div className="IconType">
          <TextField
          id="outlined-multiline-flexible"
          label={t('Motif')}
          multiline
          fullWidth={true}
          maxRows={4}
          value={maintenance.label}
          onChange={(event)=>setMaintenance({...maintenance,label:event.target.value})}   
        />
        </div>
        :
        <div className='IconType'>
          <div className='icon'>
          <PiNotepadDuotone className='iconImg' />
            <h1>{t('Motif')}</h1>
          </div>
          <h1>{maintenance.label}</h1>
        </div>
        }
        <div className='btn' onClick={handleSubmit}>
          <MdCarRepair className='ico' />
          <span className='text'>{type==0?'Add car breakdown':'Fixed Car'}</span>
        </div>
      </div>
    </div>
  );
};

export default DetailCarBreakdown;
