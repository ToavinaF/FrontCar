import React from 'react'
import './Profil.scss'
import Image from '../../assets/46.jpg'
import { useTranslation } from 'react-i18next';
const Profil = () => {
    const { t } = useTranslation();

    return (
        <div className='Profil'>
            <div className="headprofil">
                <h1><span>{t('salut')} </span></h1>

                <div className="content-profil">
                    <div className="imagePdc">
                        <img src={Image} alt="" />
                    </div>

                    <div className="prof-cont">
                        <div className="image-text">
                            <img src={Image} alt="" />
                            <div className="cont-span">
                                <h2><span> Mitchell C.Shay</span></h2>
                                <p>Concepteur UX / UI</p>
                            </div>
                            <div className="cont-span">
                                <h3>InfoExemple@gmail.com</h3>
                                <p>E-mail</p>
                            </div>
                        </div>
                        <div className="three-point">
                            <p><span>...</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profil