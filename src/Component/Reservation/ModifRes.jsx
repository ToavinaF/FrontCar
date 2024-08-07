import React, { useEffect, useState } from 'react';
import './Reservation.scss';
import { FaCalendarCheck } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Reservation() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [Rese, setRes] = useState([]);
    const [Data, SetData] = useState({
        id_client: '',
        id_voiture: '',
        DateDebut: '',
        DateFin: '',
        PriceTotal: ''
    });

    const handleChange = (e) => {
        SetData({
            ...Data,
            [e.target.name]: e.target.value
        });
    };

    const fetchRes = async () => {
        try {
            const reserv = await axios.get('http://127.0.0.1:8000/api/showres/' + id);
            const reservation = reserv.data.reservation[0];
            setRes(reserv.data.reservation);
            SetData({
                id_client: reservation.id_client,
                id_voiture: reservation.id_voiture,
                DateDebut: reservation.DateDebut,
                DateFin: reservation.DateFin,
                PriceTotal: reservation.PriceTotal
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
        }
    };

    const handleModif = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/ModifReser/' + id, Data);
            navigate('/Home/Historique');
        } catch (error) {
            console.error("Erreur lors de la modification de la réservation:", error);
        }
    };

    useEffect(() => {
        fetchRes();
    }, [id]);

    return (
        <div className='ReservBlock'>
            {
                Rese.map((reserv) => (
                    <form onSubmit={handleModif} className="contentReserv" key={reserv.id}>
                        <div className="NavTop">
                            <h1>Modification du réservation <FaCalendarCheck className='Calendar' /></h1>
                            <span>{reserv.prix}/jrs</span>
                        </div>
                        <div className="NavBottom">
                            <div className='NavLeft'>
                                <div className="inputCarat">
                                    <label htmlFor="">Début de la location</label>
                                    <input type="date" className='input' name='DateDebut' value={Data.DateDebut} onChange={handleChange} />
                                </div>
                                <div className="inputCarat">
                                    <label htmlFor="">Fin de la location</label>
                                    <input type="date" className='input' name='DateFin' value={Data.DateFin} onChange={handleChange} />
                                </div>
                                <div className="inputCarat">
                                    <label htmlFor="">Le client</label>
                                    <select className='input' name='id_client' value={Data.id_client} onChange={handleChange}>
                                        <option value="2">Rakoto</option>
                                        <option value={reserv.id_client}>{reserv.name} {reserv.firstname}</option>
                                    </select>
                                </div>
                                <input type="hidden" name='id_voiture' value={Data.id_voiture} />
                                <input type="hidden" name='PriceTotal' value={Data.PriceTotal} />
                            </div>
                            <div className='NavRight'>
                                <div className="imgCar">
                                    <img src={`http://127.0.0.1:8000/storage/GalerieVehicule/${reserv.photo}`} alt="" />
                                </div>
                                <button type='submit' className='btn'>Valider</button>
                            </div>
                        </div>
                    </form>
                ))
            }
        </div>
    );
}

export default Reservation;
