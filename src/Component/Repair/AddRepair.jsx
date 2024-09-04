import React from 'react'
import ListCarBreakdown from './listCar/listCarBreakdown';

function AddRepair({searchTerm}) {
  return (
    <div>
      <ListCarBreakdown type={0} searchTerm={searchTerm}/>
    </div>
  )
}

export default AddRepair;