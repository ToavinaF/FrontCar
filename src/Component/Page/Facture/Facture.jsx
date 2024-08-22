import React, { useEffect, useState } from 'react';
import './Facture.scss';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { IoCarSport } from 'react-icons/io5';

const Facture = () => {
    const { id } = useParams();
    const location = useLocation(); // Récupérer l'emplacement pour accéder aux réservations sélectionnées
    const [fact, setFact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetchData();
    }, []); 

    const fetchData = async () => {
        setLoading(true);
        setError(null); 
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/factureindi/${id}`);
            setFact(response.data); 
        } catch (error) {
            console.log("Erreur lors de la récupération des données:", error);
            setError("Erreur lors de la récupération des données."); 
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>{error}</div>; 
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Récupérer les réservations sélectionnées
    const selectedReservations = location.state?.selectedReservations || [];
    const totalPrice = selectedReservations.reduce((total, reservation) => {
        const nbJours = Math.ceil((new Date(reservation.DateFin) - new Date(reservation.DateDebut)) / (1000 * 60 * 60 * 24));
        const subTotal = Number(reservation.prix) * nbJours; 
        return total + subTotal;
    }, 0);
   
    // Calculer le nombre total de jours
    const totalDays = selectedReservations.reduce((total, reservation) => {
        const days = Math.ceil((new Date(reservation.DateFin) - new Date(reservation.DateDebut)) / (1000 * 60 * 60 * 24));
        return total + days;
    }, 0);

    const qrData = `
        Email: ${fact.email}
        Contact: ${fact.contact}

        Nom: ${fact.name}
        Date de réservation: ${formatDate(fact.created_at)}
       
        Prix total: ${totalPrice}
        Matricule: ${selectedReservations.map(reservation => reservation.matricule).join(', ')}
        Marque: ${selectedReservations.map(reservation => reservation.marque).join(', ')}
    `;

    return (
        <div className='facture'>
            <div className='subheader'></div>
            <div className='header'>
                <div className='left'>
                    <div className='titre'>
                        <h1>FACTURE</h1>
                    </div>
                    <div className='Entreprise'>
                        <ul>
                            <li>Adresse entreprise</li>
                            <li>Ville entreprise</li>
                            <li>Contact entreprise</li>
                            <li>Email@entreprise.com</li>
                        </ul>
                    </div>
                </div>
                <div className='right'>
                    <div className='logo'>
                        <IoCarSport className='icon_logo' />
                        <h1>Location Cars</h1>
                    </div>
                    <div className='vehicule__info'>
                        <div>
                            <div className='facture__numero'>N° Facture: 000{fact.id_reservations}</div>
                            <div className='facture__date'>
                                <p>Date de facture</p>
                                {formatDate(fact.created_at)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='contents'>
                <div className='contents__one'>
                    <div className='left'>
                        <ul>
                            <li>
                                <h3>Nom</h3>
                                <p>{fact.name}</p>
                            </li>
                            <li>
                                <h3>Adresse</h3>
                                <p>{fact.adresse}</p>
                            </li>
                        </ul>
                    </div>
                    <div className='right'>
                        <ul>
                            <li>
                                <h3>Numéro de téléphone</h3>
                                <p>{fact.contact}</p>
                            </li>
                            <li>
                                <h3>Email</h3>
                                <p>{fact.email}</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='contents__two'>
                    <h1>Détails de la location</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Description de la voiture</th>
                                <th>Période de location</th>
                                <th>Prix par jour</th>
                                <th>Nombre de jours</th>
                                <th>Sous-total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedReservations.map((reservation, index) => {
                                const nbJours = Math.ceil((new Date(reservation.DateFin) - new Date(reservation.DateDebut)) / (1000 * 60 * 60 * 24));
                                const subTotal = Number(reservation.prix) * nbJours; // Calculer le sous-total
                                return (
                                    <tr key={index}>
                                        <td>{reservation.marque} {reservation.matricule}</td>
                                        <td>{formatDate(reservation.DateDebut)} - {formatDate(reservation.DateFin)}</td>
                                        <td>{reservation.prix}</td>
                                        <td>{nbJours}</td>
                                        <td>{subTotal}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3"></td>
                                <td>Total</td>
                                <td>{totalPrice}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
               
                <div className='qr__code'>
                    <h1>QR Code</h1>
                    <div className='qr'>
                        <QRCode className='QRCODE' value={qrData} />
                    </div>
                </div>
            </div>

            <div className='footer'></div>
            <div className='subfooter'></div>
        </div>
    );
}

export default Facture;
