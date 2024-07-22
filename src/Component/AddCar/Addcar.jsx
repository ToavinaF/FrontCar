import React from 'react'
import './Addcar.scss'
const Addcar = () => {
    return (
       <>
            <div className="block">
                <form action="" className='form'>
                    <div className="parti-left">
                        <div className="image">

                        </div>
                        <div className="caracter">
                            <label htmlFor="">Marque du vehicule</label>
                            <input type="text" placeholder='Marque du vehicule' className='input' />
                        </div>   
                        <div className="caracter">
                        <label htmlFor="">Matricule du vehicule</label>
                            <input type="text" placeholder='Matricule du vehicule' className='input' />
                        </div>
                        <div className="caracter">
                        <label htmlFor="">Type de transmission</label>
                            <input type="text" placeholder='transmission' className='input' />
                        </div>                      
                    </div>
                    <div className="parti-right">
                        <div className="caracter">
                            <label htmlFor="">prix du vehicule</label>
                            <input type="text" placeholder='Prix du vehicule' className='input' />
                        </div>
                        <div className="caracter">
                            <label htmlFor="">poids du bagage</label>
                            <input type="text" placeholder='poids du bage' className='input' />
                        </div>
                     
                        <div className="caracter">
                            <label htmlFor="">Nombre de place</label>
                            <input type="text" placeholder='Nombre' className='input' />
                        </div>
                        <div className="caracter">
                            <label htmlFor="">Nombre de porte</label>
                            <input type="text" placeholder='Porte du vehicule' className='input' />
                        </div>
                        <div className="apro">
                            <label htmlFor="">Apropos du vehicule</label>
                            <textarea name="" id="" className='desc'></textarea>
                        </div>
                        <button className='btn'>Enregistre</button>
                    </div>

                </form>
            </div>
       </>
    )
}

export default Addcar