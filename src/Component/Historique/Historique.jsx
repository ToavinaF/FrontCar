import React, { useEffect, useState } from 'react';
import './Historique.scss';
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

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
        setIsActive(isActive === index ? null : index);
    };

    const calculateTotalPrice = (DateDebut, DateFin, prix) => {
        const startDate = new Date(DateDebut);
        const endDate = new Date(DateFin);
        const timeDiff = endDate - startDate;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); 
        return daysDiff * prix;
    };

    const handleEdit = (histo) => {
        setEditingId(histo.id_reservations);
        setEditedData({
            client_name: histo.client_name,
            DateDebut: histo.DateDebut,
            DateFin: histo.DateFin,
            PriceTotal: histo.PriceTotal,
            prix: histo.prix,
            vehicule_id: histo.vehicule_id // Ajoutez le champ vehicule_id pour l'historique
        });
        const selected = vehicules.find(v => v.id === histo.vehicule_id);
        if (selected) {
            setSelectedVehicule(selected);
        }
    };

    const handleSave = async (id) => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/update/${id}`, editedData);
            const updatedHisto = Histo.map(histo => {
                if (histo.id_reservations === id) {
                    return { ...histo, ...response.data }; 
                }
                return histo;
            });
            setHisto(updatedHisto);
            setEditingId(null); // Réinitialiser l'édition
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
        }
    };

    const suppr = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/suppr/${id}`);
            setHisto(Histo.filter(histo => histo.id_reservations !== id));
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    const handleVehiculeChange = (event) => {
        const vehiculeId = event.target.value;
        const selected = vehicules.find(v => v.id === parseInt(vehiculeId));
        setSelectedVehicule(selected || {});
        setEditedData({
            ...editedData,
            vehicule_id: vehiculeId,
            prix: selected?.prix || 0,
            PriceTotal: calculateTotalPrice(editedData.DateDebut, editedData.DateFin, selected?.prix || 0)
        });
    };

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
                                    <td><strong className='id-col'>{histo.id_reservations}</strong></td>
                                    <td>{histo.client_name}</td>
                                    <td>
                                    {editingId === histo.id_reservations ? (
                                        selectedVehicule.marque
                                    ) : (
                                        histo.marque
                                    )}
                                    </td>
                                    <td>
                                        {editingId === histo.id_reservations ? (
                                            <select value={editedData.vehicule_id || ''} onChange={handleVehiculeChange}>
                                                <option value="">{(histo.matricule)}</option>
                                                {vehicules.map(vehicule => (
                                                    <option key={vehicule.id} value={vehicule.id}>{vehicule.matricule}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            histo.matricule
                                        )}
                                    </td>
                                    <td>{editingId === histo.id_reservations ? (
                                        selectedVehicule.prix
                                    ) : (
                                        histo.prix
                                    )}</td>
                                    <td>
                                        {editingId === histo.id_reservations ? (
                                            <input
                                                type="date"
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
                                        {editingId === histo.id_reservations ? (
                                            <input
                                                type="date"
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
                                        {editingId === histo.id_reservations ? (
                                            <input
                                                type="number"
                                                value={editedData.PriceTotal}
                                                onChange={e => setEditedData({ ...editedData, PriceTotal: e.target.value })}
                                            />
                                        ) : (
                                            histo.PriceTotal
                                        )}
                                    </td>
                                    <td>
                                        <BsThreeDots className={`three ${isActive === index ? 'active' : ''}`} onClick={() => handleMenu(index)} />
                                        {isActive === index && (
                                            <div className='menu'>
                                                <ul>
                                                    <li><a onClick={() => suppr(histo.id_reservations)}>Supprimer</a></li>
                                                    <li>
                                                        {editingId === histo.id_reservations ? (
                                                            <a onClick={() => handleSave(histo.id_reservations)}>Sauvegarder</a>
                                                        ) : (
                                                            <a onClick={() => handleEdit(histo)}>Modifier</a>
                                                        )}
                                                    </li>
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
