import React, { useEffect, useState } from 'react';
import './Galerie.scss';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";

const Galerie = () => {
    const { id } = useParams();
    const [galerie, setGalerie] = useState([]);
    const [open, setOpen] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    useEffect(() => {
        fetchImg();
    }, [id]);

    // Affichage boucle image
    const fetchImg = async () => {
        try {
            const viewImg = await axios.get(`http://127.0.0.1:8000/api/viewGalerie/${id}`);
            setGalerie(viewImg.data.galerie);
            console.log(viewImg.data.galerie);
        } catch (error) {
            console.error(error);
        }
    };

    // Ouverture du modal à l'image cliquée
    const openModal = (index) => {
        setImageIndex(index);
        setOpen(true);
    };

    // Fermeture du modal
    const closeModal = () => {
        setOpen(false);
    };

    // Défilement des images
    const nextImage = () => {
        setImageIndex((imageIndex + 1) % galerie.length);
    };

    const prevImage = () => {
        setImageIndex((imageIndex + galerie.length - 1) % galerie.length);
    };

    return (
        <div className='contenaireGal'>
            <h1>Marque du véhicule</h1>
            <h2>Description</h2>
            <div className="BlockGal">
                {galerie.map((image, i) => (
                    <div className="BlockImg" key={i} onClick={() => openModal(i)}>
                        <img src={`http://127.0.0.1:8000/storage/GalerieVehicule/${image.image}`} alt={`Galerie image ${i}`} />
                    </div>
                ))}
            </div>

            {/* Fenêtre image */}
            <Modal
                isOpen={open}
                onRequestClose={closeModal}
                className="custom-modal"
                overlayClassName="custom-overlay"
            >
                <div className="modal-content">
                    <div className="content-Modal">
                        <button onClick={closeModal} className="close-button">X</button>
                        <GrCaretPrevious className='prev-button' onClick={prevImage} />
                        <img src={`http://127.0.0.1:8000/storage/GalerieVehicule/${galerie[imageIndex]?.image}`} alt={`Galerie image ${imageIndex}`} className="modal-image" />
                        <GrCaretNext className='next-button' onClick={nextImage} />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Galerie;
