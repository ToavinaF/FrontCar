import React, { useEffect, useState } from 'react'
import './Historique.scss'
import { BsThreeDots } from "react-icons/bs";
import axios from 'axios';

const Historique = () => {
    const [isActive, setisActive] = useState(null);
    const handlemenu = (index)=>{
        if(isActive === index){
            setisActive(null);
        }else{
            setisActive(index)
        }
    }
    const [Histo, setHisto] = useState([]);
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const Histo = await axios.get("http://127.0.0.1:8000/api/Historique");
            setHisto(Histo.data);
            // console.log(Histo.data);
        } catch (error) {
            console.log("verifier le code");
        }
    };

    const suppr = (id) => {
        const ReseId = id;
        // console.log(id);
        axios.get(`http://127.0.0.1:8000/api/suppr/${ReseId}`)
        .then(() => {
            setHisto(Histo.filter(Histo => Histo.id_reservations !== id));
        })
        .catch(error => {
            console.error('Error de la suppression car:', error);
        });
    }
    // console.log(Histo);
    return (
        <div className='Historique'>
            <div className="title-histo">
                <h2>Hi, Welcome back!</h2>
            </div>

            <div className="table-content">
                <h1>Recent Reservation Queue</h1>
                <div className="table">
                    <table>
                        <tbody>
                            <tr>
                                <th>#</th>
                                <th>PATIENT</th>
                                <th>MARQUE</th>
                                <th>MATRICULE</th>
                                <th>DATE DEBUT</th>
                                <th>DATE FIN</th>
                                <th>STATUT</th>
                                <th>PRICE</th>
                                <th></th>
                            </tr>
                            {
                                Histo.map((Histo, index) => (
                                    <tr key={index}>
                                        <td><strong className='id-col'>{Histo.id_reservations}</strong></td>
                                        <td>{Histo.name}</td>
                                        <td>{Histo.marque}</td>
                                        <td>{Histo.matricule}</td>
                                        <td>{Histo.DateDebut}</td>
                                        <td>{Histo.DateFin}</td>
                                        <td><span className='regle'>Non Reglé</span></td>
                                        <td>{Histo.PriceTotal}</td>
                                        <td><BsThreeDots className={`three ${isActive === index ? 'active' : ''}`} onClick={() => handlemenu(index)} /></td>
                                        {
                                            isActive === index && (
                                                <div className='menu'>
                                                    <ul>
                                                        <li><a  onClick={()=>suppr(Histo.id_reservations)}>Supprimer</a></li>
                                                        <li><a >Modifier</a></li>
                                                    </ul>
                                                </div>
                                            )
                                        }
                                    </tr>
                                ))
                            }
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    )
}

export default Historique