import React, { useEffect, useState } from 'react'
import './Galerie.scss';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";

const Galerie = () => {
    const { id } = useParams();
    const [Galerie, setGalerie] = useState([]);
    const [Open, setOpen] = useState(false);
    const [ImageIndex, setImageIndex] = useState(0);

    useEffect(() => {
        fetchImg();
    }, [id])

    //affichage boucle imgage
    const fetchImg = async () => {
        try {
            const ViewImg = await axios.get("http://127.0.0.1:8000/api/viewGalerie/" + id);
            setGalerie(ViewImg.data.galerie);
            console.log(ViewImg.data.galerie);
        } catch (error) {

        }
    };

    //affichage image par id clicke
    //ouverture du fenetre
    const OpenModal = (index) => {
        setImageIndex(index);
        setOpen(true);
    };
    //Fermeture du fenetre
    const CloseModal = () => {
        setOpen(false);
    }
    //deffilement des image
    const nextImage = () => {
        setImageIndex((ImageIndex + 1) % Galerie.length);
    };

    const prevImage = () => {
        setImageIndex((ImageIndex + Galerie.length - 1) % Galerie.length);
    };

    return (
        <div className='contenaireGal'>
            <h1>Marque du  vehicule</h1>
            <h2>Description</h2>
            <div className="BlockGal">
                {
                    Galerie.map((image, i) => {
                        return (
                            <div className="BlockImg" key={i} onClick={() => OpenModal(i)}>
                                <img src={`http://127.0.0.1:8000/storage/GalerieVehicule/${image.image}`} alt="{`Galerie image ${index}`}" />
                            </div>
                        )

                    })

                }
            </div>
            {/* fenetre image */}
            <Modal
                isOpen={Open}
                onRequestClose={CloseModal}
                contentLabel="Image Modal"
                className="image-modal"
                overlayClassName="image-modal-overlay"
            >
                {/* afficge image */}
                <div className="modal-content">
                    <div className="content-Modal">
                        <button onClick={CloseModal} className="close-button" >X</button>
                        {/* <button onClick={prevImage} className="nav-button prev-button">&lt;</button> */}
                        <GrCaretPrevious className='prev-button' onClick={prevImage}/>
                        <img src={`http://127.0.0.1:8000/storage/GalerieVehicule/${Galerie[ImageIndex]?.image}`} alt={`Galerie image ${ImageIndex}`} className="modal-image" />
                        {/* <button onClick={nextImage} className="nav-button next-button">&gt;</button> */}
                        <GrCaretNext className='next-button'onClick={nextImage} />
                    </div>

                </div>
            </Modal>
        </div>
    )
}

export default Galerie
