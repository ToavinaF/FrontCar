import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { BiDotsVerticalRounded } from "react-icons/bi";
import './Client.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Client = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [selectedReservations, setSelectedReservations] = useState([]);  // Stocker les réservations sélectionnées
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

    const handleSelectReservation = (reservation) => {
        // Vérifiez si la réservation est déjà sélectionnée
        const isSelected = selectedReservations.some(selected => selected.id_locations === reservation.id_locations);
        
        if (isSelected) {
            // Afficher un message Toast indiquant que la réservation est déjà sélectionnée
            toast.warning(`La réservation de ${reservation.marque} est déjà ajoutée à la facture !`);
            return; // Ne pas ajouter la réservation à la liste
        }
    
        // Ajouter la réservation sélectionnée à la liste
        setSelectedReservations(prevSelected => [...prevSelected, reservation]);
        
        // Afficher un message Toast indiquant l'ajout
        toast.success(`Réservation de ${reservation.marque} ajoutée à la facture !`);
    };

    const handleNavigateToFacture = () => {
        // Naviguer vers la page de facture en passant les réservations sélectionnées
        navigate(`/Home/facture/${id}`, { state: { selectedReservations } });
    };

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
                                <h4>Statuts des réservations</h4>
                            <ul className='tous'>
                                <li> Toutes  <span className="badge">{reservations.length}</span></li>
                                <li> annulées <span className="badge annulée">{reservationCounts.uncofirmed || 0}</span></li>
                                <li> confirmées <span className="badge confirmée">{reservationCounts.confirmed || 0}</span></li>
                                <li> en attente <span className="badge attente">{reservationCounts.pending || 0}</span></li>
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
                            <button className='factures' onClick={handleNavigateToFacture}>Facture</button>
                        </div>
                    )
                }
                <div className='list'>
                    <table className='table' width="100%">
                        <thead>
                            <tr>
                                <th>Marque Véhicule</th>
                                <th>Matricule</th>
                                <th>Prix/jour</th>
                                <th>Date Début</th>
                                <th>Date Fin</th>
                                <th>Statut</th>
                                <th>Ajouter à la facture</th>

                            </tr>

                        </thead>
                        <tbody>
                            {reservations.map((reservation, index) => (
                                <tr className='tous' key={index}>
                                    <td> {reservation.marque}</td>
                                    <td> {reservation.matricule}</td>
                                    <td> {reservation.prix} </td>
                                    <td> {new Date(reservation.DateDebut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                    <td> {new Date(reservation.DateFin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                    <td className='etats'>
                                        <span className={getStatusClass(reservation.statut)}>{reservation.statut}</span>
                                    </td>
                                    <td className='menu'>
                                        <button className='bout' onClick={() => handleSelectReservation(reservation)}>séléctioner</button>
                                        
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                   
                </div>
            </div>
        </div>
    );
};

export default Client;
