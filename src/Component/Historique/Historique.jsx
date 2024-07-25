import React from 'react'
import './Historique.scss'

const Historique = () => {
    return (
        <div className='Historique'>
            <div className="title-histo">
                <h2>Hi, Welcome back!</h2>
            </div>

            <div className="table-content">
                <h1>Recent Reservation Queue</h1>
                <div className="table">
                    <table>
                        <tr>
                            <th>#</th>
                            <th>PATIENT</th>
                            <th>MARQUE</th>
                            <th>MATRICULE</th>
                            <th>DATE DEBUT</th>
                            <th>DATE FIN</th>
                            <th>STATUT</th>
                            <th>PRICE</th>
                            <th></th>
                        </tr>
                        <tbody>
                            <tr>
                                <td><strong className='id-col'>01</strong></td>
                                <td>Mr.Toavina</td>
                                <td>HIUNDAY</td>
                                <td>1234 TBA</td>
                                <td>01/08/2024</td>
                                <td>05/08/2024</td>
                                <td><span className='regle'>Non Reglé</span></td>
                                <td>200.000 Ar</td>
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