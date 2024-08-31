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
import ApiService from '../../axiosConfig';

const ListCar = () => {
  const location = useLocation();
  const [message, setMessage] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ViewCar, setViewCar] = useState([]);
  const [ShowMenu, setShowMenu] = useState(null)

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
    try {
      const vehicl = await ApiService.get('/ViewCar');
      console.log(vehicl.data.vehicules);
      setViewCar(vehicl.data.vehicules);

    } catch (error) {
      console.error('Erreur lors de l\'appel API:', error.response || error.message || error);
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


  return (
    <>
      <div className="contenaire">
        {message && <div className={`Error ${count === 0 ? 'active' : ''}`} onClick={handleClick}  >
          <p onClick={handleClick} >{message}</p>
        </div>
        }

        {
          ViewCar.map((list, i) => {
                return (
                  <div key={i} className="ListBlock">
                    <div className='barNav'>
                      <h1 className='tlt'>{list.marque}</h1>
                      <span onClick={() => handleMenu(i)}><CgDetailsMore className='bar' /></span>
                      {
                        ShowMenu === i && (
                          <div className="menu">
                            <button onClick={() => handleEdit(list.id)}><MdUpdate className='del' />Modifier</button>
                            <button onClick={() => handDelete(list.id)}><MdDeleteForever className='del' />Supprimer</button>
                            <button onClick={() => handGalerie(list.id)}><MdOutlineInsertPhoto className='del' />Gallerie</button>
                          </div>
                        )
                      }
                    </div>
                    <div className="photoCar">
                      <img src={`http://127.0.0.1:8000/storage/GalerieVehicule/${list.photo}`} alt="" />
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
                    <h2>{list.prix}Ar/jrs</h2>
                    <NavLink className='btn' to={`/Home/detail/${list.id}`}>{t('Details')}</NavLink>
                  </div>
                )
              })
            }
      </div>
    </>
  );
}

export default ListCar;
