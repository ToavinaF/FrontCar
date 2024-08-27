import React, { useEffect, useState } from 'react';
import './Reservation.scss';
import { FaCalendarCheck } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { DateRangePicker } from 'rsuite';
import { toast } from 'react-toastify';
import { API_URL, BASE_URL } from '../../apiConfig';
import ApiService from '../../axiosConfig';

function Reservation() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [Rese, setRes] = useState([]);
    const [Data, SetData] = useState({
        id_client: '',
        name: '',
        firstname: '',
        email: '',
        Adresse: '',
        contact: '',
        id_voiture: '',
        DateDebut: '',
        DateFin: '',
        PriceTotal: '',
    });

    const handleChange = (e) => {
        SetData({
            ...Data,
            [e.target.name]: e.target.value,
        });
    };

    const fetchRes = async () => {
        try {
            const reserv = await ApiService.get(`/showres/${id}`);
            const reservation = reserv.data.reservation[0];
            // alert(reserv.data.reservation);
            setRes(reserv.data.reservation);
            SetData({
                id_client: reservation.id_client,
                name: reservation.name,
                firstname: reservation.firstname,
                email: reservation.email,
                Adresse: reservation.Adresse,
                contact: reservation.contact,
                id_voiture: reservation.id_voiture,
                PriceTotal: reservation.PriceTotal,
                photo: reservation.photo,
                prix: reservation.prix,
                DateDebut: reservation.DateDebut,
                DateFin: reservation.DateFin,
            });
            setSelectDate({
                ...selectDate,
                DateDebut: new Date(reservation.DateDebut),
                DateFin: new Date(reservation.DateFin),
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
        }
    };

    const handleModif = async (e) => {
        e.preventDefault();
        try {
            const response = await ApiService.post(`${API_URL}/ModifReser/${id}`, Data);
            navigate('/Home/Historique');
            toast.success(response.data.message);
        } catch (error) {
            toast.error("Erreur lors de la modification de la réservation");
        }
    };

    useEffect(() => {
        fetchRes();
    }, [id]);

    const [selectDate, setSelectDate] = useState([new Date(), new Date()]);
    const handlepickchange = (value) => {
        setSelectDate(value);
        if (value && value.length === 2) {
            SetData({
                ...Data,
                DateDebut: value[0].toISOString().split('T')[0],
                DateFin: value[1].toISOString().split('T')[0],
            })
        }
    }

    return (
        <div className='ReservBlock'>
                    <form onSubmit={handleModif} className="contentReserv">
                        <div className="NavTop">
                            <h1>Modification du réservation <FaCalendarCheck className='Calendar' /></h1>
                            <span>{Data.prix}/jrs</span>
                        </div>
                        <div className="NavBottom">
                            <div className='NavLeft'>
                                <div className="inputCarat">
                                    <label htmlFor="">Début de la location</label>
                                    <DateRangePicker value={selectDate} onChange={handlepickchange} className='inputrange'/>
                                </div>
                                <div className="inputCarat">
                                    <label htmlFor="">Nom</label>
                                    <input type="text" className='input' name='name' value={Data.name} onChange={handleChange}/>
                                </div>
                                <div className="inputCarat">
                                    <label htmlFor="">Prenom</label>
                                    <input type="text" className='input' name='firstname' value={Data.firstname} onChange={handleChange}/>
                                </div>
                                <div className="inputCarat">
                                    <label htmlFor="">Email</label>
                                    <input type="email" className='input' name='email' value={Data.email} onChange={handleChange}/>
                                </div>
                                <div className="inputCarat">
                                    <label htmlFor="">Contact</label>
                                    <input type="text" className='input' value={Data.contact} name='contact' onChange={handleChange}/>
                                </div>
                                <div className="inputCarat">
                                    <label htmlFor="">Location de depart</label>
                                    <input type="text" name='lieu' className='input'/>
                                </div>
                                <div className="inputCarat">
                                    <label htmlFor="">Adresse</label>
                                    <input type="text" name='Adresse' value={Data.Adresse} className='input' onChange={handleChange}/>
                                </div>
                                <div className="inputCarat">
                                    <button type='submit' className='btn'>Update</button>
                                </div>
                                <input type="hidden" name='id_client' value={Data.id_client} />
                                <input type="hidden" name='PriceTotal' value={Data.PriceTotal} />
                            </div>
                            <div className='NavRight'>
                                <div className="imgCar">
                                    <img src={`${BASE_URL}/storage/GalerieVehicule/${Data.photo}`} alt="" />
                                </div>
                            </div>
                        </div>
                    </form>
        </div>
    );
}

export default Reservation;
