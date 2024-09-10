import React, { useEffect } from 'react'
import './Recherche.scss';
import Sary from '../../assets/sary/2.jpg';
import Avatar from '../../assets/sary/avatar.png';
import Pen from '../../assets/Sary/pen.png';
import { GiGearStickPattern } from "react-icons/gi";
import { IoBagAdd } from "react-icons/io5";
import { FaDoorOpen } from "react-icons/fa6";
import { LuRockingChair } from "react-icons/lu";
import { TbNumber } from "react-icons/tb";
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { API_URL, BASE_URL } from '../../apiConfig';
import { RxAvatar } from "react-icons/rx";
import { CiMail, CiPhone } from "react-icons/ci";
import { BsHandbag } from "react-icons/bs";
import { LiaUserEditSolid } from "react-icons/lia";
import Loader from '../Page/loader/Loader';

const Recherche = ({loader}) => {
    const location = useLocation();
    const { results, results1, results2, results3 } = location.state || { results: [], results1: [], results2: [], results3: [] };
    const Navigate = useNavigate();
    const Voirplus = (id) => {
        Navigate('/Home/detail/' + id);
    }
    const editUser = (id) => {
        Navigate('/Home/editUser/' + id);
    }

    if (loader) {
        return (
          <Loader />
        )
      }
    else
    return (
        <>
            <div className="search-result">
                <div className="result_voiture">
                    {results.length > 0 && (
                        results.map((car) => (
                            <div className="search_voiture" key={car.id}>
                                <div className="image-vehi">
                                    <img src={`${API_URL}/viewimage/${car.photo}`} alt="" />
                                </div>
                                <div className="desc-vehi">
                                    <div className="title">
                                        <h1>{car.marque}</h1>
                                        <p>{car.description}</p>
                                    </div>
                                    <div className="parag">
                                        <p><strong><LuRockingChair /></strong> <span>{car.place} places</span></p>
                                        <p><strong><FaDoorOpen /></strong> <span>{car.porte} portes</span></p>
                                        <p><strong><IoBagAdd /></strong> <span>{car.bagage} bagages</span></p>
                                        <p><strong><GiGearStickPattern /></strong> <span>{car.transmission}</span></p>
                                    </div>
                                    <div className='descri'>
                                        <a className='Voir' onClick={() => Voirplus(car.id)}>Voir plus</a>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {results2 && (
                        <div className="search_clients">
                            <h1>User list of recherche ({results2.length})</h1>
                            {results2.map((user) => (
                                <div className='clients' key={user.id}>
                                    <div className="profil">
                                        <img
                                            src={user.photo != null ? `${API_URL}/viewimage/${user.photo}` : Avatar}
                                            alt="" />
                                    </div>
                                    <div className="detail">
                                        <h1><span><RxAvatar /></span> {user.name} {user.firstname}</h1>
                                        <p><span><BsHandbag /></span> {user.Job}</p>
                                        <p className="mail"><span><CiMail /></span> {user.email}</p>
                                        <p className='num'><span><CiPhone /></span> {user.contact}</p>
                                    </div>
                                    <div className="modif">
                                        <LiaUserEditSolid className="icon" onClick={()=>editUser(user.id)}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {results3 && (
                        <div className="search_clients">
                            <h1>Client list of recherche ({results3.length})</h1>
                            {results3.map((client) => (
                                <div className='clients' key={client.id}>
                                    <div className="profil">
                                        <img
                                            src={client.photo != null ? `${API_URL}/viewimage/${client.photo}` : Avatar}
                                            alt="" />
                                    </div>
                                    <div className="detail">
                                        <h1><span><RxAvatar /></span> {client.name} {client.firstname}</h1>
                                        <p><span><BsHandbag /></span> {client.addresse}</p>
                                        <p className="mail"><span><CiMail /></span> {client.email}</p>
                                        <p className='num'><span><CiPhone /></span> {client.contact}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {results.length === 0 && !results2 && !results3 && (
                        <div className="reserv_voiture">
                            <h1>Aucun résultat pour votre recherche!</h1>
                        </div>
                    )}

                </div>
            </div>
        </>
    )
}

export default Recherche

