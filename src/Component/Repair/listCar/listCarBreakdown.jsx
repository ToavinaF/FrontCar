import React, { useEffect, useState } from 'react';
import './listCar.scss';
import { FaUser } from 'react-icons/fa';
import { BsFillSuitcase2Fill } from "react-icons/bs";
import { GiCarDoor } from "react-icons/gi";
import { TbManualGearboxFilled } from "react-icons/tb";
import { MdDeleteForever, MdOutlineInsertPhoto, MdUpdate } from "react-icons/md";
import { CgDetailsMore } from "react-icons/cg";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApiService from '../../../axiosConfig';
import { API_URL } from '../../../apiConfig';
import { Typography } from '@mui/material';
import Loader from '../../Page/loader/Loader';

const ListCarBreakdown = ({type}) => {
  const location = useLocation();
  const [message, setMessage] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ViewCar, setViewCar] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [ShowMenu, setShowMenu] = useState(null)
  const [loader, setloader] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {

    const storedMessage = localStorage.getItem('message');
    if (storedMessage) {
      setMessage(storedMessage);

      localStorage.removeItem('message');
    }
  }, []);
  const handleClick = () => {
    setMessage(null);
  };

  const fetchData = async () => {
    setloader(true);
    try {
      const vehicl = await ApiService.get('/ViewCar');
      if(type==0){
        setViewCar(vehicl.data.vehicules.filter(val=>val.etat==1));
      }
      else{
        const vehicl = await ApiService.get('/maintenance');
        setMaintenances(vehicl.data)
        setViewCar(vehicl.data.vehicules.filter(val=>val.etat==0));
      }
      console.log(vehicl.data.vehicules);
      

    } catch (error) {
      console.error('Erreur lors de l\'appel API:', error.response || error.message || error);
    }
    setloader(false);
  };
  const handleMenu = (index) => {
    if (ShowMenu === index) {
      setShowMenu(null);
    } else {
      setShowMenu(index);
    }
  };

  const handDelete = async (id) => {
    const userId = localStorage.getItem('id');
    if (!userId) {
      toast.error('Utilisateur non connecté');
      return;
    }
    try {
      const response = await ApiService.delete(`/DeleteCar/${id}`);
      if (response.status === 401) {
        toast.error('Vous devez être connecté pour supprimer ce véhicule');
        return;
    }
      setViewCar(ViewCar.filter(item => item.id !== id));
      toast.success('Supprimé avec succès!');
  } catch (error) {
      toast.error('Erreur lors de la suppression');
      console.error('Erreur:', error);
  }
  const handleEdit = async (id) => {
    navigate('/Home/modifCar/' + id);
  }
}


  // messgae erreur
  const [count, setCount] = useState(3);
  useEffect(() => {
    if (count <= 0) return;
    localStorage.removeItem('message');
    const intervalId = setInterval(() => {
      setCount(prevCount => prevCount - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [count])

  //redirection galerie
  const handGalerie = async (id) => {
    navigate('/Home/galerie/' + id);
  }

  if(loader){
    return (
        <Loader />
    )
    }
  else
  return (
    <>
      <div className="contenaire">
        {message && <div className={`Error ${count === 0 ? 'active' : ''}`} onClick={handleClick}  >
          <p onClick={handleClick} >{message}</p>
        </div>
        }
        {ViewCar.length<=0 && maintenances.length<=0 ?(
        <Typography variant="h6" component="div">
          {t("No broken down car.")}
        </Typography>):null
        }
        {
          type==0?
          ViewCar.map((list, i) => {
                return (
                  <div key={i} className="ListBlock">
                    <div className='barNav'>
                      <h1 className='tlt'>{list.marque}</h1>
                      {/* <span onClick={() => handleMenu(i)}><CgDetailsMore className='bar' /></span>
                      {
                        ShowMenu === i && (
                          <div className="menu">
                            <button onClick={() => handleEdit(list.id)}><MdUpdate className='del' />Modifier</button>
                            <button onClick={() => handDelete(list.id)}><MdDeleteForever className='del' />Supprimer</button>
                            <button onClick={() => handGalerie(list.id)}><MdOutlineInsertPhoto className='del' />Gallerie</button>
                          </div>
                        )
                      } */}
                    </div>
                    <div className="photoCar">
                      <img src={`${API_URL}/viewimage/${list.photo}`} alt="" />
                    </div>
                    <div className="aprop">
                      <div className="icon">
                      <span className='tooltip'>Place</span>
                        <FaUser className='imgIcon' />
                        <h3> {list.place} </h3>
                      </div>
                      <div className="icon">
                      <span className='tooltip'>Bagage</span>
                        <BsFillSuitcase2Fill className='imgIcon' />
                        <h3>{list.bagage} </h3>
                      </div>
                      <div className="icon">
                      <span className='tooltip'>Porte</span>
                        <GiCarDoor className='imgIcon' />
                        <h3>{list.porte} </h3>
                      </div>
                      <div className="icon">
                      <span className='tooltip'>Transmission</span>
                        <TbManualGearboxFilled className='imgIcon' />
                        <h3>{list.transmission === 'Automatique' ? 'Auto.' : 'Man.'}</h3>
                      </div>
                    </div>
                    <h2>{list.matricule}</h2>
                    <NavLink className='btn' to={`/Home/add-car-breakdown/detail/${list.id}`}>{t('Details')}</NavLink>
                  </div>
                )
              })
              :
              maintenances.map((list, i) => {
                return (
                  <div key={i} className="ListBlock">
                    <div className='barNav'>
                      <h1 className='tlt'>{list.vehicules.marque}</h1>
                      {/* <span onClick={() => handleMenu(i)}><CgDetailsMore className='bar' /></span>
                      {
                        ShowMenu === i && (
                          <div className="menu">
                            <button onClick={() => handleEdit(list.vehicules.id)}><MdUpdate className='del' />Modifier</button>
                            <button onClick={() => handDelete(list.vehicules.id)}><MdDeleteForever className='del' />Supprimer</button>
                            <button onClick={() => handGalerie(list.vehicules.id)}><MdOutlineInsertPhoto className='del' />Gallerie</button>
                          </div>
                        )
                      } */}
                    </div>
                    <div className="photoCar">
                      <img src={`${API_URL}/viewimage/${list.vehicules.photo}`} alt="" />
                    </div>
                    <div className="aprop">
                      <div className="icon">
                      <span className='tooltip'>Place</span>
                        <FaUser className='imgIcon' />
                        <h3> {list.place} </h3>
                      </div>
                      <div className="icon">
                      <span className='tooltip'>Bagage</span>
                        <BsFillSuitcase2Fill className='imgIcon' />
                        <h3>{list.vehicules.bagage} </h3>
                      </div>
                      <div className="icon">
                      <span className='tooltip'>Porte</span>
                        <GiCarDoor className='imgIcon' />
                        <h3>{list.vehicules.porte} </h3>
                      </div>
                      <div className="icon">
                      <span className='tooltip'>Transmission</span>
                        <TbManualGearboxFilled className='imgIcon' />
                        <h3>{list.vehicules.transmission === 'Automatique' ? 'Auto.' : 'Man.'}</h3>
                      </div>
                    </div>
                    <h2>{list.label}</h2>
                    <NavLink className='btn' to={`/Home/car-breakdown/detail/${list.vehicules.id}/${list.id}`}>{t('Details')}</NavLink>
                  </div>
                )
              })
            }
      </div>
    </>
  );
}

export default ListCarBreakdown;
