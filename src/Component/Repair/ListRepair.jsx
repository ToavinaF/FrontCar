import React from 'react'
import ListCarBreakdown from './listCar/listCarBreakdown';

function ListRepair({searchTerm}) {

  return (
    <div>
      <ListCarBreakdown type={1} searchTerm={searchTerm}/>
    </div>
  )
}

export default ListRepair;