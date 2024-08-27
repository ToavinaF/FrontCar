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

    // const handleNavigateToFactureid = () => {
    //     // Vérifiez si des réservations ont été sélectionnées
    //     if (selectedReservations.length === 0) {

    //         toast.error("Aucune réservation sélectionnée. Veuillez sélectionner une ou plusieurs réservations pour accéder à la facture.");
    //         return; 
    //     }

    //     // Naviguer vers la page de facture en passant les réservations sélectionnées
    //     navigate(`/Home/facture/${id}`, { state: { selectedReservations } });
    // };
    const handleNavigateToListeFactures = () => {
        navigate(`/Home/factures/${id}`);
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
            const response = await axios.post('http://127.0.0.1:8000/api/factures', {
                client_id: id,
                total_price: selectedReservations.reduce((total, reservation) => {
                    const nbJours = Math.ceil((new Date(reservation.DateFin) - new Date(reservation.DateDebut)) / (1000 * 60 * 60 * 24));
                    const subTotal = Number(reservation.prix) * nbJours;
                    return total + subTotal;
                }, 0),
                reservations: selectedReservations,
            });

            toast.success("Facture enregistrée avec succès!");

            // Mettre à jour l'état des réservations pour refléter les changements
            setReservations(prevReservations =>
                prevReservations.map(reservation => {
                    if (selectedReservations.some(selected => selected.id_locations === reservation.id_locations)) {
                        return { ...reservation, statut: 'déjà fait' };
                    }
                    return reservation;
                })
            );

            navigate(`/Home/facture/${id}`, { state: { selectedReservations } });
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement de la facture :', error);
            if (error.response && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Erreur lors de l\'enregistrement de la facture.');
            }
        }
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
                        <div className='right'>
                            <button className='button'><NavLink className="NavLink" to='/Home/listcar'> + Nouvelle réservation</NavLink></button>
                        </div>
                    </div>
                </div>
            )}

            <div className='corps'>
                {
                    client && selectedReservations.length > 0 && (
                        <div className='factur'>
                            <button className='factures' onClick={handleNavigateToFacture}>Facture</button>
                        </div>
                    )
                }
                {
                    client && selectedReservations.length === 0 && (
                        <div className='factur'>
                            <button className='factures' onClick={handleNavigateToListeFactures}>Afficher tous les liste des factures</button>
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
                            
                            {reservations.map((reservation, index) => {
                                const isSelected = selectedReservations.some(selected => selected.id_locations === reservation.id_locations);
                                return (
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
                                            {reservation.statut === 'déjà fait' ? (
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
