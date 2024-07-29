import React, { useEffect, useState } from 'react'
import './Reservation.scss'
import Sary from '../../assets/saert.jpeg'
import { FaCalendarCheck } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

function Reservation() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [CarCheck, setCarCheck] = useState([]);
    const [ListUser, setListUser] = useState([]);
    const [ReservAdd, setReservAdd] = useState({
        id_client: '',
        DateDebut: '',
        DateFin: '',
        Price: ''
    });

    const fetchCarCheck = async () => {
        try {
            const checkList = await axios.get('http://127.0.0.1:8000/api/detail/' + id);
            setCarCheck(checkList.data.detailCar);
        } catch (error) {
            console.error(error);
        }
    }
    const fetchUser = async () => {
        try {
            const user = await axios.get('http://127.0.0.1:8000/api/users');
            setListUser(user.data);
            console.log(user.data);

        } catch (error) {
            console.error(error);
        }
    }

    const handleChange = (e) => {
        setReservAdd({
            ...ReservAdd,
            [e.target.name]: e.target.value
        });
    };

    const handleModif = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('id_client', ReservAdd.id_client);
        data.append('DateDebut', ReservAdd.DateDebut);
        data.append('DateFin', ReservAdd.DateFin);
        data.append('Price', CarCheck.prix);

        console.log(data);
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/Reservation/' + id, data);
            navigate('/Historique');
        } catch (error) {
            console.error(error);

        }
    };
    useEffect(() => {
        fetchCarCheck();
        fetchUser();
    }, [id])
    return (
        <div className='ReservBlock'>
            <form onSubmit={handleModif} methode='post' className="contentReserv">
                <div className="NavTop">
                    <h1>Reservation <FaCalendarCheck className='Calendar' /></h1>

                    <span>{CarCheck.prix}/jrs</span>
                </div>
                <div className="NavBottom">
                    <div className='NavLeft'>
                        <div className="inputCarat">
                            <label htmlFor="">Debut du location</label>
                            <input type="date" placeholder='' className='input' name='DateDebut' onChange={handleChange} />
                        </div>

                        <div className="inputCarat">
                            <label htmlFor="">Fin du location</label>
                            <input type="date" placeholder='' className='input' name='DateFin' onChange={handleChange} />
                        </div>
                        <div className="inputCarat">
                            <label htmlFor="">Le client</label>
                            <select className='input' name='id_client' onChange={handleChange}>
                                {
                                    ListUser.map((user, i) => {
                                        return (
                                            <option key={i} value={user.id}>{user.name} {user.firstname}</option>
                                        )

                                    })

                                }



                            </select>
                        </div>
                    </div>
                    <div className='NavRight'>
                        <div className="imgCar">
                            <img src={`http://127.0.0.1:8000/storage/ImageVehicule/${CarCheck.photo}`} alt="" />
                        </div>
                        {/* <h1>{CarCheck.marque}</h1> */}
                        <button type='submit' className='btn'>Valider</button>
                    </div>

                </div>
            </form>
        </div>
    )
}

export default Reservation
