import React, { useEffect, useState } from 'react';
import './Historique.scss';
import { BsThreeDots } from "react-icons/bs";
import axios from 'axios';
import {useTranslation} from 'react-i18next';

const Historique = () => {
    const [isActive, setisActive] = useState(null);
    const { t } = useTranslation();

    const handlemenu = (index) => {
        if (isActive === index) {
            setisActive(null);
        } else {
            setisActive(index);
        }
    };

    const [Histo, setHisto] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/Historique");
            setHisto(response.data);
        } catch (error) {
            console.log("Erreur lors de la récupération des données:", error);
        }
    };

    const suppr = (id) => {
        axios.get(`http://127.0.0.1:8000/api/suppr/${id}`)
            .then(() => {
                setHisto(Histo.filter(Histo => Histo.id_reservations !== id));
            })
            .catch(error => {
                console.error('Erreur lors de la suppression:', error);
            });
    };

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
                                <th><span> {t('PATIENT')}</span></th>
                                <th><span> {t('MARQUE')}</span></th>
                                <th><span> {t('MATRICULE')}</span></th>
                                <th><span> {t('DD')}</span></th>
                                <th><span> {t('DF')}</span></th>
                                <th><span> {t('STATUT')}</span></th>
                                <th><span> {t('PRICE')}</span></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {Histo.map((histo, index) => (
                                <tr key={index}>
                                    <td><strong className='id-col'>{histo.id_reservations}</strong></td>
                                    <td>{histo.name}</td>
                                    <td>{histo.marque}</td>
                                    <td>{histo.matricule}</td>
                                    <td>{histo.DateDebut}</td>
                                    <td>{histo.DateFin}</td>
                                    <td><span className='regle'>Non Reglé</span></td>
                                    <td>{histo.PriceTotal}</td>
                                    <td>
                                        <BsThreeDots className={`three ${isActive === index ? 'active' : ''}`} onClick={() => handlemenu(index)} />
                                        {isActive === index && (
                                            <div className='menu'>
                                                <ul>
                                                    <li><a onClick={() => suppr(histo.id_reservations)}>Supprimer</a></li>
                                                
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
};

export default Historique;
