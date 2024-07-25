import React, { useEffect, useState } from 'react';
import './listCar.scss';
import { FaUser } from 'react-icons/fa';
import { BsFillSuitcase2Fill } from "react-icons/bs";
import { GiCarDoor } from "react-icons/gi";
import { TbManualGearboxFilled } from "react-icons/tb";
import { MdDeleteForever, MdUpdate } from "react-icons/md";
import { CgDetailsMore } from "react-icons/cg";
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ListCar = () => {
  const { t } = useTranslation();
  const [ViewCar, setViewCar] = useState([]);
  const [ShowMenu, setShowMenu] = useState(null)

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
  const handleMenu = (index) => {
    if (ShowMenu === index) {
      setShowMenu(null);
    } else {
      setShowMenu(index);
    }
  };

  const handDelete = async (id) => {
    console.log(id);
    await axios.delete('http://127.0.0.1:8000/api/DeleteCar/' + id);
    const newList = ViewCar.filter((item)=>{
      return(
        item.id !== id
      )
    })
    setViewCar(newList);
  }

  return (
    <>
      <div className="contenaire">
        {
          ViewCar.map((list, i) => {
            return (
              <div key={i} className="ListBlock">
                <div className='barNav'>
                  <h1 className='tlt'>{list.marque}</h1>
                  <span onClick={() => handleMenu(i)}><CgDetailsMore className='bar'/></span>
                  {
                    ShowMenu === i && (
                      <div className="menu">
                        <button onClick={() => handleEdit(list.id)}><MdUpdate className='del'/>Modifier</button>
                        <button onClick={() => handDelete(list.id)}><MdDeleteForever className='del'/>Supprimer</button>
                      </div>
                    )
                  }
                </div>
                <div className="photoCar">
                  <img src={`http://127.0.0.1:8000/storage/ImageVehicule/${list.photo}`} alt="" />
                </div>
                <div className="aprop">
                  <div className="icon">
                    <FaUser className='imgIcon' />
                    <h3>{list.place}</h3>
                  </div>
                  <div className="icon">
                    <BsFillSuitcase2Fill className='imgIcon' />
                    <h3>{list.bagage}</h3>
                  </div>
                  <div className="icon">
                    <GiCarDoor className='imgIcon' />
                    <h3>{list.porte}</h3>
                  </div>
                  <div className="icon">
                    <TbManualGearboxFilled className='imgIcon' />
                    <h3>{list.transmission === 'Automatique' ? 'Auto' : 'Man.'}</h3>
                  </div>
                </div>
                <h2>{list.prix}/jrs</h2>
                <NavLink className='btn' to={`/detail/${list.id}`}>{t('Details')}</NavLink>
              </div>
            )
          })
        }
      </div>
    </>
  );
}

export default ListCar;
