import React, { useEffect, useState } from 'react';
import './Reservation.scss';
import { FaCalendarCheck } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

function Reservation() {
    const navigate = useNavigate();
    const { id } = useParams();
    const loggedInUserId = localStorage.getItem('id');
    const [CarCheck, setCarCheck] = useState([]);
    const [ListUser, setListUser] = useState([]);
    const [AjoutReservation, setAjoutReservation] = useState({
        name: '',
        firstname: '',
        email: '',
        Adresse: '',
        contact:'',
        DateDebut:'',
        DateFin:'',
        Price:''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [reservedDates, setReservedDates] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [CheckHisto, setCheckHisto] = useState([]);

    const fetchCarCheck = async () => {
        try {
            const checkList = await axios.get(`http://127.0.0.1:8000/api/detail/${id}`);
            setCarCheck(checkList.data.detailCar);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUser = async () => {
        try {
            const user = await axios.get('http://127.0.0.1:8000/api/users');
            const filteredUsers = user.data.filter(user => user.id !== parseInt(loggedInUserId));
            setListUser(filteredUsers);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchReservedDates = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/ReservedDates/${id}`);
            setReservedDates(response.data.map(date => ({
                start: new Date(date.DateDebut),
                end: new Date(date.DateFin)
            })));
        } catch (error) {
            console.error("Erreur lors de la récupération des dates réservées:", error.response ? error.response.data : error.message);
            setErrorMessage(`Erreur lors de la récupération des dates réservées. Détails: ${error.response ? error.response.data.message : error.message}`);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAjoutReservation({
            ...AjoutReservation,
            [name]: value
        });

        if (name === 'DateDebut' || name === 'DateFin') {
            const selectedDate = new Date(value);
            if (isDateDisabled(selectedDate)) {
                setErrorMessage("Cette date est déjà réservée.");
            } else {
                setErrorMessage('');
            }
        }
    };

    const handleModif = async (e) => {
        e.preventDefault();
        const dateDebut = new Date(AjoutReservation.DateDebut);
        const dateFin = new Date(AjoutReservation.DateFin);



        // Calculer le prix total
        const prixParJour = parseFloat(CarCheck.prix.trim());
        const diffTemp = new Date(dateFin) - new Date(dateDebut);
        const nbjour = Math.ceil(diffTemp / (1000 * 60 * 60 * 24));
        const totalPrice = nbjour * prixParJour;

        const data = new FormData();
        data.append('name',AjoutReservation.name);
        data.append('firstname',AjoutReservation.firstname);
        data.append('email',AjoutReservation.email);
        data.append('Adresse',AjoutReservation.Adresse);
        data.append('contact',AjoutReservation.contact);
        data.append('DateDebut',AjoutReservation.DateDebut);
        data.append('DateFin',AjoutReservation.DateFin);
        data.append('Price',totalPrice);

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/location/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                  }
            });
        toast.success(response.data.message);
        toast.error(response.data.messageError);
        navigate('/Home/Historique');
        } catch (error) {
            toast.error(response.data.message);
            console.log(response);
            console.error(error);
        }
    };
    const fetchCarResrved = async () => {
        const response = await axios.get("http://127.0.0.1:8000/api/reservVehicul/" + id);
        setCheckHisto(response.data);
    };

    useEffect(() => {
        fetchCarCheck();
        fetchUser();
        fetchReservedDates();
        fetchCarResrved();
    }, [id]);

    const isDateReserved = (date) => {
        return reservedDates.some(reservedDate =>
            date >= reservedDate.start && date <= reservedDate.end
        );
    };

    const isDateDisabled = (date) => {
        return reservedDates.some(reservedDate =>
            date >= reservedDate.start && date <= reservedDate.end
        );
    };



    const [count, setCount] = useState(3);
    useEffect(() => {
        if (count <= 0) return;
        localStorage.removeItem('message');
        const intervalId = setInterval(() => {
            setCount(prevCount => prevCount - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [count])

    // calendrier
    const localizer = momentLocalizer(moment);
    const [events, setEvents] = useState([
        {
          title: 'Reservation en cours',
          start: new Date(2024, 7, 15, 10, 0), // 15 août 2024, 10:00
          end: new Date(2024, 7, 20, 12, 0), // 15 août 2024, 12:00
        },
    ]);

    const date = ("2024-08-10T12:34:56.789Z");
    const [year, month, day] = date.split('- .');
    console.log(year, month, day);
    return (
        <div className='ReservBlock'>
            <form onSubmit={handleModif} className="contentReserv">
                <div className="NavTop">
                    <h1>Reservation <FaCalendarCheck className='Calendar' /></h1>
                    <span>{CarCheck.prix}Ar/jrs</span>
                </div>
                <div className="NavBottom">
                    <div className='NavLeft'>
                        <div className="inputCarat">
                            <label htmlFor="DateDebut">Début de la location</label>
                            <input
                                type="date"
                                className={`input ${isDateReserved(new Date(AjoutReservation.DateDebut)) ? 'reserved-date' : ''}`}
                                name='DateDebut'
                                onChange={handleChange}
                                required
                                min={new Date().toISOString().split('T')[0]} // Empêche de choisir une date passée
                            />
                            {errors.DateDebut && <div className="error">{errors.DateDebut}</div>}
                        </div>
                        <div className="inputCarat">
                            <label htmlFor="DateFin">Fin de la location</label>
                            <input
                                type="date"
                                className={`input ${isDateReserved(new Date(AjoutReservation.DateFin)) ? 'reserved-date' : ''}`}
                                name='DateFin'
                                onChange={handleChange}
                                required
                                min={new Date().toISOString().split('T')[0]} // Empêche de choisir une date passée
                            />
                            {errors.DateFin && <div className="error">{errors.DateFin}</div>}
                        </div>
                        <div className="inputCarat">
                            <label htmlFor="nom">Nom</label>
                            <input type="text" className='input' name='name' placeholder='Nom' onChange={handleChange} />
                        </div>
                        <div className="inputCarat">
                            <label htmlFor="prenom">Prenom</label>
                            <input type="text" className='input' name='firstname' onChange={handleChange} />
                        </div>
                        <div className="inputCarat">
                            <label htmlFor="email">E-mail</label>
                            <input type="text" className='input' name='email' onChange={handleChange} />
                        </div>
                        <div className="inputCarat">
                            <label htmlFor="contact">Contact</label>
                            <input type="text" className='input' name='contact'  onChange={handleChange} />
                        </div>
                        <div className="inputCarat">
                            <label htmlFor="lieu">Location de depart</label>
                            <input type="text" className='input' name='lieu' onChange={handleChange} />
                        </div>
                        <div className="inputCarat">
                            <label htmlFor="adresse">Adresse</label>
                            <input type="text" className='input' name='Adresse' onChange={handleChange} />
                        </div>
                    </div>
                    <div className='NavRight'>
                        <div className="imgCar">
                            <img src={`http://127.0.0.1:8000/storage/GalerieVehicule/${CarCheck.photo}`} alt={CarCheck.marque} />
                        </div>
                        <button type='submit' className='btn'>Valider</button>
                    </div>
                </div>


            </form>

            {CheckHisto.length > 0 && (
                <div className="histo">
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 400 }}
                    />
                </div>
            )}
        </div>
    );
}

export default Reservation;
