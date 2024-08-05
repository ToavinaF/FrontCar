import React, { useEffect, useState } from 'react';
import './Galerie.scss';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { IoAddCircleSharp } from 'react-icons/io5';
import { CiTrash } from 'react-icons/ci';
import { FaDownload } from "react-icons/fa";

const Galerie = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [Galerie, setGalerie] = useState([]);
  const [Open, setOpen] = useState(false);
  const [ImageIndex, setImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState([]);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    fetchImg();
  }, [id]);

  const handleDrop = (acceptedFiles) => {
    setSelectedImage(prevImages => [
      ...prevImages,
      ...acceptedFiles
    ]);
  };

  const handleRemoveImage = (index) => {
    setSelectedImage(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    multiple: true,
    accept: 'image/*'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    selectedImage.forEach(file => {
      data.append('images[]', file);
    });
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/addGalerie/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploadMessage(response.data.message || 'Images uploaded successfully');
      // navigate('/Home/listcar');
    } catch (error) {
      console.error(error);
      setUploadMessage('Error uploading images');
    }
  };

  const fetchImg = async () => {
    try {
      const ViewImg = await axios.get(`http://127.0.0.1:8000/api/viewGalerie/${id}`);
      setGalerie(ViewImg.data.galerie);
    } catch (error) {
      console.error('Error fetching images', error);
    }
  };

  const OpenModal = (index) => {
    setImageIndex(index);
    setOpen(true);
  };

  const CloseModal = () => {
    setOpen(false);
  };

  const nextImage = () => {
    setImageIndex((ImageIndex + 1) % Galerie.length);
  };

  const prevImage = () => {
    setImageIndex((ImageIndex + Galerie.length - 1) % Galerie.length);
  };

  return (
    <div className='contenaireGal'>
      {/* Drop zone */}
      <form onSubmit={handleSubmit} className='form'>
        <div className="image-upload">
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            {selectedImage.length > 0 && (
              <div className="barImg">
                {selectedImage.map((file, index) => (
                  <div key={index} className="partImg" onClick={(e) => e.stopPropagation()}>
                    <div className="image-container">
                      <img src={URL.createObjectURL(file)} alt={`Selected ${index}`} />
                      <div className="cach"><CiTrash className='check' onClick={() => handleRemoveImage(index)} /></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p>{t('Glissez-déposez une image ici, ou cliquez pour sélectionner une image')}</p>
            <IoAddCircleSharp className='plus' />
          </div>
        </div>
        <button type='submit' className='btn'><FaDownload className='down'/></button>
        {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
      </form>
      
      {/* end dropzone */}
      <h1>Marque du véhicule</h1>
      <h2>Description</h2>
      <div className="BlockGal">
        {
          Galerie.map((image, i) => (
            <div className="BlockImg" key={i} onClick={() => OpenModal(i)}>
              <div className='image-overlay'>
              <img src={`http://127.0.0.1:8000/storage/GalerieVehicule/${image.image}`} alt={`Galerie image ${i}`} />
                <div className="overlay buttons">
                  <button className="overlay-button" /*onClick={() => handleDelete(image.id)}*/>Supprimer</button>
                  <button className="overlay-button" /*onClick={() => handleSetProfile(image.image)}*/>Mettre comme photo de profil</button>
                </div>

              </div>
            </div>
          ))
        }
      </div>
      
      {/* Fenetre image */}
      <Modal
        isOpen={Open}
        onRequestClose={CloseModal}
        contentLabel="Image Modal"
        className="image-modal"
        overlayClassName="image-modal-overlay"
      >
        <div className="modal-content">
          <div className="content-Modal">
            <button onClick={CloseModal} className="close-button">X</button>
            <GrCaretPrevious className='prev-button' onClick={prevImage} />
            <img src={`http://127.0.0.1:8000/storage/GalerieVehicule/${Galerie[ImageIndex]?.image}`} alt={`Galerie image ${ImageIndex}`} className="modal-image" />
            <GrCaretNext className='next-button' onClick={nextImage} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Galerie;
