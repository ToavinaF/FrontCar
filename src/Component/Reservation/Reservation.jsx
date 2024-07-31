import React, { useEffect, useState } from 'react';
import './Reservation.scss';
import { FaCalendarCheck } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Reservation() {
    const navigate = useNavigate();
    const { id } = useParams();
    const loggedInUserId = localStorage.getItem('id');
    const [CarCheck, setCarCheck] = useState([]);
    // const [CarCheck, setCarCheck] = useState({});
    const [ListUser, setListUser] = useState([]);
    const [ReservAdd, setReservAdd] = useState({
        id_client: '',
        DateDebut: '',
        DateFin: '',
        Price: ''
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

            setListUser(user.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchReservedDates = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/ReservedDates/${id}`);
            setReservedDates(response.data.map(date => ({ start: new Date(date.DateDebut), end: new Date(date.DateFin) })));
        } catch (error) {
            console.error("Erreur lors de la récupération des dates réservées:", error.response ? error.response.data : error.message);
            setErrorMessage(`Erreur lors de la récupération des dates réservées. Détails: ${error.response ? error.response.data.message : error.message}`);
        }
    };

    const handleChange = (e) => {
        setReservAdd({
            ...ReservAdd,
            [e.target.name]: e.target.value
        });
    };

    const handleModif = async (e) => {
        e.preventDefault();
        const dateDebut = new Date(ReservAdd.DateDebut);
        const dateFin = new Date(ReservAdd.DateFin);
        
        if (dateDebut < new Date()) { // Vérification côté client
            setErrorMessage("La date de début doit être aujourd'hui ou une date future.");
            return;
        }
        
        if (dateDebut >= dateFin) {
            setErrorMessage("La date de début doit être antérieure à la date de fin.");
            return;
        }
        
        if (isDateReserved(dateDebut) || isDateReserved(dateFin)) {
            setErrorMessage("Une ou plusieurs dates choisies sont déjà réservées.");
            return;
        }
    
        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/Reservation/${id}`, {
                id_client: ReservAdd.id_client,
                DateDebut: ReservAdd.DateDebut,
                DateFin: ReservAdd.DateFin,
                Price: CarCheck.prix,
            });
    
            if (response.data.success) {
                setSuccessMessage('Réservation réussie !'); 
                setTimeout(() => {
                    navigate('/Home/Historique'); 
                }, 2000);
            } else {
                setErrorMessage(response.data.error || 'La voiture est déjà prise pour cette date.');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data.errors) {
                    setErrors(error.response.data.errors);
                } else if (error.response.data.error) {
                    setErrorMessage(error.response.data.error);
                } else {
                    setErrorMessage('Votre réservation est bien enregistrée.');
                    navigate('/Home/Historique');
                }
            } else {
                setErrorMessage('Une erreur est survenue.');
            }
        }
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

    const fetchCarResrved = async () => {
        const response = await axios.get("http://127.0.0.1:8000/api/reservVehicul/" + id);
        setCheckHisto(response.data);
        console.log(response.data);
    };

    return (
        <div className='ReservBlock'>
            <form onSubmit={handleModif} className="contentReserv">
                <div className="NavTop">
                    <h1>Reservation <FaCalendarCheck className='Calendar' /></h1>
                    <span>{CarCheck.prix}/jrs</span>
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>} 
                <div className="NavBottom">
                    <div className='NavLeft'>
                        <div className="inputCarat">
                            <label htmlFor="DateDebut">Début de la location</label>
                            <input
                                type="date"
                                className={`input ${isDateReserved(new Date(ReservAdd.DateDebut)) ? 'reserved-date' : ''}`}
                                name='DateDebut'
                                onChange={handleChange}
                                required
                            />
                            {errors.DateDebut && <div className="error">{errors.DateDebut}</div>}
                        </div>
                        <div className="inputCarat">
                            <label htmlFor="DateFin">Fin de la location</label>
                            <input
                                type="date"
                                className={`input ${isDateReserved(new Date(ReservAdd.DateFin)) ? 'reserved-date' : ''}`}
                                name='DateFin'
                                onChange={handleChange}
                                required
                            />
                            {errors.DateFin && <div className="error">{errors.DateFin}</div>}
                        </div>
                        <div className="inputCarat">
                            <label htmlFor="id_client">Le client</label>
                            <select
                                className='input'
                                name='id_client'
                                onChange={handleChange}
                                required
                            >
                                <option value="">Sélectionner un client</option>
                                {ListUser.map((user, i) => (
                                    <option key={i} value={user.id}>{user.name} {user.firstname}</option>
                                ))}
                            </select>
                            {errors.id_client && <div className="error">{errors.id_client}</div>}
                        </div>
                    </div>
                    <div className='NavRight'>
                        <div className="imgCar">
                            <img src={`http://127.0.0.1:8000/storage/ImageVehicule/${CarCheck.photo}`} alt={CarCheck.marque} />
                        </div>
                        <button type='submit' className='btn'>Valider</button>
                    </div>
                </div>
            </form>

           {CheckHisto > [0] &&

            <div className="histo">
            <div className="table-content">
            <h1><span> Recent </span></h1>
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th><span> #</span></th>
                                <th><span>NOM</span></th>
                                <th><span>PRENON</span></th>
                                <th><span>Date de debut</span></th>
                                <th><span> Date fin</span></th>
                                <th><span> Statut</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {CheckHisto.map((check, i)=> (
                                <tr key={i}>
                                <td></td>
                                <td>{check.name}</td>
                                <td>{check.firstname}</td>
                                <td>{check.DateDebut}</td>
                                <td>{check.DateFin}</td>
                                <td><span className='regle'>Reserve</span></td>

                            </tr>
                            ))}
                               
                        
                        </tbody>
                    </table>
                </div>
            </div>
            </div>
           }                         
            
        </div>

        
    );
}

export default Reservation;
