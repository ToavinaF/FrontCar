import React, { useEffect, useMemo, useState } from 'react';
import './Historique.scss';
import { BsThreeDots } from "react-icons/bs";
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApiService from '../../../axiosConfig';
import { CircularProgress } from '@mui/material';

function HistoriqueCarBreakdown() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [Histo, setHisto] = useState([]);
    const [isActive, setIsActive] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [vehicules, setVehicules] = useState([]);
    const [selectedVehicule, setSelectedVehicule] = useState({});
    const [statut, setStatut] = useState("");
    const [load, setload] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await fetchHistorique();
        };
        fetchData();
    }, []);

    const fetchHistorique = async () => {
        try {
            const response = await ApiService.get('/maintenance/historique');
            setHisto(response.data);
        } catch (error) {
            toast.error("Erreur lors de la récupération de l'historique.");
        } 
    };

  

    const suppr = async (id) => {
        setload(true);
        try {
            await ApiService.delete(`maintenance/delete/${id}`);
            setHisto(Histo.filter(histo => histo.id !== id));
            toast.success('Réservation supprimée avec succès');
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
        setload(false);
    };



    const formatDate = (d)=>{
        const date = new Date(d);
        return date.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
    }
    return (
        <div className='Historique'>
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
                                    <th><span> {t('MOTIF')} </span></th>
                                    <th><span> {t('MARQUE')} </span></th>
                                    <th><span> {t('MATRICULE')} </span></th>
                                    <th><span> {t('Description')} </span></th>
                                    <th><span> {t('Date')} </span></th>
                                    <th>{t('Actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Histo.map((histo, index) => (
                                    <tr key={index}>
                                        <td><strong className='id-col'>{index}</strong></td>
                                        <td>{histo.label}</td>
                                        <td>{histo.vehicules.marque}</td>
                                        <td>
                                            { histo.vehicules.matricule}
                                        </td>
                                        <td>{histo.vehicules.description}</td>
                                    
                                        <td>
                                           {formatDate(histo.created_at)}
                                        </td>
                                        
                                        <td style={{ cursor: 'pointer' }}>
                                           {
                                            !load?
                                            <RiDeleteBin6Fill />
                                            :
                                            <CircularProgress size={15}/>
                                           }
                                            
                                            <a onClick={() => suppr(histo.id)}>{t(' Delete')}</a>
                                            
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HistoriqueCarBreakdown;
