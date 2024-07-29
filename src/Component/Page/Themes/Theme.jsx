import React, { useEffect, useState } from 'react'
import { FaCog } from 'react-icons/fa';
import { BsSun, BsMoon } from 'react-icons/bs';
import Theme1 from '../../../assets/sary/jauneatre.png';
import Theme2 from '../../../assets/sary/rouge.png';
import Theme3 from '../../../assets/sary/bleuciel.png';
import Theme4 from '../../../assets/sary/bleu.png';
import Theme5 from '../../../assets/sary/viloet.png';
import Theme6 from '../../../assets/sary/gris.png';
import Theme7 from '../../../assets/sary/vert.png';
import Theme8 from '../../../assets/sary/jaune.png';
import Theme9 from '../../../assets/sary/grisclaire.png';
import './Theme.scss'
const color = [
    { id: 1, img: Theme1, couleur: '#ffc107', },
    { id: 2, img: Theme2, couleur: 'hsl(0, 94%, 38%)', },
    { id: 3, img: Theme3, couleur: 'hsl(0, 37%, 13%)', },
    { id: 4, img: Theme4, couleur: '#17a2b8', },
    { id: 5, img: Theme5, couleur: '#663259', },
    { id: 6, img: Theme6, couleur: '#6c757d', },
    { id: 7, img: Theme7, couleur: '#43dc80', },
    { id: 8, img: Theme8, couleur: 'hsl(12, 90%, 49%)', },
    { id: 9, img: Theme9, couleur: 'hsl(12, 3%, 66%)', },
];
const getStorageCouleur = () => {
    let couleur = 'var(--color-principal)';
    if (localStorage.getItem('couleur')) {
        couleur = localStorage.getItem('couleur')
    }
    return couleur;
}
const getStorageDark = () => {
    let dark = 'dark-theme'
    if (localStorage.getItem('dark')) {
        dark = localStorage.getItem('dark')
    }
    return dark;
}
const Theme = () => {
    const [show, setShow] = useState(false);
    const [couleur, setCouleur] = useState(getStorageCouleur());
    const [dark, setDark] = useState(getStorageDark());
    const changeCouleur = (couleur) => {
        setCouleur(couleur);
    }
    const changeDark = () => {
        if (dark === 'dark-theme') {
            setDark('light-theme');
        }
        else {
            setDark('dark-theme');
        }
    };
    useEffect(() => {

        document.documentElement.className = dark;
        localStorage.setItem('dark', dark);

    }, [dark]);
    useEffect(() => {

        document.documentElement.style.setProperty('--color-principal', couleur);
        localStorage.setItem('couleur', couleur);

    }, [couleur]);
    return (
        <>
            <div className={`${show ? 'show-switcher' : ''} style__switcher`}>
                <div className='style__switcher-toggler' onClick={() => setShow(!show)}>
                    <FaCog />
                </div>
                <div className='dark__toggler' onClick={changeDark}>
                    {dark === 'dark-theme' ? <BsSun /> : <BsMoon />}
                </div>
                <h3 className='style__switcher-title'>Style Switcher</h3>
                <div className='style__switcher-items'>
                    {color.map(({ id, couleur, img }) => {
                        return (<img key={id} src={img} alt='' className='theme__img' onClick={() => { changeCouleur(couleur) }} />)
                    })}
                </div>
                <div className='style__switcher-close' onClick={() => setShow(!show)}>&times;</div>
            </div>
        </>
    )
}

export default Theme
