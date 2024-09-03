import axios from 'axios';
import React, { useEffect, useState } from 'react'
import{FaTaxi, FaCar, FaCommentDots, FaUsers, FaUserCircle} from 'react-icons/fa';
import{FiCamera, FiCalendar} from 'react-icons/fi';
import ApiService from '../../../../axiosConfig';

const Count = () => {
    const [Reserv, SetReser]= useState(0);
    const [Counter ,SetCount ]= useState(0);
    const [Countvehi, SetCountVehi] = useState(0);
    const [counterCli , SetCounterCli] = useState(0);
    useEffect(()=>{
        fetchData();
    },[])
    const fetchData = async () => {
        try {
            const usercount =await ApiService.get('/CountUser')
            SetCount(usercount.data.counter);
            SetCountVehi(usercount.data.vehi);
            SetReser(usercount.data.res);
            SetCounterCli(usercount.data.cli);
            console.log(usercount);
        } catch (error) {
            console.log("verifier le code");
        }
    }
  return (
    <div className='dash__cards'>
         <div className='single__car'>
            <div className='card__content'>
                <h4>Vehicule</h4>
                <span>{Countvehi}</span>
            </div>
            <div className='card__icon'>
                <FaCar color="rgb(130, 5, 161)"/>
            </div>
        </div>
        
        <div className='single__car'>
        
            <div className='card__content'>

                <h4>Utilisateur</h4>
                <span>{Counter}</span>
            </div>
            <span className='card__icon'>

                <FaUsers color="rgb(255, 251, 0)"/>
            </span>
        </div>

            <div className='single__car'>
                <div className='card__content'>
                    <h4>reservation</h4>
                    <span>{Reserv}</span>
                </div>
                <span className='card__icon'>
                    <FiCalendar color="rgb(255, 251, 0)" />
                </span>
            </div>

            <div className='single__car'>
                <div className='card__content'>
                    <h4>Client</h4>
                    <span>{counterCli}</span>
                </div>
                <span className='card__icon'>
                    <FaUserCircle  color='rgb(0, 255, 213)' />
                </span>
            </div>
        </div>
    );
};

export default Count;
