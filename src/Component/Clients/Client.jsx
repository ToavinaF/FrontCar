import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { BiDotsVerticalRounded } from "react-icons/bi";
import './Client.scss';
import axios from 'axios';

const Client = () => {
    const { id } = useParams();
    const [client, setClient] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [reservationCounts, setReservationCounts] = useState({
        total: 0,
        uncofirmed: 0,
        confirmed: 0,
        pending: 0
    });

    const fetchClient = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/clientdetail/${id}`);
            setClient(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des détails du client :', error);
        }
    };

    const fetchReservations = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/reservationsByClient/${id}`);
            setReservations(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des réservations :', error);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'uncofirmed':
                return 'etat annulée';
            case 'confirmed':
                return 'etat confirmée';
            case 'pending':
                return 'etat attente';
            default:
                return 'etat';
        }
    };

    useEffect(() => {
        fetchClient();
        fetchReservations();

        const fetchReservationCounts = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/countReservedClient/${id}`);
                console.log('Réponse des comptes de réservations:', response.data);
                const counts = {
                    total: response.data.total || 0,
                    uncofirmed: response.data.uncofirmed || 0,
                    confirmed: response.data.confirmed || 0,
                    pending: response.data.pending || 0,
                };
                setReservationCounts(counts);
            } catch (error) {
                console.error('Erreur lors de la récupération des comptes de réservations :', error);
            }
        };

        fetchReservationCounts();
    }, [id]);

    return (
        <div className='Client__detail'>
            {client && (
                <div className='personnel'>
                    <div className='left'>
                        <div className='Nom'>{client.name}</div>
                        <div className='Prenom'>{client.firstname}</div>
                    </div>
                    <div className='right'>
                        <div className='adresse'>{client.Adresse}</div>
                        <div className='email'>{client.email}</div>
                        <div className='contact'>{client.contact}</div>
                    </div>
                </div>
            )}
            {client && (
                <div className='entete'>
                    <div className='row'>
                        <div className='left'>
                            <ul className='tous'>
                                <li>Toutes les réservations <span className="badge">{reservations.length}</span></li>
                                <li>Réservations annulées <span className="badge">{reservationCounts.uncofirmed || 0}</span></li>
                                <li>Réservations confirmées <span className="badge">{reservationCounts.confirmed || 0}</span></li>
                                <li>Réservations en attente <span className="badge">{reservationCounts.pending || 0}</span></li>
                            </ul>
                        </div>
                        <div className='right'>
                            <button className='button'><NavLink className="NavLink" to='/Home/listcar'> + Nouvelle réservation</NavLink></button>
                        </div>
                    </div>
                </div>
            )}
            <div className='corps'>
                {
                    client && (
                        <div className='factur'>
                        <NavLink to={`/Home/facture/${client.id}`}>
                            <button  className='factures'>Facture</button>
                        </NavLink>
                        </div>
                    )
                }
                <div className='list'>
                    {reservations.map(reservation => (
                        <ul className='tous' key={reservation.id_locations}>
                            <li>Marque Véhicule: {reservation.marque}</li>
                            <li>Matricule: {reservation.matricule}</li>
                            <li>Date Début: {new Date(reservation.DateDebut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</li>
                            <li>Date Fin: {new Date(reservation.DateFin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</li>
                            <li className={getStatusClass(reservation.statut)}>{reservation.statut}</li>
                            <li className='menu'><BiDotsVerticalRounded /></li>
                        </ul>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Client;
