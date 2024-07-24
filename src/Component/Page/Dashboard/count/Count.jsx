import React from 'react'
import{FaTaxi, FaCar, FaCommentDots, FaUsers} from 'react-icons/fa';
import{FiCamera, FiCalendar} from 'react-icons/fi';

const Count = () => {
  return (
    <div className='dash__cards'>
         <div className='single__car'>
            <div className='card__content'>
            <hr/>
                <h4>Vehicule</h4>
                <span>41</span>
            </div>
            <div className='card__icon'>
            <hr/>
                <FaCar color="#3888a7"/>
            </div>
        </div>
        
        <div className='single__car'>
        
            <div className='card__content'>
            <hr/>

                <h4>Utilisateur</h4>
                <span>41</span>
            </div>
            <span className='card__icon'>
            <hr/>

                <FaUsers color="var(--color-principal)"/>
            </span>
        </div>

        <div className='single__car'>
        
            <div className='card__content'>
            <hr/>

                <h4>Reservation</h4>
                <span>41</span>
            </div>
            <span className='card__icon'>
            <hr/>

                <FiCalendar color="var(--color-principal)"/>
            </span>
        </div>

        <div className='single__car'>
        
            <div className='card__content'>
            <hr/>

                <h4>Message</h4>
                <span>41</span>
            </div>
            <span className='card__icon'>
            <hr/>
                <FaCommentDots color='#2884ff' />
            </span>
        </div>
    </div>
  )
}

export default Count
