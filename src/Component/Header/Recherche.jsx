import React, { useEffect } from 'react'
import './Recherche.scss';
import Sary from '../../assets/sary/2.jpg'
import { GiGearStickPattern } from "react-icons/gi";
import { IoBagAdd } from "react-icons/io5";
import { FaDoorOpen } from "react-icons/fa6";
import { LuRockingChair } from "react-icons/lu";
import { TbNumber } from "react-icons/tb";
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
const Recherche = () => {
    const location = useLocation();
    const { results, results1 } = location.state || { results: [], results1: [] };
    const Navigate = useNavigate();
    const Voirplus = (id)=>{
        Navigate('/Home/detail/'+id);
    }
    return (
        <>
            <div className="search-result">
                <div className="result_voiture">
                    {
                        results.map((car) => (
                            <div className="search_voiture">
                                <div className="image-vehi">
                                    <img src={`http://127.0.0.1:8000/storage/GalerieVehicule/${car.photo}`} alt="" />
                                </div>
                                <div className="desc-vehi">
                                    <h1>Description</h1>
                                    <div className="parag">
                                        <h2>{car.marque}</h2>
                                        <p><strong><LuRockingChair /></strong> <span>{car.place}</span></p>
                                        <p><strong><FaDoorOpen /></strong> <span>{car.porte}</span></p>
                                        <p><strong><IoBagAdd /></strong> <span>{car.bagage}</span></p>
                                        <p><strong><GiGearStickPattern /></strong> <span>{car.transmission}</span></p>
                                    </div>
                                    <div className='descri'>
                                        <p>{car.description}</p>
                                        <a className='Voir' onClick={()=>Voirplus(car.id)}>Voir plus</a>
                                    </div>
                                </div>
                            </div>
                        ))
                    }

                </div>
                <div className="reserv_voiture">

                </div>
            </div>
        </>
    )
}

export default Recherche

