import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Liste = () => {
    const { id } = useParams(); // Récupérer l'ID du client depuis les paramètres d'URL
    const [factures, setFactures] = useState([]);
    const [selectedReservations, setSelectedReservations] = useState([]);

    useEffect(() => {
        const fetchFactures = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/factures/client/${id}`);
                setFactures(response.data.factures);
            } catch (error) {
                console.error('Erreur lors du chargement des factures :', error);
            }
        };

        fetchFactures();
    }, [id]); // Recharger les données lorsque l'ID du client change
const handleNavigateToFacture = async () =>{
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
}
    return (
        <div className='content-user'>
            <div className='All-user'>
                <h1 className='title-user'>Tous les factures du client</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Facture ID</th>
                            <th>Client ID</th>
                            <th>Total Prix</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {factures.map((facture) => (
                            <tr key={facture.id}>
                                <td>{facture.id}</td>
                                
                                <td>{facture.client_name}</td>
                                <td>{facture.total_price}</td>
                                <td>
                                    <NavLink to={`/Home/facture/${id}`} className='nav_item'>
                                        Voir les détails
                                    </NavLink>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Liste;
