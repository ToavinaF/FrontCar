// Client.js

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
        unconfirmed: 0,
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

    const getStatusClass = (status) => {
        switch (status) {
            case 'unconfirmed':
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
        fetchReservationCounts();
    }, [id]);

    const fetchReservationCounts = async () => {
        try {
            const response = await ApiService.get(`/countReservedClient/${id}`);
            setReservationCounts({
                total: response.data.total || 0,
                unconfirmed: response.data.unconfirmed || 0,
                confirmed: response.data.confirmed || 0,
                pending: response.data.pending || 0,
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des comptes de réservations :', error);
        }
    };

    const handleSelectReservation = (reservation) => {
        if (reservation.statut !== 'confirmed') {
            toast.error(`La réservation de ${reservation.marque} n'est pas confirmée et ne peut pas être ajoutée à la facture !`);
            return;
        }

        if (selectedReservations.some(selected => selected.id_locations === reservation.id_locations)) {
            toast.warning(`La réservation de ${reservation.marque} est déjà ajoutée à la facture !`);
            return;
        }

        setSelectedReservations([...selectedReservations, reservation]);
        toast.success(`Réservation de ${reservation.marque} ajoutée à la facture !`);
    };

    const handleRemoveReservation = (reservation) => {
        setSelectedReservations(prevSelected => prevSelected.filter(selected => selected.id_locations !== reservation.id_locations));
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
                return total + (Number(reservation.prix) * nbJours);
            }, 0);

            await ApiService.post(`/factures`, {
                client_id: id,
                total_price: total_price,
                reservations: selectedReservations.map(res => res.id_locations),
            });

            toast.success("Facture enregistrée avec succès!");
            setReservations(reservations.map(reservation => selectedReservations.some(selected => selected.id_locations === reservation.id_locations)
                ? { ...reservation, statut: 'fait' }
                : reservation
            ));
            navigate(`/Home/facture/${id}`, { state: { selectedReservations } });
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement de la facture :', error);
            toast.error(error.response?.data.message || 'Erreur lors de l\'enregistrement de la facture.');
        }
    };
    const handleNavigateToListeFactures = () => {
        navigate(`/Home/factures/${id}`);
    };
    return (
        <div className='Client__detail'>
            {client && (
                <>
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
                    <div className='entete'>
                        <div className='row'>
                            <div className='left'>
                                <h4>Statuts des réservations</h4>
                                <ul className='tous'>
                                    <li>Toutes <span className="badge">{reservations.length}</span></li>
                                    <li>annulées <span className="badge annulée">{reservationCounts.unconfirmed || 0}</span></li>
                                    <li>confirmées <span className="badge confirmée">{reservationCounts.confirmed || 0}</span></li>
                                    <li>en attente <span className="badge attente">{reservationCounts.pending || 0}</span></li>
                                </ul>
                            </div>
                            <div className='right'>
                                <button className='button'>
                                    <NavLink className="NavLink" to='/Home/listcar'>+ Nouvelle réservation</NavLink>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className='corps'>
                <div className='factur'>
                    {selectedReservations.length > 0 ? (
                        <button className='factures' onClick={handleNavigateToFacture}>Facture</button>
                    ) : (
                        <button className='factures' onClick={handleNavigateToListeFactures}>Afficher tous les liste des factures</button>
                    )}
                </div>

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
                            {reservations.map((reservation, index) => {
                                const isSelected = selectedReservations.some(selected => selected.id_locations === reservation.id_locations);
                                return (
                                    <tr className='tous' key={index}>
                                        <td>{reservation.marque}</td>
                                        <td>{reservation.matricule}</td>
                                        <td>{reservation.prix}</td>
                                        <td>{new Date(reservation.DateDebut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                        <td>{new Date(reservation.DateFin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                        <td className='etats'>
                                            <span className={getStatusClass(reservation.statut)}>{reservation.statut}</span>
                                        </td>
                                        <td className='menu'>
                                            {reservation.statut === 'fait' ? (
                                                <span>Déjà fait</span>
                                            ) : (
                                                isSelected ? (
                                                    <button className='bout' onClick={() => handleRemoveReservation(reservation)}>Retirer</button>
                                                ) : (
                                                    <button className='bout' onClick={() => handleSelectReservation(reservation)}>Sélectionner</button>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Client;
