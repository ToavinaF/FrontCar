import React from 'react'
import './Historique.scss'
import {useTranslation} from 'react-i18next';

const Historique = () => {
    const { t } = useTranslation();
    return (
        <div className='Historique'>
            <div className="title-histo">
                <h2><span> Hi, Welcome back! </span></h2>
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
                            <tr>
                                <td><strong className='id-col'>01</strong></td>
                                <td><span className='donner'> Mr.Toavina </span></td>
                                <td><span> HIUNDAY </span></td>
                                <td><span> 1234 TBA </span></td>
                                <td><span> 01/08/2024 </span></td>
                                <td><span> 05/08/2024 </span></td>
                                <td><span className='regle'>Non Reglé</span></td>
                                <td><span> 200.000 Ar </span></td>
                                <td><span className='three'>%</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Historique