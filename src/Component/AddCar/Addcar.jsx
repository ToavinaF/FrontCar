import React, { useState } from 'react';
import { IoCameraOutline } from "react-icons/io5";
import { IoAddCircleSharp } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import { CiCircleCheck, CiTrash } from "react-icons/ci";
import { useDropzone } from 'react-dropzone';
import './Addcar.scss';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Addcar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ShowUpload, setShowUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    marque: '',
    matricule: '',
    description: '',
    prix: '',
    porte: '',
    transmission: '',
    place: '',
    bagage: ''
  });

  const handleImageClick = () => {
    setShowUpload(true);
  };

  const handleDrop = (acceptedFiles) => {
    setSelectedImage(prevImages => [
      ...prevImages,
      ...acceptedFiles
    ]);
  };

  const handleRemoveImage = (index) => {
    setSelectedImage(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('marque', formData.marque);
    data.append('matricule', formData.matricule);
    data.append('description', formData.description);
    data.append('prix', formData.prix);
    data.append('porte', formData.porte);
    data.append('transmission', formData.transmission);
    data.append('place', formData.place);
    data.append('bagage', formData.bagage);
    data.append('photo', selectedImage[0]);
    selectedImage.forEach(file => {
      data.append('images[]', file);
    });
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/AddCar", data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      localStorage.setItem('message', response.data.message);
      navigate('/Home/listcar');


    } catch (error) {
      console.error(error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    multiple: true,
    accept: 'image/*'
  });

  return (
    <>
      <div className="block">
        <form onSubmit={handleSubmit} className='form'>
          {/* Drop zone */}
          <div className="image-upload">
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()}/>
                {selectedImage.length > 0 && (
                  <div className="barImg">
                    {selectedImage.map((file, index) => (
                      <div key={index} className="partImg" onClick={(e) => e.stopPropagation()}>
                        <div className="image-container">
                          <img src={URL.createObjectURL(file)} alt={`Selected ${index}`} />
                          <div className="cach"><CiTrash className='check' onClick={(e) => handleRemoveImage(index)} /></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              <p>{t('Glissez-déposez une image ici, ou cliquez pour sélectionner une image')}</p>
              <IoAddCircleSharp className='plus' />
            </div>

          </div>
          {/* end dropzone */}

          <div className="content_form">
            <div className="parti-left">
              {/* formulaire */}
                <div className="caracter">
                  <label htmlFor="marque"> {t('Marque du vehicule')}</label>
                  <input type="text" placeholder={t('Marque du vehicule')} className='input' name='marque' onChange={handleChange} />
                </div>
                <div className="caracter">
                  <label htmlFor="matricule">{t('Matricule du vehicule')}</label>
                  <input type="text" placeholder={t('Matricule du vehicule')} className='input' name='matricule' onChange={handleChange} />
                </div>
                <div className="caracter">
                  <label htmlFor="transmission">{t('Type de transmission')}</label>
                    <select name="transmission" className='input' onChange={handleChange}>
                      <option></option>
                      <option value="Automatique">Automatique</option>
                      <option value="Manuelle">Manuelle</option>
                    </select>
                </div>
            </div>

            <div className="parti-right">
              <div className="caracter">
                <label htmlFor="prix">{t('prix du vehicule')}</label>
                <input type="text" placeholder={t('prix du vehicule')} className='input' name='prix' onChange={handleChange} />
              </div>
              <div className="caracter">
                <label htmlFor="bagage">{t('Nombre de bagage')}</label>
                <select name="bagage" className='input' onChange={handleChange}>
                  <option></option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <div className="caracter">
                <label htmlFor="place">{t('Nombre de place')}</label>
                <select name="place" className='input' placeholder='nombre de place' onChange={handleChange}>
                  <option></option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>

                </select>
              </div>
              <div className="caracter">
                <label htmlFor="porte">{t('Nombre de porte')}</label>
                <select name="porte" className='input' onChange={handleChange}>
                  <option></option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div className="desc_car">
                <label htmlFor="description">{t('Apropos du vehicule')}</label>
                <textarea id="description" className='desc' name='description' onChange={handleChange}></textarea>
              </div>
              <button type='submit' className='btn'>{t('Enregistre')}</button>
            </div>

            {/* end formulaire */}
          </div>
        </form>
      </div>
    </>
  );
};

export default Addcar;
