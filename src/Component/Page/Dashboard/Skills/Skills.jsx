import React from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import './Skills.scss'
import 'react-circular-progressbar/dist/styles.css';

const Skills = () => {
    const valeur= [
        {
            id:1,
            titre:'Reservation',
            pourcentage: '50',
        },
       
    ];
  return (

    <div className='skills__container grid'>
        {valeur.map(({titre, pourcentage}, index)=>{
            return(
                <div className='progress__box' key={index}>
                    <div className='progress__circle'>
                        <CircularProgressbar
                            strokeWidth={7.5}
                            text={`${pourcentage}%`}
                            value={pourcentage}
                        />
                    </div>
                    <h3 className='skills__titre'>{titre}</h3>
                </div>
            )
        })}
    </div>

  )
}

export default Skills
