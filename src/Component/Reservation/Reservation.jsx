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
import { AutoComplete, DateRangePicker } from 'rsuite';
import 'rsuite/DateRangePicker/styles/index.css';
import { API_URL, BASE_URL } from '../../apiConfig';
import ApiService from '../../axiosConfig';


function Reservation() {
    const navigate = useNavigate();
    const { id } = useParams();
    const loggedInUserId = localStorage.getItem('id');
    const [CarCheck, setCarCheck] = useState({});
    const [ListUser, setListUser] = useState([]);
    const [maps, setMaps] = useState([]);
    const [currentMap, setCurrentMap] = useState(null);

    // const [formValues, setFormValues] = useState({  });

    const [AjoutReservation, setAjoutReservation] = useState({
        name: '',
        firstname: '',
        email: '',
        adresse: '',
        lieu: '',
        latitude: '',
        longitude: '',
        contact: '',
        DateDebut: '',
        DateFin: '',
        Price: ''
    });

    const [CheckHisto, setCheckHisto] = useState([]);
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const validForm = () => {
        const errors = {};
        if (!AjoutReservation.name) errors.name = 'Ce champ est requis !';
        if (!AjoutReservation.firstname) errors.firstname = 'Ce champ est requis !';
        if (!AjoutReservation.email) errors.email = 'Ce champ est requis !';
        if (!AjoutReservation.adresse) errors.adresse = 'Ce champ est requis !';
        if (!AjoutReservation.contact) errors.contact = 'Ce champ est requis !';
        return errors;
    };

    const fetchCarCheck = async () => {
        try {
            const checkList = await ApiService.get(`/detail/${id}`);
            setCarCheck(checkList.data.detailCar);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUser = async () => {
        try {
            const user = await ApiService.get('/users');
            const filteredUsers = user.data.filter(user => user.id !== parseInt(loggedInUserId));
            setListUser(filteredUsers);
        } catch (error) {
            console.error(error);
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

    const isDateDisabled = (date) => {
        // Fonction pour vérifier si la date est déjà réservée
        return CheckHisto.some(reservation => {
            const start = new Date(reservation.DateDebut);
            const end = new Date(reservation.DateFin);
            return date >= start && date <= end;
        });
    };

    const handleModif = async (e) => {
        e.preventDefault();
        const validationErrors = validForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            const dateDebut = new Date(AjoutReservation.DateDebut);
            const dateFin = new Date(AjoutReservation.DateFin);

            // Calculer le prix total
            const prixParJour = parseFloat(CarCheck.prix?.trim() || 0);
            const diffTemp = dateFin - dateDebut;
            const nbjour = Math.ceil(diffTemp / (1000 * 60 * 60 * 24));
            const totalPrice = nbjour * prixParJour;

            try {
                const response = await ApiService.post(`/location/${id}`, {
                    name: AjoutReservation.name,
                    firstname: AjoutReservation.firstname,
                    email: AjoutReservation.email,
                    adresse: AjoutReservation.adresse,
                    lieu: AjoutReservation.lieu,
                    contact: AjoutReservation.contact,
                    DateDebut: AjoutReservation.DateDebut,
                    DateFin: AjoutReservation.DateFin,
                    Price: totalPrice,
                    latitude: AjoutReservation.latitude,
                    longitude: AjoutReservation.longitude
                });
                if (response.data.messageError) {
                    toast.error(response.data.messageError);
                } else if (response.data.message) {
                    toast.success(response.data.message);
                    navigate('/Home/Historique');
                }
            } catch (error) {
                toast.error("Erreur lors de l'enregistrement");
                console.error(error);
            }
        }
    };

    const fetchCarResrved = async () => {
        const response = await ApiService.get(`/histotab/${id}`);
        setCheckHisto(response.data.hitotab);
        const histo = response.data.hitotab.map((event) => {
            const dateStart = event.DateDebut;
            const dateEnd = event.DateFin;
            const dateStartString = dateStart.replace(/-/g, ',');
            const dateEndString = dateEnd.replace(/-/g, ',');
            const start = new Date(dateStartString);
            const end = new Date(dateEndString);
            return {
                title: event.statut === 'confirmed' ? 'Locations en cours'
                    : event.statut === 'uncofirmed' ? 'Locations non confirmée'
                        : 'En attente de confirmation',
                title: event.statut === 'confirmed' ? 'Locations en cours'
                    : event.statut === 'uncofirmed' ? 'Locations non confirmée'
                        : 'En attente de confirmation',
                start: start,
                end: end,
                status: event.statut,
            };
        });
        setEvents(histo);
    };

    const eventStyleGetter = (event) => {
        const backgroundColor = event.status === 'confirmed' ? 'green' : event.status === 'uncofirmed' ? 'red' : 'gray';
        const style = {
            backgroundColor: backgroundColor,
            color: 'white',
            borderRadius: '5px',
            padding: '5px',
        };
        return {
            style: style
        };
    };



    const resetForm = () => {
        // setFormValues({ name: '', latitude: '', longitude: '' });
        setCurrentMap(null);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

    };

    useEffect(() => {
        fetchCarCheck();
        fetchUser();
        fetchCarResrved();
    }, [id]);

    const localizer = momentLocalizer(moment);
    const [events, setEvents] = useState([]);
    // end calendrier

    // start controller rangepicker
    const { combine, allowedMaxDays, beforeToday } = DateRangePicker;
    const [selectedDates, setSelectedDates] = useState([null, null]);
    const handleDateRangeChange = (value) => {
        setSelectedDates(value);
        if (value && value.length === 2) {
            setAjoutReservation({
                ...AjoutReservation,
                DateDebut: value[0].toISOString().split('T')[0],
                DateFin: value[1].toISOString().split('T')[0]
            });
        }
    };
    return (
        <div className='ReservBlock reservation-container'>
            <form onSubmit={handleModif} className="contentReserv">
                <div className="NavTop">
                    <h1>Reservation <FaCalendarCheck className='Calendar' /></h1>
                    <span>{CarCheck.prix}Ar/jrs</span>
                </div>
                <div className="NavBottom">
                    <div className='NavLeft'>
                        <div className="inputCarat ">
                            <label htmlFor="DateDebut">Début de la location</label>
                            <DateRangePicker
                                placeholder="Sélectionnez la période"
                                value={selectedDates}
                                onChange={handleDateRangeChange}
                                shouldDisableDate={beforeToday()}
                                className='inputrange'
                            />

                        </div>
                        <div className="inputCarat">
                            <label htmlFor="nom">Nom</label>
                            <input type="text"  className={`input ${errors.name ? 'input-error' : ''}`} name='name' placeholder='' onChange={handleChange} />
                            {errors.name && <p className="error-text">{errors.name}</p>}
                        </div>
                        <div className="inputCarat">
                            <label htmlFor="prenom">Prenom</label>
                            <input type="text" className={`input ${errors.firstname ? 'input-error' : ''}`} name='firstname' onChange={handleChange} />
                            {errors.firstname && <p className="error-text">{errors.firstname}</p>}
                        </div>
                        <div className="inputCarat">
                            <label htmlFor="email">E-mail</label>
                            <input type="text" className={`input ${errors.email ? 'input-error' : ''}`} name='email' onChange={handleChange} />
                            {errors.email && <p className="error-text">{errors.email}</p>}
                        </div>
                        <div className="inputCarat">
                            <label htmlFor="contact">Contact</label>
                            <input type="text" className={`input ${errors.contact ? 'input-error' : ''}`} name='contact' onChange={handleChange} />
                            {errors.contact && <p className="error-text">{errors.contact}</p>}
                        </div>
                        <div className="inputCarat">
                            <label htmlFor="lieu">Location de depart</label>
                            <input type="text" className='input' name='lieu' onChange={handleChange} />
                        </div>
                        <div className="inputCarat">
                            <label htmlFor="adresse">Adresse</label>
                            <input type="text" className={`input ${errors.adresse ? 'input-error' : ''}`} name='adresse' onChange={handleChange} />
                            {errors.adresse && <p className="error-text">{errors.adresse}</p>}
                        </div>
                        <div className='inputCarat'>
                            <label htmlFor='longitude'>Longitude</label>
                            <input type="number" className={`input ${errors.longitude ? 'input-error' : ''}`} name='longitude' onChange={handleChange} step="0.0001" placeholder='Longitude' required />
                        </div>
                        <div className='inputCarat'>
                            <label htmlFor='latitude'>Latitude</label>
                            <input type="number" step="0.0001" className={`input ${errors.longitude ? 'input-error' : ''}`} name='latitude' onChange={handleChange} placeholder='latitude' required />
                        </div>
                    </div>
                    <div className='NavRight'>
                        <div className="imgCar">
                            <img src={`${API_URL}/viewimage/${CarCheck.photo}`} alt={CarCheck.marque} />
                        </div>
                        <button
                            type='submit'
                            className='btn'
                        >
                            {currentMap ? 'Modifier' : 'Valider'}
                        </button>
                    </div>
                </div>


            </form>
            <button >Obtenir des coordonnées</button>
            <div className="histo">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    eventPropGetter={eventStyleGetter}
                    style={{ height: 400 }}
                />
            </div>
        </div>
    );
}

export default Reservation;
