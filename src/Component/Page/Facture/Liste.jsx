import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';

const Liste = () => {
    const { id } = useParams(); // Récupérer l'ID du client depuis les paramètres d'URL
    const [factures, setFactures] = useState([]);

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
