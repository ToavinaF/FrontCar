import React from 'react'
import './Profil.scss'
import Image from '../../assets/46.jpg'
import { useTranslation } from 'react-i18next';
const Profil = () => {
    const { t } = useTranslation();

    const image = localStorage.getItem('photo');
    const name = localStorage.getItem('userName');
    const firstname = localStorage.getItem('firstname'); // Assurez-vous que ce nom est correct
    const email = localStorage.getItem('email');
    const job = localStorage.getItem('Job');
    const role = localStorage.getItem('role');

    // console.log(image);
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
                            <img src={`http://127.0.0.1:8000/storage/${image}`} alt="" />
                            <div className="cont-span">
                                <h2><span> {name} {firstname}</span></h2>
                                <p>{job}</p>
                            </div>
                            <div className="cont-span">
                                <h3>{email}</h3>
                                <p>{role}</p>
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