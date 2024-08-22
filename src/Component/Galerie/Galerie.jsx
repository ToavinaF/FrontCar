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
import { MdDeleteForever, MdOutlineExitToApp } from 'react-icons/md';

const Galerie = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [Galerie, setGalerie] = useState([]);
  const [Open, setOpen] = useState(false);
  const [ImageIndex, setImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState([]);
  const [uploadMessage, setUploadMessage] = useState('');
  const [ViewCar, setViewCar] = useState([]);
  const [profil, setProfil] = useState({
    nomPdp: '',
  });

  useEffect(() => {
    fetchImg();
    fetchCar();

  }, [id]);

  // affichage detaille car
  const fetchCar = async () => {
    const detail = await axios.get(`http://127.0.0.1:8000/api/detail/${id}`);
    setViewCar(detail.data.detailCar);
  }
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
      // affiche les image a l'instant

      const newImages = response.data.galerie;//recupere les image dans le DB
      setGalerie(prevGalerie => [...prevGalerie, ...newImages]);//metre a jour le galerie avec les nouvel image
      setUploadMessage(response.data.message || 'Images uploaded successfully');
      setSelectedImage([]);
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
  // suppresion d'un image
  const handDelete = async (id) => {
    const valid = await axios.delete('http://127.0.0.1:8000/api/PhotoDelete/' + id);
    const newGalerie = Galerie.filter((item) => {
      return (
        item.id !== id
      )
    })
    setGalerie(newGalerie);
    setOpen(false);

  }

  //modification pdp
  const handleSetProfile = async (image) => {
    // e.preventDefault();
    const data = new FormData();
    data.append('nomPdp', image)
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/photoPdp/" + id, data, {
        headers: {
          'methode': 'post'
        }
      })
      navigate('/Home/listcar')
    } catch (error) {
      console.error(error);
    }



  }
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
        <button type='submit' className='btn'><FaDownload className='down' /></button>
        {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
      </form>

      {/* end dropzone */}
      <h1>{ViewCar.marque}</h1>
      <h2>{ViewCar.description}</h2>
      <div className="BlockGal">
        {
          Galerie.map((image, i) => (
            <div className="BlockImg" key={i} onClick={() => OpenModal(i)}>
              <img src={`http://127.0.0.1:8000/storage/GalerieVehicule/${image.image}`} alt={`Galerie image ${i}`} />

              <div className='image-overlay'>
                <div className="overlay-buttons" onClick={(e) => e.stopPropagation()}>
                  <button className="btn-Over" onClick={() => handleSetProfile(image.image)}>Mettre comme photo de profil</button>
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
        // contentLabel="Image Modal"
        className="image-mol"
      // overlayClassName="image-modal-overlay"
      >
        <div className="modal-content">
          <div className="content-Modal">
            {/* <button>X</button> */}
            <MdOutlineExitToApp  onClick={CloseModal} className="close-button"/>
            <GrCaretPrevious className='prev-button' onClick={prevImage} />
            <MdDeleteForever className='delet' onClick={() => handDelete(Galerie[ImageIndex]?.id)} />

            <img src={`http://127.0.0.1:8000/storage/GalerieVehicule/${Galerie[ImageIndex]?.image}`} alt={`Galerie image ${ImageIndex}`} className="modal-image" />
            <GrCaretNext className='next-button' onClick={nextImage} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Galerie;
