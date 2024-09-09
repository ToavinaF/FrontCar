import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';

const Liste = () => {
    const { id } = useParams(); // Récupérer l'ID du client depuis les paramètres d'URL
    const [factures, setFactures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFactures = async () => {
            setError(null);
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/factures/client/${id}`);
                setFactures(response.data.factures);
            } catch (error) {
                setError("Erreur lors du chargement des factures.");
            } finally {
                setLoading(false); // Assurez-vous de mettre à jour l'état de chargement
            }
        };

        fetchFactures();
    }, [id]); // Recharger les données lorsque l'ID du client change

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='content-user'>
            <div className='All-user'>
                <h1 className='title-user'>Toutes les factures du client</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Facture ID</th>
                            <th>Nom du Client</th>
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
                                    <NavLink 
                                        to={`/Home/facturer/${facture.id}`} 
                                        state={{ selectedReservations: facture.reservations }}
                                        className='nav_item'>
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
