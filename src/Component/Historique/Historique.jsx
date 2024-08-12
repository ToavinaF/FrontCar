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

    const fetchHistorique = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/historique");
            setHisto(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'historique:", error);
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

    useEffect(() => {
        fetchHistorique();
        fetchVehicules();
    }, []);

    const handleMenu = (index) => {
        setIsActive(index); // Affiche le menu
        setTimeout(() => {
            setIsActive(null); // Cache le menu après 0,5 seconde
        }, 1500); // 500 ms
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
        const selected = vehicules.find(v => v.id === histo.vehicule_id);
        if (selected) {
            setSelectedVehicule(selected);
        }
    };


    const suppr = async (id) => {
        console.log("Suppression de l'ID:", id);
        try {
            await axios.delete(`http://127.0.0.1:8000/api/suppr/${id}`);
            setHisto(Histo.filter(histo => histo.id_locations !== id));
            toast.success('Réservation supprimée avec succès');
        } catch (error) {
            console.error('Erreur lors de la suppression:', error); // Affichez toute l'erreur
            if (error.response) {
                console.error('Réponse de l\'API:', error.response.data);
                toast.error(`Erreur lors de la suppression: ${error.response.data.message || error.message}`);
            } else {
                toast.error('Erreur lors de la suppression');
            }
        }
    };


    const handleVehiculeChange = (event) => {
        const vehiculeId = event.target.value;
        const selected = vehicules.find(v => v.id === parseInt(vehiculeId));
        setSelectedVehicule(selected || {});
        setEditedData({
            ...editedData,
            vehicule_id: vehiculeId,
            PriceTotal: calculateTotalPrice(editedData.DateDebut, editedData.DateFin, selected?.prix || 0)
        });
    };


    const handleSave = async (id) => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/update/${id}`, editedData);
            const updatedHisto = Histo.map(histo => {
                if (histo.id_locations === id) {
                    return { ...histo, ...response.data };
                }
                return histo;
            });
            setHisto(updatedHisto);
            setEditingId(null);
            toast.success('Réservation mise à jour avec succès');
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error('La date est déjà réservée. Impossible de modifier la réservation.');
            } else {
                toast.error('Erreur lors de la mise à jour.');
            }
        }
    };
    
    // const filteredHistorique = Histo.filter(histo => {
    //     return (
    //         histo.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         histo.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         histo.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         histo.DateDebut.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         histo.DateFin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         histo.PriceTotal.toString().includes(searchTerm.toLowerCase())
    //     );
    // });

    return (
        <div className='Historique'>
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
                            {Histo.map((histo, index) => (
                                <tr key={index}>
                                    <td><strong className='id-col'>{histo.id_locations}</strong></td>
                                    <td>{histo.client_name}</td>
                                    <td>
                                        {editingId === histo.id_locations ? (
                                            selectedVehicule.marque
                                        ) : (
                                            histo.marque
                                        )}
                                    </td>



                                    <td>
                                        {editingId === histo.id_locations ? (
                                            <select value={editedData.vehicule_id || histo.matricule} onChange={handleVehiculeChange}>
                                                <option value="" className="editData">{(histo.matricule)}</option>
                                                {vehicules.map(vehicule => (
                                                    <option key={vehicule.id} value={vehicule.id}>{vehicule.matricule}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            histo.matricule
                                        )}
                                    </td>
                                    <td>{editingId === histo.id_locations ? (
                                        selectedVehicule.prix || histo.prix
                                    ) : (
                                        histo.prix
                                    )}</td>

                                    <td>
                                        {editingId === histo.id_locations ? (
                                            <input
                                                type="date" className="editData"
                                                value={editedData.DateDebut}
                                                onChange={e => setEditedData({
                                                    ...editedData,
                                                    DateDebut: e.target.value,
                                                    PriceTotal: calculateTotalPrice(e.target.value, editedData.DateFin, editedData.prix)
                                                })}
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
                                                onChange={e => setEditedData({
                                                    ...editedData,
                                                    DateFin: e.target.value,
                                                    PriceTotal: calculateTotalPrice(editedData.DateDebut, e.target.value, editedData.prix)
                                                })}
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
                                                value={calculateTotalPrice(editedData.DateDebut, editedData.DateFin, selectedVehicule.prix) || editedData.PriceTotal}
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
    );
}

export default Historique;
