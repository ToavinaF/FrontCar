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
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import IconUrl from 'leaflet/dist/images/marker-icon.png';
import ShadowUrl from 'leaflet/dist/images/marker-shadow.png';
import IconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: IconRetinaUrl,
    iconUrl: IconUrl,
    shadowUrl: ShadowUrl,
});

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
    const [showMap, setShowMap] = useState(false);
    const [center, setCenter] = useState([-18.903288, 47.521504]);
    const [AjoutReservation, setAjoutReservation] = useState({
        name: '',
        firstname: '',
        email: '',
        adresse: '',
        lieu: '',
        latitude: null,
        longitude: null,
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
        if (name === 'lieu') {
            setShowMap(true);
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




    useEffect(() => {
        fetchCarCheck();
        fetchUser();
        fetchCarResrved();
    }, [id]);


    const handleMapInteractions = (map) => {
        const popup = L.popup();

        function onMapClick(e) {
            popup
                .setLatLng(e.latlng)
                .setContent(` ${e.latlng.toString()}`)
                .openOn(map);
        }

        map.on('click', onMapClick);

        return () => {
            map.off('click', onMapClick);
        };

    };
    // const MapCenter = () => {
    //     const map = useMap();

    //     useEffect(() => {
    //         if (center) {
    //             map.setView(center, 6);
    //         }
    //         handleMapInteractions(map);
    //     }, [center, map]);

    //     return null;
    // };
    // const handleMapClick = (e) => {
    //     const { lat, lng } = e.latlng;

    //     const popupContent = `
    //         <div>
    //             <p>Latitude: ${lat.toFixed(4)}</p>
    //             <p>Longitude: ${lng.toFixed(4)}</p>
    //             <button id="confirm-button" class="primary" data-lat="${lat}" data-lng="${lng}">
    //                 Obtenir (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)})
    //             </button>
    //         </div>
    //     `;

    //     // Créez la popup et ouvrez-la
    //     L.popup()
    //         .setLatLng(e.latlng)
    //         .setContent(popupContent)
    //         .openOn(e.target);

    //     // Ajoutez un gestionnaire d'événements pour le bouton de confirmation
    //     const mapDiv = document.querySelector('.leaflet-popup-content');
    //     mapDiv?.addEventListener('click', (event) => {
    //         if (event.target.id === 'confirm-button') {
    //             const lat = parseFloat(event.target.getAttribute('data-lat'));
    //             const lng = parseFloat(event.target.getAttribute('data-lng'));
    //             setAjoutReservation(prevState => ({
    //                 ...prevState,
    //                 latitude: lat,
    //                 longitude: lng,
    //                 lieu: location

    //             }));
    //         }
    //     }, { once: true });
    // };
    const handleMapClick = async (e) => {
        const { lat, lng } = e.latlng;

        // Appel à l'API de géocodage inversé pour obtenir l'adresse
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
                params: {
                    lat,
                    lon: lng,
                    format: 'json',
                },
            });

            const address = response.data.address;
            const location = `${address.road ? address.road + ', ' : ''}${address.village || address.city || address.town || ''}`;

            // Mise à jour de l'état avec les nouvelles coordonnées et l'adresse
            setAjoutReservation(prevState => ({
                ...prevState,
                latitude: lat,
                longitude: lng,
                lieu: location
            }));

            // Affichage du popup avec les coordonnées et l'adresse
            L.popup()
                .setLatLng(e.latlng)
                .setContent(`
                    <div>
                        <p>Latitude: ${lat.toFixed(4)}</p>
                        <p>Longitude: ${lng.toFixed(4)}</p>
                        <p>Lieu: ${location}</p>
                        
                    </div>
                `)
                .openOn(e.target);

        } catch (error) {
            console.error("Erreur lors de la récupération de l'adresse :", error);
        }
    };
    // const handleMapClick = async (e) => {
    //     const { lat, lng, lieu } = e.latlng;
    //     const popupContent = `
    //     <div>
    //         <p>Latitude: ${lat.toFixed(4)}</p>
    //         <p>Longitude: ${lng.toFixed(4)}</p>
    //         <p>Lieu: ${lieu.toFixed(10)}</p>
    //         <button id="confirm-button" class="primary" data-lat="${lat}" data-lng="${lng}">
    //             Obtenir (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}, lieu: ${lieu.toFixed(10)})
    //         </button>
    //     </div>
    // `;
    //     // Créez la popup et ouvrez-la
    //     L.popup()
    //         .setLatLng(e.latlng)
    //         .setContent(popupContent)
    //         .openOn(e.target);
    //     // Ajoutez un gestionnaire d'événements pour le bouton de confirmation
    //     const mapDiv = document.querySelector('.leaflet-popup-content');
    //     mapDiv?.addEventListener('click', (event) => {
    //         if (event.target.id === 'confirm-button') {
    //             const lat = parseFloat(event.target.getAttribute('data-lat'));
    //             const lng = parseFloat(event.target.getAttribute('data-lng'));
    //             setAjoutReservation(prevState => ({
    //                 ...prevState,
    //                 latitude: lat,
    //                 longitude: lng,
    //                 lieu: location

    //             }));
    //         }
    //     }, { once: true });
    //     // Appel à l'API de géocodage inversé pour obtenir l'adresse
    //     try {
    //         const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
    //             params: {
    //                 lat,
    //                 lon: lng,
    //                 format: 'json',
    //             },
    //         });

    //         const address = response.data.address;
    //         const location = `${address.road ? address.road + ', ' : ''}${address.city || address.town || address.village || ''}`;

    //         setAjoutReservation(prevState => ({
    //             ...prevState,
    //             latitude: lat,
    //             longitude: lng,
    //             lieu: location
    //         }));
    //     } catch (error) {
    //         console.error("Erreur lors de la récupération de l'adresse :", error);
    //     }
    // };

    const MapClickHandler = () => {
        useMapEvents({
            click: handleMapClick,
        });
        return null;
    };

    useEffect(() => {
        fetchCarCheck();
        fetchUser();
        fetchCarResrved();

        return () => {
            document.querySelectorAll('#confirm-button').forEach(button => {
                button.removeEventListener('click', handleConfirmButtonClick);
            });
        };
    }, [id]);
    const handleConfirmButtonClick = (event) => {
        const lat = parseFloat(event.target.getAttribute('data-lat'));
        const lng = parseFloat(event.target.getAttribute('data-lng'));
        setAjoutReservation(prevState => ({
            ...prevState,
            latitude: lat,
            longitude: lng
        }));
    };

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
                            <input type="text" className={`input ${errors.lieu ? 'input-error' : ''}`} name='lieu' value={AjoutReservation.lieu || ''} onChange={handleChange} />
                        </div>

                        <div className="inputCarat">
                            <label htmlFor="adresse">Adresse</label>
                            <input type="text" className={`input ${errors.adresse ? 'input-error' : ''}`} name='adresse' onChange={handleChange} />
                            {errors.adresse && <p className="error-text">{errors.adresse}</p>}
                        </div>
                        <div className='inputCarat'>
                            
                            <input
                                type="hidden"
                                className={`input ${errors.longitude ? 'input-error' : ''}`}
                                name='longitude'
                                value={AjoutReservation.longitude || ''}
                                onChange={handleChange}
                            />
                            {errors.longitude && <p className="error-text">{errors.longitude}</p>}
                        </div>

                        <div className='inputCarat'>
                            
                            <input
                                type="hidden"
                                className={`input ${errors.latitude ? 'input-error' : ''}`}
                                name='latitude'
                                value={AjoutReservation.latitude || ''}
                                onChange={handleChange}
                            />
                            {errors.latitude && <p className="error-text">{errors.latitude}</p>}
                        </div>
                    </div>

                    <div className='NavRight'>
                        <div className="imgCar">
                            {showMap ? (
                                <MapContainer
                                    center={center}
                                    zoom={13}
                                    style={{ height: "100%", width: "100%" }}
                                    onClick={handleMapClick}
                                    minZoom={6}
                                    maxBounds={[
                                        [-26.0, 42.0],
                                        [-11.0, 51.0],
                                    ]}
                                    maxBoundsViscosity={1.0}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />

                                    <MapClickHandler />
                                    {maps.map((map, index) => (
                                        <Marker
                                            key={index}
                                            position={[map.latitude, map.longitude, map.lieu]}
                                        >
                                            <Popup>
                                                <span>Latitude: {map.latitude}</span><br />
                                                <span>Longitude: {map.longitude}</span> <br/>
                                               <span>Lieu: {map.lieu}</span> 
                                            </Popup>
                                        </Marker>
                                    ))}
                                </MapContainer>
                            ) : (
                                    <img src={`${BASE_URL}/storage/GalerieVehicule/${CarCheck.photo}`} alt={CarCheck.marque} />

                                
                            )}
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
            <div className='mapContainer'>

            </div>


         
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
