import React, { useEffect } from 'react'
import './Recherche.scss';
import Sary from '../../assets/sary/2.jpg'
import { GiGearStickPattern } from "react-icons/gi";
import { IoBagAdd } from "react-icons/io5";
import { FaDoorOpen } from "react-icons/fa6";
import { LuRockingChair } from "react-icons/lu";
import { TbNumber } from "react-icons/tb";
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../apiConfig';
const Recherche = () => {
    const location = useLocation();
    const { results, results1 } = location.state || { results: [], results1: [] };
    const Navigate = useNavigate();
    const Voirplus = (id) => {
        Navigate('/Home/detail/' + id);
    }
    return (
        <>
            <div className="search-result">
                <div className="result_voiture">
                    {
                        results.length>0 ?(
                            results.map((car) => (
                                <div className="search_voiture">
                                    <div className="image-vehi">
                                        <img src={`${BASE_URL}/storage/GalerieVehicule/${car.photo}`} alt="" />
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
                        ) :
                        <div className="reserv_voiture">
                            <h1>Aucune resultat pour votre recherche!</h1>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default Recherche

