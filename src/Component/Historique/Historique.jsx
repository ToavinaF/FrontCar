import React, { useEffect, useState } from 'react';
import './Historique.scss';
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Historique({ searchTerm }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [Histo, setHisto] = useState([]);
    const [isActive, setIsActive] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [vehicules, setVehicules] = useState([]);
    const [selectedVehicule, setSelectedVehicule] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            await fetchHistorique();
            await fetchVehicules();
        };
        fetchData();
    }, []);

    const [loading, setLoading] = useState(true); // État de chargement

    const fetchHistorique = async () => {
        setLoading(true); // Démarrer le chargement
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/historique");
            setHisto(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'historique:", error);
            toast.error("Erreur lors de la récupération de l'historique.");
        } finally {
            setLoading(false); // Arrêter le chargement
        }
    };

    const fetchVehicules = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/ViewCar");
            setVehicules(response.data.vehicules);
        } catch (error) {
            console.error("Erreur lors de la récupération des véhicules:", error);
        }
    };

    const handleMenu = (index) => {
        setIsActive(index);
        setTimeout(() => setIsActive(null), 1500);
    };

    const calculateTotalPrice = (DateDebut, DateFin, prix) => {
        const startDate = new Date(DateDebut);
        const endDate = new Date(DateFin);
        const timeDiff = endDate - startDate;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysDiff * prix;
    };

    const handleEdit = (histo) => {
        setEditingId(histo.id_locations);
        setEditedData({
            client_name: histo.client_name,
            DateDebut: histo.DateDebut,
            DateFin: histo.DateFin,
            PriceTotal: histo.PriceTotal,
            prix: histo.prix,
            vehicule_id: histo.vehicule_id
        });
    
        
        const filteredVehicules = vehicules.filter(v => v.id === histo.vehicule_id);
        const selected = filteredVehicules.length > 0 ? filteredVehicules[0] : null;
    
        if (selected) {
            setSelectedVehicule(selected);
        }
    };

    const suppr = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/suppr/${id}`);
            setHisto(Histo.filter(histo => histo.id_locations !== id));
            toast.success('Réservation supprimée avec succès');
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleVehiculeChange = (event) => {
        const vehiculeId = event.target.value;
        const selected = vehicules.find(v => v.id === parseInt(vehiculeId));
        setSelectedVehicule(selected || {});
        setEditedData(prevData => ({
            ...prevData,
            vehicule_id: vehiculeId,
            PriceTotal: calculateTotalPrice(prevData.DateDebut, prevData.DateFin, selected?.prix || 0)
        }));
    };
    const handleSave = async (id) => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/update/${id}`, editedData);
    
            // Vérifie que la réponse contient les données mises à jour
            console.log(response.data);
    
            // Recharge l'historique après la mise à jour
            await fetchHistorique(); // Appelle fetchHistorique pour obtenir les données mises à jour
    
            setEditingId(null);
            toast.success('Réservation mise à jour avec succès');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data.error || 'Erreur lors de la mise à jour.');
        }
    };
    // const handleSave = async (id) => {
    //     try {
    //         const response = await axios.post(`http://127.0.0.1:8000/api/update/${id}`, editedData);
    
    //         // Vérifie que la réponse contient les données mises à jour
    //         console.log(response.data); 
    
    //         // Utilise filter pour mettre à jour l'état avec les nouvelles données
    //         setHisto(prevHisto => {
    //             return prevHisto.map(histo => {
    //                 if (histo.id_locations === id) {
    //                     return {
    //                         ...histo,
    //                         ...response.data, // Mets à jour les données de l'historique
    //                     };
    //                 }
    //                 return histo;
    //             });
    //         });
    
    //         // Optionnel : tu peux aussi faire un nouveau fetch pour obtenir toutes les données
    //         // fetchHistorique();
    
    //         setEditingId(null);
    //         toast.success('Réservation mise à jour avec succès');
    //     } catch (error) {
    //         console.error(error);
    //         toast.error(error.response?.data.error || 'Erreur lors de la mise à jour.');
    //     }
    // };
   
    const filteredHistorique = Histo.filter(histo => {
        return (
            histo.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            histo.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
            histo.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
            histo.DateDebut.toLowerCase().includes(searchTerm.toLowerCase()) ||
            histo.DateFin.toLowerCase().includes(searchTerm.toLowerCase()) ||
            histo.PriceTotal.toString().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className='Historique'>
         {loading ? (
            <p>Chargement des données...</p>
        ) : (
           <div>
                <div className="title-histo">
                    <h2><span>{t('hi')} </span></h2>
                </div>
                <div className="table-content">
                    <h1><span> {t('Recentez')} </span></h1>
                    <div className="table">
                        <table>
                            <thead>
                                <tr>
                                    <th><span> #</span></th>
                                    <th><span> {t('PATIENT')} </span></th>
                                    <th><span> {t('MARQUE')} </span></th>
                                    <th><span> {t('MATRICULE')} </span></th>
                                    <th><span> {t('PRIX')} </span></th>
                                    <th><span> {t('DD')} </span></th>
                                    <th><span> {t('DF')} </span></th>
                                    <th><span> {t('STATUT')} </span></th>
                                    <th><span> {t('PRICE')} </span></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHistorique.map((histo, index) => (
                                    <tr key={index}>
                                        <td><strong className='id-col'>{histo.id_locations}</strong></td>
                                        <td>{histo.client_name}</td>
                                        <td>{editingId === histo.id_locations ? (selectedVehicule.marque || histo.marque) : histo.marque}</td>
                                        <td>
                                            {editingId === histo.id_locations ? (
                                                <select value={editedData.vehicule_id} onChange={handleVehiculeChange}>
                                                    <option value="" className="editData">{histo.matricule}</option>
                                                    {vehicules.map(vehicule => (
                                                        <option key={vehicule.id} value={vehicule.id}>{vehicule.matricule}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                histo.matricule
                                            )}
                                        </td>
                                        <td>{editingId === histo.id_locations ? (selectedVehicule.prix || histo.prix) : histo.prix}</td>
                                        <td>
                                            {editingId === histo.id_locations ? (
                                                <input
                                                    type="date" className="editData"
                                                    value={editedData.DateDebut}
                                                    onChange={e => setEditedData(prevData => ({
                                                        ...prevData,
                                                        DateDebut: e.target.value,
                                                        PriceTotal: calculateTotalPrice(e.target.value, editedData.DateFin, selectedVehicule.prix)
                                                    }))}
                                                />
                                            ) : (
                                                histo.DateDebut
                                            )}
                                        </td>
                                        <td>
                                            {editingId === histo.id_locations ? (
                                                <input
                                                    type="date" className="editData"
                                                    value={editedData.DateFin}
                                                    onChange={e => setEditedData(prevData => ({
                                                        ...prevData,
                                                        DateFin: e.target.value,
                                                        PriceTotal: calculateTotalPrice(editedData.DateDebut, e.target.value, selectedVehicule.prix)
                                                    }))}
                                                />
                                            ) : (
                                                histo.DateFin
                                            )}
                                        </td>
                                        <td><span className='regle'>Non Reglé</span></td>
                                        <td>
                                            {editingId === histo.id_locations ? (
                                                <input
                                                    type="number" className="editData"
                                                    value={editedData.PriceTotal || calculateTotalPrice(editedData.DateDebut, editedData.DateFin, selectedVehicule.prix)}
                                                    onChange={e => setEditedData({ ...editedData, PriceTotal: e.target.value })}
                                                />
                                            ) : (
                                                histo.PriceTotal
                                            )}
                                        </td>
                                        <td>
                                            <BsThreeDots
                                                className={`three ${isActive === index ? 'active' : ''}`}
                                                onClick={() => handleMenu(index)}
                                            />
                                            {isActive === index && (
                                                <div className='menu'>
                                                    <ul>
                                                        <li>
                                                            <a onClick={() => suppr(histo.id_locations)}>Supprimer</a>
                                                        </li>
                                                        <li>
                                                            {editingId === histo.id_locations ? (
                                                                <a onClick={() => handleSave(histo.id_locations)}>Sauvegarder</a>
                                                            ) : (
                                                                <a onClick={() => handleEdit(histo)}>Modifier</a>
                                                            )}
                                                        </li>
                                                        {editingId === histo.id_locations && (
                                                            <li>
                                                                <a onClick={() => setEditingId(null)}>Annuler</a>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
           </div>
       
        )}
        </div>
    );
}

export default Historique;
