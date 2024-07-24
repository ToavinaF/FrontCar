import React from 'react'
import './Reservation.scss'
import Sary from '../../assets/saert.jpeg'
import { FaCalendarCheck } from 'react-icons/fa'

function Reservation() {
    return (
        <div className='ReservBlock'>
            <div className="contentReserv">
                <div className="NavTop">
                    <h1>Reservation <FaCalendarCheck className='Calendar' /></h1>

                    <span>30.000 Ar/jrs</span>
                </div>
                <div className="NavBottom">
                    <div className='NavLeft'>
                        <div className="inputCarat">
                            <label htmlFor="">Debut du location</label>
                            <input type="date" placeholder='' className='input' />
                        </div>
                        <div className="inputCarat">
                            <label htmlFor="">Fin du location</label>
                            <input type="date" placeholder='' className='input' />
                        </div>
                        <div className="inputCarat">
                            <label htmlFor="">Le client</label>
                            <input type="text" placeholder='' className='input' />
                        </div>
                    </div>
                    <div className='NavRight'>
                        <div className="imgCar">
                            <img src={Sary} alt="" />
                        </div>
                        <button className='btn'>Valider</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Reservation
