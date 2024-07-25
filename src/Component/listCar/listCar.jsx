import React, { useEffect, useState } from 'react';
import './listCar.scss';
import { FaUser } from 'react-icons/fa';
import { BsFillSuitcase2Fill } from "react-icons/bs";
import { GiCarDoor } from "react-icons/gi";
import { TbManualGearboxFilled } from "react-icons/tb";
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ListCar = () => {
  const { t } = useTranslation();
  const [ViewCar, setViewCar] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const vehicl = await axios.get("http://127.0.0.1:8000/api/ViewCar");
      setViewCar(vehicl.data.vehicules);
    } catch (error) {
      console.log("verifier le code");
    }
  };

  return (
    <>
      <div className="contenaire">
        {
          ViewCar.map((list, i) => {
            return (
              <div key={i} className="ListBlock">
                <div className='barNav'>
                  <h1 className='tlt'>{list.marque}</h1>
                  <span>...</span>
                </div>
                <div className="photoCar">
                  <img src={`http://127.0.0.1:8000/storage/ImageVehicule/${list.photo}`} alt="" />
                </div>
                <div className="aprop">
                  <div className="icon">
                    <FaUser className='imgIcon' />
                    <h3>{list.place} </h3>
                  </div>
                  <div className="icon">
                    <BsFillSuitcase2Fill className='imgIcon' />
                    <h3>{list.bagage} </h3>
                  </div>
                  <div className="icon">
                    <GiCarDoor className='imgIcon' />
                    <h3>{list.porte} </h3>
                  </div>
                  <div className="icon">
                    <TbManualGearboxFilled className='imgIcon' />
                    <h3>{list.transmission} {t('transmission')}</h3>
                  </div>
                </div>
                <h2>{list.prix}/jrs</h2>
                <NavLink className='btn' to='/detail'>{t('Details')}</NavLink>
              </div>
            )
          })
        }
      </div>
    </>
  );
}

export default ListCar;
