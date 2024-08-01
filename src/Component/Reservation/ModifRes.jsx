import React, { useEffect, useState } from 'react';
import './Reservation.scss';
import { FaCalendarCheck } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Reservation() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [Rese, setRes] = useState([]);
    console.log(Rese);
    const [ReservAdd, setReservAdd] = useState({
        id_client: '',
        id_voiture: '',
        DateDebut: '',
        DateFin: '',
        PriceTotal: ''
    });

    const fetchRes = async () => {
        try {
            const reserv = await axios.get('http://127.0.0.1:8000/api/showres/' + id);
            setRes(reserv.data.reservation);
            setReservAdd({
                id_client: reserv.data.reservation.id_client,
                id_voiture: reserv.data.reservation.id_voiture,
                DateDebut: reserv.data.reservation.DateDebut,
                DateFin: reserv.data.reservation.DateFin,
                Price: reserv.data.reservation.PriceTotal,
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReservAdd(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleModif = async (e) => {
        e.preventDefault();
        const data = {
            id_client: ReservAdd.id_client,
            id_voiture: ReservAdd.id_voiture,
            DateDebut: ReservAdd.DateDebut,
            DateFin: ReservAdd.DateFin,
            PriceTotal: ReservAdd.PriceTotal // Correction ici pour correspondre à votre backend
        };

        try {
            await axios.post('http://127.0.0.1:8000/api/ModifReser/' + id, data);
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
                    <form onSubmit={handleModif} className="contentReserv">
                        <div className="NavTop">
                            <h1>Modification du réservation <FaCalendarCheck className='Calendar' /></h1>
                            <span>{reserv.prix}/jrs</span>
                        </div>
                        <div className="NavBottom">
                            <div className='NavLeft'>
                                <div className="inputCarat">
                                    <label htmlFor="">Début de la location</label>
                                    <input type="date" className='input'  name='DateDebut' onChange={handleChange} />
                                </div>
                                <div className="inputCarat">
                                    <label htmlFor="">Fin de la location</label>
                                    <input type="date" className='input'  name='DateFin' onChange={handleChange} />
                                </div>
                                <div className="inputCarat">
                                    <label htmlFor="">Le client</label>
                                    <select className='input' name='id_client'  onChange={handleChange}>
                                        <option value={reserv.id}>{reserv.name} {reserv.firstname}</option>
                                    </select>
                                </div>
                            </div>
                            <div className='NavRight'>
                                <div className="imgCar">
                                    <img src={`http://127.0.0.1:8000/storage/ImageVehicule/${reserv.photo}`} alt="" />
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
