import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { BiDotsVerticalRounded } from "react-icons/bi";
import './Client.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApiService from '../../axiosConfig';

const Client = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [selectedReservations, setSelectedReservations] = useState([]); 
    const [reservationCounts, setReservationCounts] = useState({
        total: 0,
        uncofirmed: 0,
        confirmed: 0,
        pending: 0
    });

    const fetchClient = async () => {
        try {
            const response = await ApiService.get(`/clientdetail/${id}`);
            setClient(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des détails du client :', error);
        }
    };

    const fetchReservations = async () => {
        try {
            const response = await ApiService.get(`/reservationsByClient/${id}`);
            setReservations(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des réservations :', error);
        }
    };

    const fetchReservationCounts = async () => {
        try {
            const response = await ApiService.get(`/countReservedClient/${id}`);
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

    useEffect(() => {
        fetchClient();
        fetchReservations();
        fetchReservationCounts();
    }, [id]);

    const handleSelectReservation = (reservation) => {
        if (reservation.statut !== 'confirmed') {
            toast.error(`La réservation de ${reservation.marque} n'est pas confirmée et ne peut pas être ajoutée à la facture !`);
            return;
        }

        const isSelected = selectedReservations.some(selected => selected.id_locations === reservation.id_locations);
        if (isSelected) {
            toast.warning(`La réservation de ${reservation.marque} est déjà ajoutée à la facture !`);
            return;
        }

        setSelectedReservations(prevSelected => [...prevSelected, reservation]);
        toast.success(`Réservation de ${reservation.marque} ajoutée à la facture !`);
    };

    const handleRemoveReservation = (reservation) => {
        setSelectedReservations(prevSelected =>
            prevSelected.filter(selected => selected.id_locations !== reservation.id_locations)
        );
        toast.info(`Réservation de ${reservation.marque} retirée de la facture !`);
    };

    const handleNavigateToFacture = async () => {
        if (selectedReservations.length === 0) {
            toast.error("Aucune réservation sélectionnée. Veuillez sélectionner une ou plusieurs réservations pour accéder à la facture.");
            return;
        }

        try {
            const total_price = selectedReservations.reduce((total, reservation) => {
                const nbJours = Math.ceil((new Date(reservation.DateFin) - new Date(reservation.DateDebut)) / (1000 * 60 * 60 * 24));
                const subTotal = Number(reservation.prix) * nbJours;
                return total + subTotal;
            }, 0);

            await ApiService.post(`/factures`, {
                client_id: id,
                total_price: total_price,
                reservations: selectedReservations,
            });

            toast.success("Facture enregistrée avec succès!");

            setReservations(prevReservations =>
                prevReservations.map(reservation => {
                    if (selectedReservations.some(selected => selected.id_locations === reservation.id_locations)) {
                        return { ...reservation, statut: 'déjà fait' };
                    }
                    return reservation;
                })
            );

            navigate(`/Home/facture/${id}`);
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement de la facture :', error);
            if (error.response && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Erreur lors de l\'enregistrement de la facture.');
            }
        }
    };

    const handleNavigateToListeFactures = () => {
        navigate(`/Home/factures/${id}`);
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
                        <div className='adresse'>{client.adresse}</div>
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
                    </div>
                </div>
            )}
            <div className='table'>
                <div className='header'>
                    <h4>Réservations du client</h4>
                    <button className='factures' onClick={handleNavigateToFacture}>Créer une facture</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Marque</th>
                            <th>Matricule</th>
                            <th>Date Début</th>
                            <th>Date Fin</th>
                            <th>Prix</th>
                            <th>Statut</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((reservation) => (
                            <tr key={reservation.id_locations}>
                                <td>{reservation.id_locations}</td>
                                <td>{reservation.marque}</td>
                                <td>{reservation.matricule}</td>
                                <td>{reservation.DateDebut}</td>
                                <td>{reservation.DateFin}</td>
                                <td>{reservation.prix}</td>
                                <td>{reservation.statut}</td>
                                <td>
                                    {reservation.statut === 'confirmée' && (
                                        <button onClick={() => handleSelectReservation(reservation)}>Ajouter à la facture</button>
                                    )}
                                    <button onClick={() => handleRemoveReservation(reservation)}>Retirer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className='factures' onClick={handleNavigateToListeFactures}>Voir toutes les factures</button>
        </div>
    );
};

export default Client;
