import React, { useState } from 'react'
import Logo from "../../../assets/images/profile-02.png"
import './Facture.scss'
import QRCode from 'react-qr-code'
import { Button } from '@mui/material'
const Facture = () => {
    const [input , setInput ] = useState('')
    const [ qr, setQr] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const getQRCode = async (e) => {
       e.preventDefault()
       try{
            setIsLoading(true)
            const res = await fetch(``)
            console.log(res);
            setQr(res.url)
       }
       catch(error){
        console.log(error)
       }
       finally{
        setIsLoading(false)
       }
    }
    return (
        <div className='facture'>
            <div className='subheader'></div>
            <div className='header'>
                <div className='left'>
                    <div className='titre'>
                        <h1>FACTURE</h1>
                    </div>
                    <div className='Entreprise'>
                        <ul>
                            <li>Adresse de Entreprise</li>
                            <li>Ville de Entreprise</li>
                            <li>Contact de Entreprise</li>
                            <li>Email@Entreprise.com</li>
                        </ul>
                    </div>
                </div>
                <div className='right'>
                    <div className='logo'>
                        <img className='logo' src={Logo} alt="Logo" />
                        <h1>Location Cars</h1>
                    </div>
                    <div className='vehicule__info'>
                        <div className='facture__numero'>Numero de la facture</div>
                        <div className='facture__date'>June 19, 2030 </div>
                    </div>
                </div>
            </div>
            <div className='contents'>
                <div className='contents__one'>
                    <div className='left'>
                        <ul>
                            <li>
                                <h3>Nom</h3>
                                <p>Nom de preteur</p>
                            </li>

                            <li>
                                <h3>Addresse</h3>
                                <p>Adresse de preteur</p>
                            </li>
                        </ul>
                    </div>
                    <div className='right'>
                        <ul>
                            <li>
                                <h3>Phone Number</h3>
                                <p>Numero de telephone preteur</p>
                            </li>
                            <li>
                                <h3>Email</h3>
                                <p>Email de preteur</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='contents__two'>
                    <h1>Rental Detail</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Car Description</th>
                                <th>Rental Period</th>
                                <th>Price per Day</th>
                                <th>Number of Days</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Nom du voiture</td>
                                <td>septembre 10 2023</td>
                                <td>2000</td>
                                <td>3</td>
                                <td>150000</td>
                            </tr>
                            <tr>
                                <td>Nom du voiture</td>
                                <td>septembre 10 2023</td>
                                <td>2000</td>
                                <td>3</td>
                                <td>150000</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>Total</td>
                                <td>6</td>
                                <td>285000</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className='contents__free'>
                    <h1>Payment Method</h1>
                    <form>
                        <input type='radio' name='payment' className='input' value="cash"/>Cash
                        <input type='radio' name='payment' className='input' />Credit Card
                        <input type='radio' name='payment' className='input' />Bank Transfer
                        <input type='radio' name='payment' className='input' />Online Payment
                        <input type='radio' name='payment' className='input' />Mobile payment
                    </form>
                </div>
            </div>
            <div className='qr__code'>
                <h1>Générateur de QR</h1>
                <form onSubmit={getQRCode}>

                    <input
                        type = "texte"
                        placeholder = "par exemple"
                        value={input}
                        onChange = { (e) => setInput (e.cible.value)}
                    />
                    
                    {isLoading && <div className='loading'>
                        <span>Loading...</span>
                    </div>}
                    {!isLoading && (qr ? <img src={qr} alt="qrCode" /> : <div className='loading'>Loading...</div>)}
                        <input type='submit' value="Generate Qr COde" />
                </form>
            </div>
            <div className='footer'>

            </div>
            <div className='subfooter'></div>
        </div>
    )
}

export default Facture
