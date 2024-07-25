import React, { useEffect, useState } from 'react'
import { FaCog } from 'react-icons/fa';
import { BsSun, BsMoon } from 'react-icons/bs';
import Theme1 from '../../../assets/sary/viloet.png';
import Theme2 from '../../../assets/sary/rouge.png';
import Theme3 from '../../../assets/sary/bleuciel.png';
import Theme4 from '../../../assets/sary/bleu.png';
import Theme5 from '../../../assets/sary/jauneatre.png';
import Theme6 from '../../../assets/sary/gris.png';
import Theme7 from '../../../assets/sary/vert.png';
import Theme8 from '../../../assets/sary/jaune.png';
import Theme9 from '../../../assets/sary/grisclaire.png';
import './Theme.scss'
const color = [
    { id: 1, img: Theme1, couleur: 'hsl(271, 76%, 53%)', },
    { id: 2, img: Theme2, couleur: 'hsl(0, 94%, 38%)', },
    { id: 3, img: Theme3, couleur: 'hsl(0, 37%, 13%)', },
    { id: 4, img: Theme4, couleur: 'hsl(219, 83%, 44%)', },
    { id: 5, img: Theme5, couleur: 'hsl(59, 96%, 45%)', },
    { id: 6, img: Theme6, couleur: 'hsl(60, 1%, 28%)', },
    { id: 7, img: Theme7, couleur: 'hsl(123, 99%, 31%)', },
    { id: 8, img: Theme8, couleur: 'hsl(12, 90%, 49%)', },
    { id: 9, img: Theme9, couleur: 'hsl(12, 3%, 66%)', },
];
const getStorageCouleur = () => {
    let couleur = 'var(--principal-color)';
    if (localStorage.getItem('couleur')) {
        couleur = localStorage.getItem('couleur')
    }
    return couleur;
}
const getStorageDark = () => {
    let dark = 'dark-theme'
    if (localStorage.getItem('light-theme')) {
        dark = localStorage.getItem('light-theme')
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
        
            document.documentElement.style.setProperty('--principal-color', couleur);
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
                <div className='style__switcher-close' onClick={()=> setShow(!show)}>&times;</div>
            </div>
        </>
    )
}

export default Theme
