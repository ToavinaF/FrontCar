import React from 'react'
import { FaChartArea, FaStopwatch } from "react-icons/fa";
import Cars from '../../../../assets/images/car-01.png'
import Cars1 from '../../../../assets/images/car-02.png'
import Cars2 from '../../../../assets/images/car-03.png'


import { IoMdSettings } from "react-icons/io";
import { MdLinearScale } from "react-icons/md";


const Car = () => {
  return (
    <>
      <div className='recommend__car-card'>
        <div className='recommend__car-top'>
          <h5><span><FaChartArea /></span></h5>
        </div>
        <div className='recommend__car-img'>
          <img src={Cars} />
        </div>
        <div className='recommend__car-bottom'>
          <h4>Marque</h4>

          <div className='recommend__car-other'>
            <div className='recommend__car-icons'>
              <p>Matricule</p>
              <p><IoMdSettings /></p>
              <p><FaStopwatch /></p>
              <p>Prix/jour</p>
            </div>
          </div>

        </div>

      </div>
      <div className='recommend__car-card'>
        <div className='recommend__car-top'>
          <h5><span><FaChartArea /></span></h5>
        </div>
        <div className='recommend__car-img'>
          <img src={Cars2} />
        </div>
        <div className='recommend__car-bottom'>
          <h4>Marque</h4>

          <div className='recommend__car-other'>
            <div className='recommend__car-icons'>
              <p>Matricule</p>
              <p><IoMdSettings /></p>
              <p><FaStopwatch /></p>
              <p>Prix/jour</p>
            </div>
          </div>

        </div>

      </div>
   
    </>

  )
}

export default Car
